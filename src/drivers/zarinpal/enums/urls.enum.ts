/**
 * Enum representing URLs for interacting with the ZarinPal API endpoints.
 * 
 * @enum {string}
 */
export enum ZarinpalUrls {
  /**
   * URL for creating a payment request in the production environment.
   * 
   * @type {string}
   * @memberof ZarinpalUrls
   */
  REQUEST = "https://api.zarinpal.com/pg/v4/payment/request.json",

  /**
   * URL for creating a payment request in the sandbox environment.
   * 
   * @type {string}
   * @memberof ZarinpalUrls
   */
  SANDBOX_REQUEST = "https://sandbox.zarinpal.com/pg/v4/payment/request.json",

  /**
   * URL for verifying a payment in the production environment.
   * 
   * @type {string}
   * @memberof ZarinpalUrls
   */
  VERIFY = "https://api.zarinpal.com/pg/v4/payment/verify.json",

  /**
   * URL for verifying a payment in the sandbox environment.
   * 
   * @type {string}
   * @memberof ZarinpalUrls
   */
  SANDBOX_VERIFY = "https://sandbox.zarinpal.com/pg/v4/payment/verify.json",

  /**
   * URL for the payment page in the production environment.
   * 
   * @type {string}
   * @memberof ZarinpalUrls
   */
  REQUEST_PAGE = "https://www.zarinpal.com/pg/StartPay",

  /**
   * URL for the payment page in the sandbox environment.
   * 
   * @type {string}
   * @memberof ZarinpalUrls
   */
  SANDBOX_REQUEST_PAGE = "https://sandbox.zarinpal.com/pg/StartPay/",
}
