import axios from 'axios'
import { IdPayUrls } from './enums/urls.enum'
import { TransactionCreateInputIdPay, TransactionVerifyInputIdPay } from './interfaces/request.interface'
import { TransactionCreateResponseIdPay, TransactionVerifyResponseIdPay } from './interfaces/response.interface'

/**
 * Class that provides methods to interact with the IdPay API.
 *
 * @class IdPayDriver
 */
export class IdPayDriver {
  private token: string | null = null
  private sandBox: boolean = false

  /**
   * Set the API token for authentication.
   *
   * @param {string} token - The API token.
   * @returns {this} Instance of IdPayDriver.
   */
  setToken(token: string): this {
    this.token = token
    return this
  }

  /**
   * Set whether to use the sandbox environment or not.
   *
   * @param {boolean} sandBox - True to use sandbox, false otherwise.
   * @returns {this} Instance of IdPayDriver.
   */
  setSandBox(sandBox: boolean): this {
    this.sandBox = sandBox
    return this
  }

  /**
   * Request method to create a transaction.
   *
   * @param {TransactionCreateInputIdPay} dataInput - Input data for creating the transaction.
   * @returns {Promise<TransactionCreateResponseIdPay>} Response from the IdPay API for creating a transaction.
   */
  async request(dataInput: TransactionCreateInputIdPay): Promise<TransactionCreateResponseIdPay> {
    try {
      const { data } = await axios.post(IdPayUrls.REQUEST, dataInput, {
        headers: this.getHeader(this.token || dataInput.token, this.sandBox)
      })
      return {
        isError: false,
        data: {
          id: data.id,
          link: data.link
        },
        error_code: null,
        error_message: null
      }
    } catch (error: any) {
      if (error.isAxiosError) {
        return {
          isError: true,
          error_message: error.response.data.error_message,
          error_code: error.response.data.error_code,
          data: {} as any
        }
      } else throw error
    }
  }

  /**
   * Verify method to verify a transaction.
   *
   * @param {TransactionVerifyInputIdPay} dataInput - Input data for verifying the transaction.
   * @returns {Promise<TransactionVerifyResponseIdPay>} Response from the IdPay API for verifying a transaction.
   */
  async verify(dataInput: TransactionVerifyInputIdPay): Promise<TransactionVerifyResponseIdPay> {
    try {
      const { data } = await axios.post(IdPayUrls.VERIFY, dataInput, {
        headers: this.getHeader(this.token || dataInput.token, this.sandBox)
      })
      return {
        isError: false,
        error_message: null,
        error_code: null,
        data: data
      }
    } catch (error: any) {
      if (error.isAxiosError) {
        return {
          isError: true,
          error_message: error.response.data.error_message,
          error_code: error.response.data.error_code,
          data: {} as any
        }
      } else throw error
    }
  }

  /**
   * Generate headers for the HTTP requests.
   *
   * @private
   * @param {string | undefined} token - API token.
   * @param {boolean} sandbox - Whether sandbox environment should be used.
   * @returns {Record<string, string>} Headers for the HTTP request.
   * @throws {Error} Throws an error if token is not provided.
   */
  private getHeader(token: string | undefined, sandbox: boolean) {
    if (!token) throw new Error('token is required')
    return {
      'Content-Type': 'application/json',
      'X-API-KEY': token,
      'X-SANDBOX': sandbox
    }
  }
}
