/**
 * Represents the input structure for creating a transaction with IdPay.
 * 
 * @interface TransactionCreateInputIdPay
 */
export interface TransactionCreateInputIdPay {
  /**
   * The token for authentication, if available.
   * 
   * @type {string}
   * @memberof TransactionCreateInputIdPay
   */
  token?: string;

  /**
   * Merchant order ID.
   * Maximum length: 50 characters.
   * 
   * @type {string}
   * @memberof TransactionCreateInputIdPay
   */
  order_id: string;

  /**
   * Desired amount in Rials.
   * Amount must be between 1,000 Rials to 500,000,000 Rials.
   * 
   * @type {number}
   * @memberof TransactionCreateInputIdPay
   */
  amount: number;

  /**
   * Name of the payer.
   * Maximum length: 255 characters.
   * 
   * @type {string}
   * @memberof TransactionCreateInputIdPay
   */
  name?: string;

  /**
   * Mobile number of the payer.
   * Length should be 11 characters.
   * Examples: 9382198592, 09382198592, 989382198592.
   * 
   * @type {string}
   * @memberof TransactionCreateInputIdPay
   */
  phone?: string;

  /**
   * Email address of the payer.
   * Maximum length: 255 characters.
   * 
   * @type {string}
   * @memberof TransactionCreateInputIdPay
   */
  mail?: string;

  /**
   * Transaction description.
   * Maximum length: 255 characters.
   * 
   * @type {string}
   * @memberof TransactionCreateInputIdPay
   */
  desc: string;

  /**
   * Merchant's callback URL.
   * Maximum length: 2048 characters.
   * 
   * @type {string}
   * @memberof TransactionCreateInputIdPay
   */
  callback: string;
}

/**
 * Represents the input structure for verifying a transaction with IdPay.
 * Inherits properties 'order_id' and 'token' from TransactionCreateInputIdPay.
 * 
 * @interface TransactionVerifyInputIdPay
 * @extends {Pick<TransactionCreateInputIdPay, "order_id" | "token">}
 */
export interface TransactionVerifyInputIdPay extends Pick<TransactionCreateInputIdPay, "order_id" | "token"> {
  /**
   * Transaction ID.
   * 
   * @type {string}
   * @memberof TransactionVerifyInputIdPay
   */
  id: string;
}
