/**
 * Represents the response structure for creating a transaction with PayStar.
 *
 * @interface TransactionCreateResponsePayStar
 * @property {boolean} isError Indicates if there's an error in the response.
 * @property {object} data Data related to the transaction if successful.
 * @property {string} data.token Token for redirecting user to payment page.
 * @property {string} data.ref_num Reference number for transaction tracking.
 * @property {string} data.url Full URL to redirect user to payment page.
 * @property {object} error Error details if an error occurred.
 * @property {string | number} error.code Error code.
 * @property {string} error.message Error message.
 */
export interface TransactionCreateResponsePayStar {
  isError: boolean
  data: {
    token: string
    ref_num: string
    url: string
  } | null
  error: {
    code: string | number
    message: string
  } | null
}

/**
 * Represents the response structure for verifying a transaction with PayStar.
 *
 * @interface TransactionVerifyResponsePayStar
 * @property {boolean} isError Indicates if there's an error in the response.
 * @property {object} data Data related to the verified transaction if successful.
 * @property {string | number} data.status Transaction status.
 * @property {string} data.order_id Order ID of the transaction.
 * @property {string} data.ref_num Reference number of the transaction.
 * @property {string} data.transaction_id PayStar transaction ID.
 * @property {string} data.card_number Card number used for payment.
 * @property {string} data.hashed_card_number Hashed card number for security.
 * @property {string} data.tracking_code Bank tracking code.
 * @property {number} data.amount Transaction amount.
 * @property {string} data.date Transaction date.
 * @property {object} error Error details if an error occurred.
 * @property {string | number} error.code Error code.
 * @property {string} error.message Error message.
 */
export interface TransactionVerifyResponsePayStar {
  isError: boolean
  data: {
    status: string | number
    order_id: string
    ref_num: string
    transaction_id: string
    card_number: string
    hashed_card_number: string
    tracking_code: string
    amount: number
    date: string
  } | null
  error: {
    code: string | number
    message: string
  } | null
}

/**
 * Represents the response structure for PayStar transaction inquiry.
 *
 * @interface TransactionInquiryResponsePayStar
 * @property {boolean} isError Indicates if there's an error in the response.
 * @property {object} data Data related to the inquired transaction if successful.
 * @property {string | number} data.status Transaction status.
 * @property {string} data.order_id Order ID of the transaction.
 * @property {string} data.ref_num Reference number of the transaction.
 * @property {string} data.transaction_id PayStar transaction ID.
 * @property {string} data.card_number Card number used for payment.
 * @property {string} data.hashed_card_number Hashed card number for security.
 * @property {string} data.tracking_code Bank tracking code.
 * @property {number} data.amount Transaction amount.
 * @property {string} data.date Transaction date.
 * @property {object} error Error details if an error occurred.
 * @property {string | number} error.code Error code.
 * @property {string} error.message Error message.
 */
export interface TransactionInquiryResponsePayStar {
  isError: boolean
  data: {
    status: string | number
    order_id: string
    ref_num: string
    transaction_id: string
    card_number: string
    hashed_card_number: string
    tracking_code: string
    amount: number
    date: string
  } | null
  error: {
    code: string | number
    message: string
  } | null
}

/**
 * Represents the callback payload structure from PayStar.
 * This is the data PayStar sends to merchant's callback URL.
 *
 * @interface PayStarCallbackPayload
 * @property {string | number} status Payment status (1 for success).
 * @property {string} order_id Merchant order ID.
 * @property {string} ref_num Reference number.
 * @property {string} transaction_id PayStar transaction ID (only if status=1).
 * @property {string} card_number Card number (only if status=1).
 * @property {string} hashed_card_number Hashed card number (only if status=1).
 * @property {string} tracking_code Bank tracking code (only if status=1).
 */
export interface PayStarCallbackPayload {
  status: string | number
  order_id: string
  ref_num: string
  transaction_id?: string
  card_number?: string
  hashed_card_number?: string
  tracking_code?: string
}
