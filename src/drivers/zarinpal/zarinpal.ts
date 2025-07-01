import axios from 'axios'
import { ZarinpalUrls } from './enums/urls.enum'
import {
  TransactionCreateInputZp,
  TransactionCreateResponseZp,
  TransactionInquiryInputZp,
  TransactionInquiryResponseZp,
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
  private customDomain: string | null = null // Custom domain for ZarinPal API requests

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
   * Set custom domain for ZarinPal API requests.
   * If not set, will fallback to default ZarinPal domains.
   *
   * IMPORTANT: Custom domain is ONLY used for API calls (request, verify, inquiry).
   * Payment page URLs always use default ZarinPal domains to ensure proper payment processing.
   *
   * @param {string} domain - Custom domain (e.g., 'api.example.com')
   * @returns {this} Instance of ZarinPalDriver.
   */
  setCustomDomain(domain: string): this {
    if (!domain || typeof domain !== 'string') throw new Error('invalid domain parameter')
    // Remove trailing slash and protocol if provided
    this.customDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
    return this
  }

  /**
   * Get the appropriate URL for a request, using custom domain if set, fallback to default.
   *
   * @private
   * @param {string} defaultUrl - Default ZarinPal URL from enum
   * @returns {string} The constructed URL
   */
  private getUrl(defaultUrl: string): string {
    if (!this.customDomain) {
      return defaultUrl
    }

    // Extract the path from the default URL
    const urlObj = new URL(defaultUrl)
    const path = urlObj.pathname

    // Construct custom URL with custom domain
    return `https://${this.customDomain}${path}`
  }

  /**
   * Get the appropriate payment page URL. Always uses default ZarinPal domains.
   * Payment pages should not use custom domains as they host the actual payment form.
   *
   * @private
   * @param {boolean} sandbox - Whether this is for sandbox environment
   * @returns {string} The payment page base URL
   */
  private getPaymentPageUrl(sandbox: boolean = false): string {
    // Payment page always uses default ZarinPal domains
    return sandbox ? ZarinpalUrls.SANDBOX_REQUEST_PAGE : ZarinpalUrls.REQUEST_PAGE
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

      const defaultRequestUrl = sandbox ? ZarinpalUrls.SANDBOX_REQUEST : ZarinpalUrls.REQUEST
      const requestUrl = this.getUrl(defaultRequestUrl)

      const { data: dataAxios } = await axios.post(
        requestUrl,
        {
          ...data,
          merchant_id: data.merchant_id || this.merchant_id
        },
        {
          timeout: this.timeout
        }
      )

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

      const paymentPageUrl = this.getPaymentPageUrl(sandbox)

      // Handle trailing slash to avoid double slashes
      const cleanUrl = paymentPageUrl.endsWith('/') ? paymentPageUrl.slice(0, -1) : paymentPageUrl
      dataAxios.data.url = `${cleanUrl}/${dataAxios.data.authority}`

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
      const defaultVerifyUrl = sandbox ? ZarinpalUrls.SANDBOX_VERIFY : ZarinpalUrls.VERIFY
      const requestUrl = this.getUrl(defaultVerifyUrl)
      const { data: verifyData } = await axios.post<Verify>(
        requestUrl,
        {
          ...data,
          merchant_id: data.merchant_id || this.merchant_id
        },
        {
          timeout: this.timeout
        }
      )

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

  /**
   * Inquiry a payment transaction with ZarinPal.
   *
   * @param {string} authority - Transaction unique key.
   * @param {boolean} [sandbox=false] - Flag to determine whether to use the sandbox environment.
   * @returns {Promise<TransactionInquiryResponseZp>} Response from the ZarinPal API for inquerying a transaction.
   */
  async inquiry(data: TransactionInquiryInputZp, sandbox: boolean = false): Promise<TransactionInquiryResponseZp> {
    try {
      if (!data.authority) throw new Error('invalid parameters')

      const defaultInquiryUrl = sandbox ? ZarinpalUrls.SANDBOX_INQUERY : ZarinpalUrls.INQUERY
      const requestUrl = this.getUrl(defaultInquiryUrl)

      const { data: dataAxios } = await axios.post(
        requestUrl,
        {
          ...data,
          merchant_id: data.merchant_id || this.merchant_id
        },
        {
          timeout: this.timeout
        }
      )

      dataAxios.isError = dataAxios.errors.code < 0
      if (dataAxios.isError) {
        return {
          isError: true,
          error: {
            message: zarinPalErrors[dataAxios.errors.code],
            code: dataAxios.errors.code,
            validations: dataAxios.errors.validations,
            type: 'payment' // This is a payment creation failure
          }
        }
      }

      return dataAxios
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
