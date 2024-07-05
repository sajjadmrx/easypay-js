/**
 * Represents the input structure for creating a transaction with IdPay.
 *
 * @interface TransactionCreateInputIdPay
 * @property {string} token The token for authentication, if available.
 * @property {string} order_id Merchant order ID.
 * @property {number} amount Desired amount in Rials.
 * @property {string} name Name of the payer (optional).
 * @property {string} phone Mobile number of the payer (optional).
 * @property {string} mail Email address of the payer (optional).
 * @property {string} desc Transaction description.
 * @property {string} callback Merchant's callback URL.
 * @link https://idpay.ir/web-service/v1.1/#8614460e98
 */
export interface TransactionCreateInputIdPay {
  token?: string

  order_id: string

  amount: number

  name?: string

  phone?: string

  mail?: string

  desc: string

  callback: string
}

/**
 * Represents the input structure for verifying a transaction with IdPay.
 * Inherits properties 'order_id' and 'token' from TransactionCreateInputIdPay.
 *
 * @interface TransactionVerifyInputIdPay
 * @extends {Pick<TransactionCreateInputIdPay, "order_id" | "token">}
 * @property {string} id Transaction ID.
 * @link https://idpay.ir/web-service/v1.1/#8614460e98
 */
export interface TransactionVerifyInputIdPay extends Pick<TransactionCreateInputIdPay, 'order_id' | 'token'> {
  id: string
}
