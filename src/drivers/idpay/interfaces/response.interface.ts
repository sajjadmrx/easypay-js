/**
 * Represents the response structure for creating a transaction with IdPay.
 *
 * @interface TransactionCreateResponseIdPay
 */
export interface TransactionCreateResponseIdPay {
  /**
   * Indicates if there's an error in the response.
   *
   * @type {boolean}
   * @memberof TransactionCreateResponseIdPay
   */
  isError: boolean

  /**
   * Data related to the transaction if successful.
   *
   * @type {{ id: string; link: string; }}
   * @memberof TransactionCreateResponseIdPay
   */
  data: {
    id: string
    link: string
  }

  /**
   * Error code if an error occurred, otherwise null.
   *
   * @type {string | null}
   * @memberof TransactionCreateResponseIdPay
   */
  error_code: string | null

  /**
   * Error message if an error occurred, otherwise null.
   *
   * @type {string | null}
   * @memberof TransactionCreateResponseIdPay
   */
  error_message: string | null
}

/**
 * Represents the response structure for verifying a transaction with IdPay.
 * Inherits properties from TransactionCreateResponseIdPay and modifies the 'data' property.
 *
 * @interface TransactionVerifyResponseIdPay
 * @extends {Omit<TransactionCreateResponseIdPay, "data">}
 */
export interface TransactionVerifyResponseIdPay extends Omit<TransactionCreateResponseIdPay, 'data'> {
  /**
   * Detailed data related to the verified transaction.
   *
   * @type {{ status: string; track_id: string; id: string; order_id: string; amount: string; date: string; payment: PaymentResponseIdPay; verify: { date: string; }; }}
   * @memberof TransactionVerifyResponseIdPay
   */
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
 */
export interface PaymentResponseIdPay {
  /**
   * Tracking ID for the payment.
   *
   * @type {string}
   * @memberof PaymentResponseIdPay
   */
  track_id: string

  /**
   * Amount associated with the payment.
   *
   * @type {string}
   * @memberof PaymentResponseIdPay
   */
  amount: string

  /**
   * Card number used for the payment.
   *
   * @type {string}
   * @memberof PaymentResponseIdPay
   */
  card_no: string

  /**
   * Hashed card number for security reasons.
   *
   * @type {string}
   * @memberof PaymentResponseIdPay
   */
  hashed_card_no: string

  /**
   * Date of the payment.
   *
   * @type {string}
   * @memberof PaymentResponseIdPay
   */
  date: string
}
