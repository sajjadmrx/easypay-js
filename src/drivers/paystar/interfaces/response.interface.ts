/**
 * Represents the response structure for creating a transaction with PayStar.
 *
 * @interface TransactionCreateResponsePayStar
 * @property {boolean} isError Indicates if there's an error in the response.
 * @property {object} data Data related to the created transaction if successful.
 * @property {string} data.token Token for the transaction.
 * @property {string} data.ref_num Reference number of the transaction.
 * @property {string} data.url URL for the transaction.
 * @property {object} error Error details if an error occurred.
 * @property {string | number} error.code Error code.
 * @property {string} error.message Error message.
 */
export interface TransactionCreateResponsePayStar {
  isError: boolean
  code: number | 'NETWORK_ERROR'
  message: string
  data?: {
    token: string
    ref_num: string
    order_id: string
    payment_amount: number
    url: string
  }
  error?: {
    status: string
    action: string
    tag: string
    api_version: string
    type: 'payment' | 'network' | 'api'
  }
}

/**
 * Represents the response structure for verifying a transaction with PayStar.
 *
 * @interface TransactionVerifyResponsePayStar
 * @property {boolean} isError Indicates if there's an error in the response.
 * @property {number | 'NETWORK_ERROR'} code Error code.
 * @property {string} message Error message.
 * @property {object} data Data related to the verified transaction if successful.
 * @property {number} data.price Price of the transaction.
 * @property {string} data.ref_num Reference number of the transaction.
 * @property {string} data.card_number Card number used for payment.
 * @property {object} error Error details if an error occurred.
 * @property {string} error.status Status of the transaction.
 * @property {string} error.action Action of the transaction.
 * @property {string} error.tag Tag of the transaction.
 * @property {string} error.api_version API version of the transaction.
 * @property {string} error.type Type of the error.
 */
export interface TransactionVerifyResponsePayStar {
  isError: boolean
  code: number | 'NETWORK_ERROR'
  message: string
  data?: {
    price: number
    ref_num: string
    card_number: string
  }
  error?: {
    status: string
    action: string
    tag: string
    api_version: string
    type: 'payment' | 'network' | 'api'
  }
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
  code: number | 'NETWORK_ERROR'
  message: string
  data?: {
    ref_num: string
    status: 'INIT' | 'SUCCEED' | 'FAILED' | 'CANCELLED' | 'REVERSED' | 'UNVERIFIED' | 'VERIFY_PENDING'
    payment_date: string
    payment_amount: number
    order_id: string
    ref_id: string
    tracking_code: string
    card_number: string
    hashed_card_number: string
  }
  error?: {
    status: string
    action: string
    tag: string
    api_version: string
    type: 'payment' | 'network' | 'api'
  }
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
