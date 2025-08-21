/**
 * Object containing error codes and their corresponding descriptions for PayStar payment gateway.
 *
 * This list is based on the official documentation provided by PayStar.
 *
 * @constant
 * @link https://docs.paystar.ir/docs/tutorial-basics/IPG-payment-helper/#جدول-کد-های-وضعیت
 */
export const zarinPalErrors: Record<string, string> = {
  '1': 'موفق',
  '1-': 'درخواست نامعتبر (خطا در پارامترهای ورودی)',
  '2-': 'درگاه فعال نیست',
  '3-': 'توکن تکراری است',
  '4-': 'مبلغ بیشتر از سقف مجاز درگاه است',
  '5-': 'شناسه ref_num معتبر نیست',
  '6-': 'تراکنش قبلا وریفای شده است',
  '7-': 'پارامترهای ارسال شده نامعتبر است',
  '8-': 'تراکنش را نمیتوان وریفای کرد',
  '9-': 'تراکنش وریفای نشد',
  '16-': 'موجودی کیف پول کارمزد درگاه کافی نیست',
  '98-': 'تراکنش ناموفق',
  '99-': 'تراکنش ناموفق'
}
