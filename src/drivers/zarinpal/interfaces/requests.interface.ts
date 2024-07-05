/**
 * Represents the input structure for creating a transaction with ZarinPal.
 *
 * @interface TransactionCreateInputZp
 * @property {string} merchant_id Merchant ID, if available (optional).
 * @property {number} amount Amount for the transaction.
 * @property {string} callback_url Callback URL to redirect after the transaction.
 * @property {string} description Description for the transaction.
 * @property {"IRR" | "IRT"} currency Currency type for the transaction, either "IRR" or "IRT" (optional).
 * @property {object} metadata Additional metadata for the transaction.
 * @property {string} metadata.mobile Mobile number of the payer (optional).
 * @property {string} metadata.email Email address of the payer (optional).
 * @property {string} metadata.order_id Order ID for the transaction (optional).
 */
export interface TransactionCreateInputZp {
  merchant_id?: string

  amount: number

  callback_url: string

  description: string

  currency?: 'IRR' | 'IRT'

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
 * @property {string} authority Transaction authority.
 */
export interface TransactionVerifyInputZp extends Pick<TransactionCreateInputZp, 'merchant_id' | 'amount'> {
  authority: string
}

/**
 * Represents the error structure for ZarinPal transactions.
 *
 * @interface TransactionErrorZp
 * @property {number} code Error code.
 * @property {string} message Error message.
 * @property {array} validations Validation errors.
 * @property {string} validations[].field Field name.
 * @property {string} validations[].message Error message for the field.
 * @property {string} validations[].code Error code for the field.
 */
export interface TransactionErrorZp {
  code: number

  message: string

  validations: Record<keyof TransactionCreateInputZp, string>[]
}

/**
 * Represents the response structure for creating a transaction with ZarinPal.
 *
 * @interface TransactionCreateResponseZp
 * @property {boolean} isError Indicates if there's an error in the response.
 * @property {object} data Data related to the transaction if successful.
 * @property {number} data.code Transaction code.
 * @property {string} data.message Transaction message.
 * @property {string} data.authority Transaction authority.
 * @property {string} data.fee_type Fee type for the transaction.
 * @property {number} data.fee Fee amount for the transaction.
 * @property {string} data.url URL to redirect the user to.
 * @property {TransactionErrorZp} error Error details if an error occurred.
 */
export interface TransactionCreateResponseZp {
  isError: boolean

  data: {
    code: number
    message: string
    authority: string
    fee_type: string
    fee: number
    url: string
  }

  error: TransactionErrorZp
}

/**
 * Represents the response structure for verifying a transaction with ZarinPal.
 *
 * @interface TransactionVerifyResponseZp
 * @property {boolean} isError Indicates if there's an error in the response.
 * @property {object} data Data related to the verified transaction if successful.
 * @property {number} data.code Transaction code.
 * @property {string} data.message Transaction message.
 * @property {string} data.card_hash Card hash for the transaction.
 * @property {string} data.card_pan Card PAN for the transaction.
 * @property {number} data.ref_id Reference ID for the transaction.
 * @property {string} data.fee_type Fee type for the transaction.
 * @property {number} data.fee Fee amount for the transaction.
 * @property {TransactionErrorZp} error Error details if an error occurred.
 */
export interface TransactionVerifyResponseZp {
  isError: boolean

  data: {
    code: number
    message: string
    card_hash: string
    card_pan: string
    ref_id: number
    fee_type: string
    fee: number
  }

  error: TransactionErrorZp
}
