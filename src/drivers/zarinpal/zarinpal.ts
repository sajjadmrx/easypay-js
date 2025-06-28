import axios from 'axios'
import { ZarinpalUrls } from './enums/urls.enum'
import {
  TransactionCreateInputZp,
  TransactionCreateResponseZp,
  TransactionVerifyInputZp,
  TransactionVerifyResponseZp
} from './interfaces/requests.interface'
import { zarinPalErrors } from './enums/errors.enum'

interface Verify {
  data: {
    code: number
    message: string
    card_hash: string
    card_pan: string
    ref_id: number
    fee_type: string
    fee: number
  }
  errors: {
    code: number

    message: string

    validations: Record<keyof TransactionCreateInputZp, string>[]
  }
}

/**
 * Class to interact with the ZarinPal payment gateway.
 *
 * @class ZarinPalDriver
 */
export class ZarinPalDriver {
  private merchant_id: string | null = null
  private timeout: number = 1000 * 10 // 10 seconds by default

  /**
   * Set the merchant ID for the ZarinPal driver.
   *
   * @param {string} merchant_id - The merchant ID to set.
   * @returns {this} Instance of ZarinPalDriver.
   */
  setToken(merchant_id: string): this {
    if (!merchant_id) throw new Error('invalid parameters')
    this.merchant_id = merchant_id
    return this
  }

  /**
   * Set requests timeout for the ZarinPal driver.
   *
   * @param {string} timeoutInMs - Request timeout
   * @returns {this} Instance of ZarinPalDriver.
   */
  setTimeout(timeoutInMs: number): this {
    if (!timeoutInMs || timeoutInMs < 0) throw new Error('invalid parameters')
    this.timeout = timeoutInMs
    return this
  }



  /**
   * Create a payment request to ZarinPal.
   *
   * @param {TransactionCreateInputZp} data - Input data for creating the transaction.
   * @param {boolean} [sandbox=false] - Flag to determine whether to use the sandbox environment.
   * @returns {Promise<TransactionCreateResponseZp>} Response from the ZarinPal API for creating a transaction.
   */
  async request(data: TransactionCreateInputZp, sandbox: boolean = false): Promise<TransactionCreateResponseZp> {
    try {
      if (!data.amount || !data.description || !data.callback_url) throw new Error('invalid parameters')

      const requestUrl = sandbox ? ZarinpalUrls.SANDBOX_REQUEST : ZarinpalUrls.REQUEST

      const { data: dataAxios } = await axios.post(requestUrl, {
        ...data,
        merchant_id: data.merchant_id || this.merchant_id
      }, {
        timeout: this.timeout
      })

      dataAxios.isError = dataAxios.errors.code < 0
      if (dataAxios.isError) {
        return {
          data: dataAxios.data,
          error: {
            message: zarinPalErrors[dataAxios.errors.code],
            code: dataAxios.errors.code,
            validations: dataAxios.errors.validations,
            type: 'payment' // This is a payment creation failure
          },
          isError: true
        }
      }

      const url = sandbox ? ZarinpalUrls.SANDBOX_REQUEST_PAGE : ZarinpalUrls.REQUEST_PAGE

      dataAxios.data.url = `${url}/${dataAxios.data.authority}`

      return dataAxios
    } catch (error: any) {
      if (error.isAxiosError) {
        // Check if this is a network error (no response received)
        if (!error.response) {
          // Network timeout, connection refused, DNS issues, etc.
          return {
            data: error.response?.data?.data,
            isError: true,
            error: {
              code: 'NETWORK_ERROR',
              message: `Network error: ${error.message}`,
              validations: [],
              type: 'network' // This is a network-related error
            }
          }
        }
        
        // This is an HTTP error (response received but with error status)
        const apiErrorCode = error.response.data?.errors?.code
        return {
          data: error.response?.data?.data,
          isError: true,
          error: {
            code: apiErrorCode || error.response?.status,
            message: zarinPalErrors[apiErrorCode] || `HTTP Error: ${error.message}`,
            validations: error.response.data?.errors?.validations || [],
            type: apiErrorCode ? 'payment' : 'api' // Distinguish between payment errors and API errors
          }
        }
      }
      error.isError = true
      throw error
    }
  }

  /**
   * Verify a payment transaction with ZarinPal.
   *
   * @param {TransactionVerifyInputZp} data - Input data for verifying the transaction.
   * @param {boolean} [sandbox=false] - Flag to determine whether to use the sandbox environment.
   * @returns {Promise<TransactionVerifyResponseZp>} Response from the ZarinPal API for verifying a transaction.
   */
  async verify(data: TransactionVerifyInputZp, sandbox: boolean = false): Promise<TransactionVerifyResponseZp> {
    try {
      const requestUrl = sandbox ? ZarinpalUrls.SANDBOX_VERIFY : ZarinpalUrls.VERIFY
      const { data: verifyData } = await axios.post<Verify>(requestUrl, {
        ...data,
        merchant_id: data.merchant_id || this.merchant_id
      },
        {
          timeout: this.timeout
        })

      const code: number | undefined = verifyData.data.code

      let isError = false
      if (!code || code !== 100) {
        isError = true
      }

      if (isError) {
        return {
          isError: true,
          error: {
            code: verifyData.errors.code || verifyData.data.code,
            validations: verifyData.errors.validations,
            message: zarinPalErrors[verifyData.errors.code || verifyData.data.code],
            type: 'payment' // This is a payment verification failure
          }
        }
      }

      return {
        data: verifyData.data,
        isError: false
      }
    } catch (error: any) {
      if (error.isAxiosError) {
        // Check if this is a network error (no response received)
        if (!error.response) {
          // Network timeout, connection refused, DNS issues, etc.
          return {
            isError: true,
            error: {
              code: 'NETWORK_ERROR',
              message: `Network error: ${error.message}`,
              validations: [],
              type: 'network' // This is a network-related error
            }
          }
        }
        
        // This is an HTTP error (response received but with error status)
        // Could be server error (5xx) or API error (4xx)
        const apiErrorCode = error.response.data?.errors?.code
        return {
          isError: true,
          error: {
            code: apiErrorCode || error.response.status,
            message: zarinPalErrors[apiErrorCode] || `HTTP Error: ${error.message}`,
            validations: error.response.data?.errors?.validations || [],
            type: apiErrorCode ? 'payment' : 'api' // Distinguish between payment errors and API errors
          }
        }
      }
      
      // Non-axios error, re-throw
      error.isError = true
      throw error
    }
  }
}
