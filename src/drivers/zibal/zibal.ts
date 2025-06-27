import axios from 'axios'
import { ZibalUrls } from './enums/urls.enum'
import { TransactionCreateInputZibal, TransactionVerifyInputZibal } from './interfaces/requests.interface'
import { TransactionCreateResponseZibal, TransactionVerifyResponseZibal } from './interfaces/response.interface'
import { zibalMessages } from './enums/message.enum'

/**
 * Class to interact with the Zibal payment gateway.
 *
 * @class ZibalDriver
 */
export class ZibalDriver {
  private merchant: string | null = null
  private timeout: number = 1000 * 10 // 10 seconds by default

  setToken(merchant: string): this {
    if (!merchant) {
      throw new Error('invalid parameters')
    }

    this.merchant = merchant
    return this
  }

  /**
   * Set requests timeout for the Zibal driver.
   *
   * @param {string} timeoutInMs - Request timeout
   * @returns {this} Instance of ZibalDriver.
   */
  setTimeout(timeoutInMs: number): this {
    if (!timeoutInMs || timeoutInMs < 0) throw new Error('invalid parameters')
    this.timeout = timeoutInMs
    return this
  }

  /**
   * Create a payment request to Zibal.
   *
   * @param {TransactionCreateInputZibal} data - Input data for creating the transaction.
   * @param {boolean} [sandbox=false] - Flag to determine whether to use the sandbox environment.
   * @returns {Promise<TransactionCreateResponseZibal>} Response from the Zibal API for creating a transaction.
   */
  async request(data: TransactionCreateInputZibal, sandbox: boolean = false): Promise<TransactionCreateResponseZibal> {
    try {
      if (!sandbox) {
        if (!this.merchant && !data.merchant) {
          throw new Error(`merchant is required for this request`)
        }
      }

      if (!data.amount || !data.callbackUrl) {
        throw new Error('invalid parameters')
      }

      const requestUrl = ZibalUrls.REQUEST

      const { data: dataAxios } = await axios.post(requestUrl, {
        ...data,
        merchant: sandbox ? 'zibal' : this.merchant || data.merchant
      },
    {
      timeout: this.timeout
    })

      dataAxios.isError = dataAxios.result !== 100
      if (dataAxios.isError) {
        return {
          data: null,
          error: {
            message: zibalMessages[dataAxios.result] || dataAxios.message,
            code: 0
          },
          isError: true
        }
      }

      return {
        isError: false,
        error: null,
        data: {
          trackId: dataAxios.trackId,
          url: `https://gateway.zibal.ir/start/${dataAxios.trackId}`
        }
      }
    } catch (error: any) {
      const message = error.message || 'An error occurred while processing the request'
      return {
        error: {
          message,
          code: error.code || 500
        },
        isError: true,
        data: null
      }
    }
  }

  /**
   * Verify a payment transaction with Zibal.
   *
   * @param {TransactionVerifyInputZibal} data - Input data for verifying the transaction.
   * @param {boolean} [sandbox=false] - Flag to determine whether to use the sandbox environment.
   * @returns {Promise<TransactionVerifyResponseZibal>} Response from the Zibal API for verifying a transaction.
   */
  async verify(data: TransactionVerifyInputZibal, sandbox: boolean): Promise<TransactionVerifyResponseZibal> {
    try {
      if (!sandbox) {
        if (!this.merchant && !data.merchant) {
          throw new Error(`merchant is required for this request`)
        }
      }

      if (!data.trackId) {
        throw new Error(`trackId is required for this request`)
      }

      const requestUrl = ZibalUrls.VERIFY

      const { data: dataAxios } = await axios.post(requestUrl, {
        ...data,
        merchant: sandbox ? 'zibal' : this.merchant || data.merchant
      }, {
        timeout: this.timeout
      })

      dataAxios.isError = dataAxios.result !== 100

      if (dataAxios.isError) {
        return {
          data: null,
          error: {
            message: zibalMessages[dataAxios.result] || dataAxios.message,
            code: 0
          },
          isError: true
        }
      }

      return {
        data: {
          amount: dataAxios.amount,
          cartNumber: dataAxios.cardNumber,
          description: dataAxios.description,
          message: dataAxios.message,
          multiplexingInfos: dataAxios.multiplexingInfos,
          orderId: dataAxios.orderId,
          paidAt: dataAxios.paidAt,
          refNumber: dataAxios.refNumber,
          status: dataAxios.status
        },
        isError: false,
        error: null
      }
    } catch (error: any) {
      const message = error.message || 'An error occurred while processing the request'
      return {
        error: {
          message,
          code: error.code || 500
        },
        isError: true,
        data: null
      }
    }
  }
}
