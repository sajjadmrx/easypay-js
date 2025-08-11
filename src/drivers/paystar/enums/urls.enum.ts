/**
 * Enum representing URLs for interacting with the PayStar API endpoints.
 *
 * @enum {string}
 */
export enum PayStarUrls {
  /**
   * URL for creating a payment request.
   * @type {string}
   * @memberof PayStarUrls
   * @link https://docs.paystar.ir
   */
  REQUEST = 'https://core.paystar.ir/api/pardakht/create',

  /**
   * URL for verifying a payment.
   * @type {string}
   * @memberof PayStarUrls
   * @link https://docs.paystar.ir
   */
  VERIFY = 'https://core.paystar.ir/api/pardakht/verify',

  /**
   * URL for payment inquiry.
   * @type {string}
   * @memberof PayStarUrls
   * @link https://docs.paystar.ir
   */
  INQUIRY = 'https://core.paystar.ir/api/pardakht/inquiry',

  /**
   * URL for the payment page.
   * @type {string}
   * @memberof PayStarUrls
   * @link https://docs.paystar.ir
   */
  PAYMENT_PAGE = 'https://core.paystar.ir/api/pardakht/payment'
}
