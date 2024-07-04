/**
 * Represents the input structure for creating a transaction with ZarinPal.
 *
 * @interface TransactionCreateInputZp
 */
export interface TransactionCreateInputZp {
  /**
   * Merchant ID, if available.
   *
   * @type {string}
   * @memberof TransactionCreateInputZp
   */
  merchant_id?: string

  /**
   * Amount for the transaction.
   *
   * @type {number}
   * @memberof TransactionCreateInputZp
   */
  amount: number

  /**
   * Callback URL to redirect after the transaction.
   *
   * @type {string}
   * @memberof TransactionCreateInputZp
   */
  callback_url: string

  /**
   * Description for the transaction.
   *
   * @type {string}
   * @memberof TransactionCreateInputZp
   */
  description: string

  /**
   * Currency type for the transaction, either "IRR" or "IRT".
   *
   * @type {"IRR" | "IRT"}
   * @memberof TransactionCreateInputZp
   */
  currency?: 'IRR' | 'IRT'

  /**
   * Additional metadata for the transaction.
   *
   * @type {{ mobile?: string; email?: string; order_id?: string }}
   * @memberof TransactionCreateInputZp
   */
  metadata?: {
    mobile?: string
    email?: string
    order_id?: string
  }
}

/**
 * Represents the input structure for verifying a transaction with ZarinPal.
 * Inherits properties 'merchant_id' and 'amount' from TransactionCreateInputZp.
 *
 * @interface TransactionVerifyInputZp
 * @extends {Pick<TransactionCreateInputZp, "merchant_id" | "amount">}
 */
export interface TransactionVerifyInputZp extends Pick<TransactionCreateInputZp, 'merchant_id' | 'amount'> {
  /**
   * Transaction authority.
   *
   * @type {string}
   * @memberof TransactionVerifyInputZp
   */
  authority: string
}

/**
 * Represents the error structure for ZarinPal transactions.
 *
 * @interface TransactionErrorZp
 */
export interface TransactionErrorZp {
  /**
   * Error code.
   *
   * @type {number}
   * @memberof TransactionErrorZp
   */
  code: number

  /**
   * Error message.
   *
   * @type {string}
   * @memberof TransactionErrorZp
   */
  message: string

  /**
   * Validation errors related to the transaction input.
   *
   * @type {Record<keyof TransactionCreateInputZp, string>[]}
   * @memberof TransactionErrorZp
   */
  validations: Record<keyof TransactionCreateInputZp, string>[]
}

/**
 * Represents the response structure for creating a transaction with ZarinPal.
 *
 * @interface TransactionCreateResponseZp
 */
export interface TransactionCreateResponseZp {
  /**
   * Indicates if there's an error in the response.
   *
   * @type {boolean}
   * @memberof TransactionCreateResponseZp
   */
  isError: boolean

  /**
   * Data related to the transaction if successful.
   *
   * @type {{ code: number; message: string; authority: string; fee_type: string; fee: number; url: string }}
   * @memberof TransactionCreateResponseZp
   */
  data: {
    code: number
    message: string
    authority: string
    fee_type: string
    fee: number
    url: string
  }

  /**
   * Error details if an error occurred.
   *
   * @type {TransactionErrorZp}
   * @memberof TransactionCreateResponseZp
   */
  error: TransactionErrorZp
}

/**
 * Represents the response structure for verifying a transaction with ZarinPal.
 *
 * @interface TransactionVerifyResponseZp
 */
export interface TransactionVerifyResponseZp {
  /**
   * Indicates if there's an error in the response.
   *
   * @type {boolean}
   * @memberof TransactionVerifyResponseZp
   */
  isError: boolean

  /**
   * Data related to the verified transaction if successful.
   *
   * @type {{ code: number; message: string; card_hash: string; card_pan: string; ref_id: number; fee_type: string; fee: number }}
   * @memberof TransactionVerifyResponseZp
   */
  data: {
    code: number
    message: string
    card_hash: string
    card_pan: string
    ref_id: number
    fee_type: string
    fee: number
  }

  /**
   * Error details if an error occurred.
   *
   * @type {TransactionErrorZp}
   * @memberof TransactionVerifyResponseZp
   */
  error: TransactionErrorZp
}
