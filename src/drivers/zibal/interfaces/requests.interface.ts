/**
 * Represents the input structure for creating a transaction with Zibal.
 *
 * @interface TransactionCreateInputZibal
 * @property {string} merchant Merchant ID (Optional).
 * @property {number} amount Desired amount in Rials.
 * @property {string} callbackUrl URL to redirect the user to after payment.
 * @property {string} description Description of the transaction (Optional).
 * @property {string} orderId Order ID of the transaction (Optional).
 * @property {string} mobile Mobile number of the payer (Optional).
 * @property {string[]} allowedCards Allowed cards for the transaction (Optional).
 * @property {string} ledgerId Ledger ID for the transaction (Optional).
 * @property {boolean} linkToPay Indicates if the user should be redirected to the payment page (Optional).
 * @property {boolean} sms Indicates if an SMS should be sent to the payer (Optional).
 */
export interface TransactionCreateInputZibal {
  merchant?: string
  amount: number
  callbackUrl: string
  description?: string
  orderId?: string
  mobile?: string
  allowedCards?: string[]
  ledgerId?: string
  linkToPay?: boolean
  sms?: boolean
}

/**
 *
 * Represents the input structure for verifying a transaction with Zibal.
 * @property {string} merchant Merchant ID (Optional).
 * @property {string} trackId Track ID of the transaction.
 * @interface TransactionVerifyInputZibal
 */
export interface TransactionVerifyInputZibal {
  merchant?: string
  trackId: string
}
