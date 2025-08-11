/**
 * Represents the input structure for creating a transaction with PayStar.
 *
 * @interface TransactionCreateInputPayStar
 * @property {string} gateway_id Gateway ID for authentication (optional if set via setToken).
 * @property {number} amount Desired amount in IRR (minimum 5000).
 * @property {string} order_id Merchant order ID.
 * @property {string} callback Callback URL to redirect after the transaction.
 * @property {string} name Name of the payer (optional).
 * @property {string} phone Mobile number of the payer (optional).
 * @property {string} mail Email address of the payer (optional).
 * @property {string} description Description for the transaction (optional).
 * @property {string} callback_method HTTP method for callback (GET/POST) (optional).
 * @property {string} wallet_hashid Wallet hash ID for payout (optional).
 * @property {string} national_code National code of the payer (optional).
 * @property {string} card_number Card number for restricted payment (optional).
 * @property {string} referer_id Referer ID for tracking (optional).
 * @property {Array<{amount: number, description: string, iban: string}>} allotment Split payment details (optional).
 * @link https://docs.paystar.ir
 */
export interface TransactionCreateInputPayStar {
  gateway_id?: string
  amount: number
  order_id: string
  callback: string
  name?: string
  phone?: string
  mail?: string
  description?: string
  callback_method?: 'GET' | 'POST'
  wallet_hashid?: string
  national_code?: string
  card_number?: string
  referer_id?: string
  allotment?: Array<{
    amount: number
    description: string
    iban: string
  }>
}

/**
 * Represents the input structure for verifying a transaction with PayStar.
 *
 * @interface TransactionVerifyInputPayStar
 * @property {string} gateway_id Gateway ID for authentication (optional if set via setToken).
 * @property {string} ref_num Reference number from transaction creation.
 * @property {number} amount Transaction amount for verification.
 * @property {string} card_number Card number used in the transaction.
 * @property {string} tracking_code Tracking code used in the transaction.
 * @link https://docs.paystar.ir
 */
export interface TransactionVerifyInputPayStar {
  gateway_id?: string
  ref_num: string
  amount: number
  card_number: string
  tracking_code: string
}

/**
 * Represents the input structure for PayStar transaction inquiry.
 *
 * @interface TransactionInquiryInputPayStar
 * @property {string} gateway_id Gateway ID for authentication (optional if set via setToken).
 * @property {string} ref_num Reference number from transaction creation.
 * @link https://docs.paystar.ir
 */
export interface TransactionInquiryInputPayStar {
  gateway_id?: string
  ref_num: string
}
