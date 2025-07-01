import { ZarinPalDriver } from '../src/drivers/zarinpal'

// Initialize the ZarinPal driver
const zarinpal = new ZarinPalDriver()

// Basic configuration
zarinpal.setToken('your-merchant-id')
zarinpal.setTimeout(15000) // 15 seconds timeout

// NEW: Set custom domain (this is optional)
// If not set, it will fallback to default ZarinPal domains
// IMPORTANT: Custom domain is ONLY used for API calls (request, verify, inquiry)
// Payment page URLs always use default ZarinPal domains
zarinpal.setCustomDomain('api.yourgateway.com')

// Example usage scenarios:

async function exampleWithCustomDomain() {
  // When custom domain is set, all API calls will use the custom domain
  
  // This will make a request to: https://api.yourgateway.com/pg/v4/payment/request.json
  const result = await zarinpal.request({
    amount: 10000, // 100 IRR (amounts are in Rials)
    description: 'Payment for order #123',
    callback_url: 'https://yoursite.com/payment/callback'
  })

  if (!result.isError) {
    console.log('Payment URL:', result.data.url) 
    // Payment page URL always uses default ZarinPal domain:
    // This will be: https://www.zarinpal.com/pg/StartPay/{authority}
  }
}

async function exampleWithDefaultDomain() {
  // Create a new instance without custom domain
  const defaultZarinpal = new ZarinPalDriver()
  defaultZarinpal.setToken('your-merchant-id')
  
  // This will use default ZarinPal URLs
  const result = await defaultZarinpal.request({
    amount: 10000,
    description: 'Payment for order #123',
    callback_url: 'https://yoursite.com/payment/callback'
  })
  
  if (!result.isError) {
    console.log('Payment URL:', result.data.url)
    // This will be: https://www.zarinpal.com/pg/StartPay/{authority}
  }
}

async function exampleWithSandbox() {
  // Custom domain also works with sandbox mode
  zarinpal.setCustomDomain('sandbox.yourgateway.com')
  
  // This will make a request to: https://sandbox.yourgateway.com/pg/v4/payment/request.json
  const result = await zarinpal.request({
    amount: 10000,
    description: 'Test payment',
    callback_url: 'https://yoursite.com/payment/callback'
  }, true) // true = sandbox mode
  
  if (!result.isError) {
    console.log('Sandbox Payment URL:', result.data.url)
    // Payment page URL always uses default ZarinPal sandbox domain:
    // This will be: https://sandbox.zarinpal.com/pg/StartPay/{authority}
  }
}

export { exampleWithCustomDomain, exampleWithDefaultDomain, exampleWithSandbox } 