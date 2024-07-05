/**
 * Represents the response structure for creating a transaction with IdPay.
 *
 * @interface TransactionCreateResponseIdPay
 * @property {boolean} isError Indicates if there's an error in the response.
 * @property {object} data Data related to the transaction if successful.
 * @property {string} data.id Transaction ID.
 * @property {string} data.link URL to redirect the user to.
 * @property {string | null} error_code Error code if an error occurred, otherwise null.
 * @property {string | null} error_message Error message if an error occurred, otherwise null.
 */
export interface TransactionCreateResponseIdPay {
  isError: boolean

  data: {
    id: string
    link: string
  }

  error_code: string | null

  error_message: string | null
}

/**
 * Represents the response structure for verifying a transaction with IdPay.
 * Inherits properties from TransactionCreateResponseIdPay and modifies the 'data' property.
 *
 * @interface TransactionVerifyResponseIdPay
 * @extends {Omit<TransactionCreateResponseIdPay, "data">}
 * @property {object} data Detailed data related to the verified transaction.
 * @property {string} data.status Status of the transaction.
 * @property {string} data.track_id Track ID of the transaction.
 * @property {string} data.id Transaction ID.
 * @property {string} data.order_id Order ID of the transaction.
 * @property {string} data.amount Amount of the transaction.
 * @property {string} data.date Date of the transaction.
 * @property {PaymentResponseIdPay} data.payment Payment details.
 * @property {object} data.verify Verification details.
 * @property {string} data.verify.date Date of the verification.
 *
 */
export interface TransactionVerifyResponseIdPay extends Omit<TransactionCreateResponseIdPay, 'data'> {
  data: {
    status: string
    track_id: string
    id: string
    order_id: string
    amount: string
    date: string
    payment: PaymentResponseIdPay
    verify: {
      date: string
    }
  }
}

/**
 * Represents the payment details in the response for IdPay.
 *
 * @interface PaymentResponseIdPay
 * @property {string} track_id Tracking ID for the payment.
 * @property {string} amount Amount associated with the payment.
 * @property {string} card_no Card number used for the payment.
 * @property {string} hashed_card_no Hashed card number for security reasons.
 * @property {string} date Date of the payment.
 */
export interface PaymentResponseIdPay {
  track_id: string

  amount: string

  card_no: string

  hashed_card_no: string

  date: string
}
