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
      })

      dataAxios.isError = dataAxios.errors.code < 0
      if (dataAxios.isError) {
        return {
          data: dataAxios.data,
          error: {
            message: zarinPalErrors[dataAxios.errors.code],
            code: dataAxios.errors.code,
            validations: dataAxios.errors.validations
          },
          isError: true
        }
      }

      const url = sandbox ? ZarinpalUrls.SANDBOX_REQUEST_PAGE : ZarinpalUrls.REQUEST_PAGE

      dataAxios.data.url = `${url}/${dataAxios.data.authority}`

      return dataAxios
    } catch (error: any) {
      if (error.isAxiosError) {
        return {
          data: error.response.data.data,
          isError: true,
          error: {
            code: error.response.data?.errors?.code || error.response.status,
            message: zarinPalErrors[error.response.data?.errors?.code] || error.message,
            validations: []
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
            message: zarinPalErrors[verifyData.errors.code || verifyData.data.code]
          }
        }
      }

      return {
        data: verifyData.data,
        isError: false
      }
    } catch (error: any) {
      if (error.isAxiosError) {
        return {
          isError: true,
          error: {
            code: error.response.data?.errors?.code || error.response.status,
            message: zarinPalErrors[error.response.data?.errors?.code] || error.message,
            validations: []
          }
        }
      }
      error.isError = true
      throw error
    }
  }
}
