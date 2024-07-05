/**
 * Object containing error codes and their corresponding descriptions for Zibal payment gateway.
 *
 * This list is based on the official documentation provided by Zibal.
 *
 * @constant
 * @link https://help.zibal.ir/IPG/API/#requestResultCode
 */
export const zibalMessages: Record<string, string> = {
  '102': 'آی پی یا مرچنت کد پذیرنده صحیح نیست',
  '103': 'مرچنت کد فعال نیست',
  '104': 'مرچنت کد نامعتبر است',
  '105': 'amount بایستی بزرگتر از 1,000 ریال باشد.',
  '106': 'callbackUrl نامعتبر می‌باشد. (شروع با http و یا https)',
  '113': 'amount مبلغ تراکنش از سقف میزان تراکنش بیشتر است.',
  '201': 'قبلا تایید شده ',
  '202': 'سفارش پرداخت نشده یا ناموفق بوده است. جهت اطلاعات بیشتر جدول وضعیت‌ها را مطالعه کنید.',
  '203': 'trackId نامعتبر می‌باشد.'
}
