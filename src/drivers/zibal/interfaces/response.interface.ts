/**
 * Represents the response object for creating a transaction in Zibal.
 *
 * @interface TransactionCreateResponseZibal
 * @property {boolean} isError Indicates if there's an error in the response.
 * @property {object} data Data related to the transaction if successful.
 * @property {number} data.trackId Track ID of the transaction.
 * @property {string} data.url URL to redirect the user to.
 * @property {object} error Error details if an error occurred.
 * @property {string} error.message Error message.
 * @property {number} error.code Error code.
 */
export interface TransactionCreateResponseZibal {
  isError: boolean
  data: {
    trackId: number
    url: string
  } | null
  error: {
    message: string
    code: number
  } | null
}

/**
 * Represents the response object for verifying a transaction in Zibal.
 *
 * @interface TransactionVerifyResponseZibal
 * @property {boolean} isError Indicates if there's an error in the response.
 * @property {object} error Error details if an error occurred.
 * @property {string} error.message Error message.
 * @property {number} error.code Error code.
 * @property {object} data Data related to the transaction if successful.
 * @property {string} data.paidAt Date and time of the payment.
 * @property {number} data.status Status of the transaction.
 * @property {number} data.amount Amount of the transaction.
 * @property {string} data.orderId Order ID of the transaction.
 * @property {string} data.description Description of the transaction.
 * @property {string} data.cartNumber Cart number of the transaction.
 * @property {string[]} data.multiplexingInfos Multiplexing information of the transaction.
 * @property {number} data.refNumber Reference number of the transaction.
 * @property {string} data.message Message of the transaction.
 */
export interface TransactionVerifyResponseZibal {
  isError: boolean
  error: {
    message: string
    code: number
  } | null
  data: {
    paidAt: string
    status: number
    amount: number
    orderId: string
    description: string
    cartNumber: string | null
    multiplexingInfos: string[]
    refNumber: number | null
    message: string
  } | null
}
