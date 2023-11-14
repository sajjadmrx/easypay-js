export interface TransactionCreateInputIdPay {
  token?: string;
  /**
   * شماره سفارش پذیرنده
   * به طول حداکثر 50 کاراکتر
   */
  order_id: string;
  /*
    * مبلغ مورد نظر به ریال
مبلغ باید بین 1,000 ریال تا 500,000,000 ریال باشد
    * */
  amount: number;
  /*
    * نام پرداخت کننده
به طول حداکثر 255 کاراکتر
    * */
  name?: string;
  /*
    * تلفن همراه پرداخت کننده
به طول 11 کاراکتر
مثل 9382198592 یا 09382198592 یا 989382198592
    * */
  phone?: string;

  /*
    *
    * پست الکترونیک پرداخت کننده
به طول حداکثر 255 کاراکتر
    *
    * */
  mail?: string;

  /*
    * توضیح تراکنش
به طول حداکثر 255 کاراکتر
    * */
  desc: string;

  /*
    *آدرس بازگشت به سایت پذیرنده
به طول حداکثر 2048 کاراکتر
    *  */
  callback: string;
}

export interface TransactionVerifyInputIdPay
  extends Pick<TransactionCreateInputIdPay, "order_id" | "token"> {
  id: string;
}
