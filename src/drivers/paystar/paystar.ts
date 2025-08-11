import axios from 'axios'
import crypto from 'crypto'
import { PayStarUrls } from './enums/urls.enum'
import {
  TransactionCreateInputPayStar,
  TransactionVerifyInputPayStar,
  TransactionInquiryInputPayStar
} from './interfaces/request.interface'
import {
  TransactionCreateResponsePayStar,
  TransactionVerifyResponsePayStar,
  TransactionInquiryResponsePayStar
} from './interfaces/response.interface'

/**
 * Class to interact with the PayStar payment gateway.
 *
 * PayStar uses HMAC SHA512 signatures for security.
 * All requests require proper signature generation.
 *
 * @class PayStarDriver
 */
export class PayStarDriver {
  private gateway_id: string | null = null
  private sign_key: string | null = null
  private timeout: number = 1000 * 10

  /**
   * Set the gateway ID for PayStar authentication.
   *
   * @param {string} gateway_id - The gateway ID to set.
   * @returns {this} Instance of PayStarDriver.
   */
  setToken(gateway_id: string): this {
    if (!gateway_id) throw new Error('invalid parameters')
    this.gateway_id = gateway_id
    return this
  }

  /**
   * Set the signing key for HMAC signature generation.
   * This is required for all PayStar transactions.
   *
   * @param {string} sign_key - The signing key for HMAC generation.
   * @returns {this} Instance of PayStarDriver.
   */
  setSignKey(sign_key: string): this {
    if (!sign_key) throw new Error('invalid sign_key parameter')
    this.sign_key = sign_key
    return this
  }

  /**
   * Set requests timeout for the PayStar driver.
   *
   * @param {number} timeoutInMs - Request timeout in milliseconds.
   * @returns {this} Instance of PayStarDriver.
   */
  setTimeout(timeoutInMs: number): this {
    if (!timeoutInMs || timeoutInMs < 0) throw new Error('invalid parameters')
    this.timeout = timeoutInMs
    return this
  }

  /**
   * Generate HMAC SHA512 signature for PayStar requests.
   * PayStar requires HMAC signatures for all transactions.
   *
   * @private
   * @param {string} message - The message to sign.
   * @returns {string} HMAC SHA512 signature in lowercase hex.
   * @throws {Error} If sign_key is not set.
   */
  private generateSignature(message: string): string {
    if (!this.sign_key) {
      throw new Error('sign_key is required for signature generation. Use setSignKey() method.')
    }

    return crypto.createHmac('sha512', this.sign_key).update(message, 'utf8').digest('hex').toLowerCase()
  }

  /**
   * Generate signature for transaction creation.
   * Signature format: amount#order_id#callback
   *
   * @private
   * @param {number} amount - Transaction amount.
   * @param {string} order_id - Order ID.
   * @param {string} callback - Callback URL.
   * @returns {string} Generated signature.
   */
  private generateCreateSignature(amount: number, order_id: string, callback: string): string {
    const message = `${amount}#${order_id}#${callback}`
    return this.generateSignature(message)
  }

  /**
   * Generate signature for transaction verification.
   * Signature format: ref_num#amount#card_number#tracking_code
   * Note: card_number and tracking_code come from callback payload
   *
   * @private
   * @param {string} ref_num - Reference number.
   * @param {number} amount - Transaction amount.
   * @param {string} card_number - Card number from callback (optional).
   * @param {string} tracking_code - Tracking code from callback (optional).
   * @returns {string} Generated signature.
   */
  private generateVerifySignature(ref_num: string, amount: number, card_number: string, tracking_code: string): string {
    const message = `${amount}#${ref_num}#${card_number}#${tracking_code}`
    console.log(message)
    return this.generateSignature(message)
  }

