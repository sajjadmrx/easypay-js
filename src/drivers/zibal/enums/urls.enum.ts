/**
 * Enum representing URLs for interacting with the Zibal API endpoints.
 *
 * @enum {string}
 */
export enum ZibalUrls {
  /**
   * URL for creating a payment request.
   * @type {string}
   * @memberof ZibalUrls
   * @link https://help.zibal.ir/IPG/API/#request
   */
  REQUEST = 'https://gateway.zibal.ir/v1/request',

  /**
   * URL for verifying a payment.
   * @type {string}
   * @memberof ZibalUrls
   * @link https://help.zibal.ir/IPG/API/#verify
   */
  VERIFY = 'https://gateway.zibal.ir/v1/verify'
}
