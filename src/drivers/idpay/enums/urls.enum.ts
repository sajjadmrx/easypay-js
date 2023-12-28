/**
 * Enum representing URLs for interacting with the IdPay API.
 * 
 * @enum {string}
 */
export enum IdPayUrls {
  /**
   * URL for creating a payment request.
   * 
   * @type {string}
   * @memberof IdPayUrls
 */
  REQUEST = "https://api.idpay.ir/v1.1/payment",
  /**
   * URL for verifying a payment.
   * 
   * @type {string}
   * @memberof IdPayUrls
 */
  VERIFY = "https://api.idpay.ir/v1.1/payment/verify",
}