  /**
   * Create a payment request to PayStar.
   * Automatically generates HMAC signature if not provided.
   *
   * @param {TransactionCreateInputPayStar} data - Input data for creating the transaction.
   * @returns {Promise<TransactionCreateResponsePayStar>} Response from the PayStar API for creating a transaction.
   */
  async request(data: TransactionCreateInputPayStar): Promise<TransactionCreateResponsePayStar> {
    try {
      if (!data.amount || data.amount < 5000) {
        throw new Error('amount is required and must be at least 5000 IRR')
      }
      if (!data.order_id || !data.callback) {
        throw new Error('order_id and callback are required parameters')
      }

      const gateway_id = data.gateway_id || this.gateway_id
      if (!gateway_id) {
        throw new Error('gateway_id is required. Set it via setToken() or pass it in data.')
      }

      const sign = this.generateCreateSignature(data.amount, data.order_id, data.callback)

      const payload = {
        ...data,
        gateway_id,
        sign
      }

      const { data: responseData } = await axios.post(PayStarUrls.REQUEST, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${gateway_id}`
        },
        timeout: this.timeout
      })

      if (responseData.status === 1 || responseData.status === 'ok') {
        const token = responseData.data?.token || responseData.token
        const ref_num = responseData.data?.ref_num || responseData.ref_num

        return {
          isError: false,
          data: {
            token,
            ref_num,
            url: `${PayStarUrls.PAYMENT_PAGE}?token=${token}`
          },
          error: null
        }
      } else {
        return {
          isError: true,
          data: null,
          error: {
            code: responseData.status || 'unknown',
            message: responseData.message || 'Unknown PayStar error'
          }
        }
      }
    } catch (error: any) {
      if (error.isAxiosError) {
        const errorData = error.response?.data
        return {
          isError: true,
          data: null,
          error: {
            code: errorData?.status || error.response?.status || 'network_error',
            message: errorData?.message || error.message || 'Network error occurred'
          }
        }
      } else {
        throw error
      }
    }
  }

  /**
   * Verify a PayStar transaction.
   * Must be called within 10 minutes of payment completion.
   *
   * @param {TransactionVerifyInputPayStar} data - Input data for verifying the transaction.
   * @param {string} card_number - Card number from callback payload (optional).
   * @param {string} tracking_code - Tracking code from callback payload (optional).
   * @returns {Promise<TransactionVerifyResponsePayStar>} Response from the PayStar API for verifying a transaction.
   */
  async verify(data: TransactionVerifyInputPayStar): Promise<TransactionVerifyResponsePayStar> {
    try {
      if (!data.ref_num || !data.amount) {
        throw new Error('ref_num and amount are required parameters')
      }

      const gateway_id = data.gateway_id || this.gateway_id
      if (!gateway_id) {
        throw new Error('gateway_id is required. Set it via setToken() or pass it in data.')
      }

      const sign = this.generateVerifySignature(data.ref_num, data.amount, data.card_number, data.tracking_code)

      const payload = {
        ...data,
        gateway_id,
        sign
      }

      const { data: responseData } = await axios.post(PayStarUrls.VERIFY, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${gateway_id}`
        },
        timeout: this.timeout
      })

      if (responseData.status === 1 || responseData.status === 'ok') {
        return {
          isError: false,
          data: {
            status: responseData.data?.status || responseData.status,
            order_id: responseData.data?.order_id || '',
            ref_num: responseData.data?.ref_num || data.ref_num,
            transaction_id: responseData.data?.transaction_id || '',
            card_number: responseData.data?.card_number || data.card_number,
            hashed_card_number: responseData.data?.hashed_card_number || '',
            tracking_code: responseData.data?.tracking_code || data.tracking_code,
            amount: responseData.data?.amount || data.amount,
            date: responseData.data?.date || new Date().toISOString()
          },
          error: null
        }
      } else {
        return {
          isError: true,
          data: null,
          error: {
            code: responseData.status || 'unknown',
            message: responseData.message || 'Unknown PayStar error'
          }
        }
      }
    } catch (error: any) {
      if (error.isAxiosError) {
        const errorData = error.response?.data
        return {
          isError: true,
          data: null,
          error: {
            code: errorData?.status || error.response?.status || 'network_error',
            message: errorData?.message || error.message || 'Network error occurred'
          }
        }
      } else {
        throw error
      }
    }
  }

  /**
   * Inquire about a PayStar transaction.
   * This is idempotent and can be called multiple times.
   *
   * @param {TransactionInquiryInputPayStar} data - Input data for inquiring about the transaction.
   * @returns {Promise<TransactionInquiryResponsePayStar>} Response from the PayStar API for transaction inquiry.
   */
  async inquiry(data: TransactionInquiryInputPayStar): Promise<TransactionInquiryResponsePayStar> {
    try {
      if (!data.ref_num) {
        throw new Error('ref_num is a required parameter')
      }

      const gateway_id = data.gateway_id || this.gateway_id
      if (!gateway_id) {
        throw new Error('gateway_id is required. Set it via setToken() or pass it in data.')
      }

      const payload = {
        ...data,
        gateway_id
      }

      const { data: responseData } = await axios.post(PayStarUrls.INQUIRY, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${gateway_id}`
        },
        timeout: this.timeout
      })

      if (responseData.status === 1 || responseData.status === 'ok') {
        return {
          isError: false,
          data: {
            status: responseData.data?.status || responseData.status,
            order_id: responseData.data?.order_id || '',
            ref_num: responseData.data?.ref_num || data.ref_num,
            transaction_id: responseData.data?.transaction_id || '',
            card_number: responseData.data?.card_number || '',
            hashed_card_number: responseData.data?.hashed_card_number || '',
            tracking_code: responseData.data?.tracking_code || '',
            amount: responseData.data?.amount,
            date: responseData.data?.date || new Date().toISOString()
          },
          error: null
        }
      } else {
        return {
          isError: true,
          data: null,
          error: {
            code: responseData.status || 'unknown',
            message: responseData.message || 'Unknown PayStar error'
          }
        }
      }
    } catch (error: any) {
      if (error.isAxiosError) {
        const errorData = error.response?.data
        return {
          isError: true,
          data: null,
          error: {
            code: errorData?.status || error.response?.status || 'network_error',
            message: errorData?.message || error.message || 'Network error occurred'
          }
        }
      } else {
        throw error
      }
    }
  }
}
