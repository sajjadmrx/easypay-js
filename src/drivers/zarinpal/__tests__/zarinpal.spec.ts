import axios from 'axios'
import { ZarinPalDriver } from '../zarinpal'
import { TransactionCreateInputZp } from '../interfaces/requests.interface'
import { zarinPalErrors } from '../enums/errors.enum'
import { ZarinpalUrls } from '../enums/urls.enum'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('ZarinPalDriver', () => {
  let driver: ZarinPalDriver

  beforeEach(() => {
    driver = new ZarinPalDriver()
  })

  it('should set the merchant ID', () => {
    const merchantId = 'your-merchant-id'
    driver.setToken(merchantId)
    expect(driver['merchant_id']).toBe(merchantId)
  })

  it('should throw an error when setting an invalid merchant ID', () => {
    expect(() => driver.setToken('')).toThrowError('invalid parameters')
  })

  it('should successfully create a transaction', async () => {
    const mockData: TransactionCreateInputZp = {
      amount: 1000,
      description: 'Test transaction',
      callback_url: 'https://example.com/callback'
    }

    const expectedResponse: any = {
      data: {
        code: 1000,
        message: '',
        fee: 100,
        url: '',
        authority: 'xx',
        fee_type: ''
      },
      errors: {
        code: 0,
        message: 'Transaction created successfully',
        validations: []
      },
      isError: false
    }

    mockedAxios.post.mockResolvedValue({ data: expectedResponse })

    const response = await driver.request(mockData)

    expect(response).toEqual(expectedResponse)
  })

  it('should throw an error when creating a transaction with invalid parameters', async () => {
    const mockData: any = {
      amount: 1000,
      description: 'Test transaction'
    }

    await expect(driver.request(mockData)).rejects.toThrowError('invalid parameters')
  })

  it('should handle transaction creation error', async () => {
    const mockData: any = {
      amount: 1000,
      description: 'Test transaction',
      callback_url: 'https://example.com/callback'
    }

    const errorResponseAxios = {
      data: {
        /* error response data */
      },
      errors: {
        code: -9,
        message: zarinPalErrors['-9'],
        validations: []
      },
      isError: true
    }

    const errorResponse = {
      data: {},
      error: {
        code: -9,
        message: zarinPalErrors['-9'],
        validations: [],
        type: 'payment'
      },
      isError: true
    }

    mockedAxios.post.mockResolvedValue({ data: errorResponseAxios })

    const response = await driver.request(mockData)

    expect(response).toEqual(errorResponse)
  })

  describe('Custom Domain Support', () => {
    it('should set custom domain correctly', () => {
      const customDomain = 'api.example.com'
      driver.setCustomDomain(customDomain)
      expect(driver['customDomain']).toBe(customDomain)
    })

    it('should clean domain input by removing protocol and trailing slash', () => {
      driver.setCustomDomain('https://api.example.com/')
      expect(driver['customDomain']).toBe('api.example.com')
    })

    it('should throw error for invalid domain', () => {
      expect(() => driver.setCustomDomain('')).toThrowError('invalid domain parameter')
      expect(() => driver.setCustomDomain(null as any)).toThrowError('invalid domain parameter')
    })

    it('should use custom domain for API requests', async () => {
      const customDomain = 'api.example.com'
      driver.setCustomDomain(customDomain)

      const mockData: TransactionCreateInputZp = {
        amount: 1000,
        description: 'Test transaction',
        callback_url: 'https://example.com/callback'
      }

      const expectedResponse: any = {
        data: {
          code: 1000,
          message: '',
          fee: 100,
          url: '',
          authority: 'xx',
          fee_type: ''
        },
        errors: {
          code: 0,
          message: 'Transaction created successfully',
          validations: []
        },
        isError: false
      }

      mockedAxios.post.mockResolvedValue({ data: expectedResponse })

      await driver.request(mockData)

      // Verify that the custom domain URL was used
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.example.com/pg/v4/payment/request.json',
        expect.any(Object),
        expect.any(Object)
      )
    })

    it('should use custom domain for payment page URL', async () => {
      const customDomain = 'api.example.com'
      driver.setCustomDomain(customDomain)

      const mockData: TransactionCreateInputZp = {
        amount: 1000,
        description: 'Test transaction',
        callback_url: 'https://example.com/callback'
      }

      const expectedResponse: any = {
        data: {
          code: 1000,
          message: '',
          fee: 100,
          url: '',
          authority: 'test-authority',
          fee_type: ''
        },
        errors: {
          code: 0,
          message: 'Transaction created successfully',
          validations: []
        },
        isError: false
      }

      mockedAxios.post.mockResolvedValue({ data: expectedResponse })

      const response = await driver.request(mockData)

      // Verify that the custom domain payment page URL was used
      expect(response.data.url).toBe('https://api.example.com/pg/StartPay/test-authority')
    })

    it('should fallback to default URLs when no custom domain is set', async () => {
      const mockData: TransactionCreateInputZp = {
        amount: 1000,
        description: 'Test transaction',
        callback_url: 'https://example.com/callback'
      }

      const expectedResponse: any = {
        data: {
          code: 1000,
          message: '',
          fee: 100,
          url: '',
          authority: 'xx',
          fee_type: ''
        },
        errors: {
          code: 0,
          message: 'Transaction created successfully',
          validations: []
        },
        isError: false
      }

      mockedAxios.post.mockResolvedValue({ data: expectedResponse })

      await driver.request(mockData)

      // Verify that the default URL was used
      expect(mockedAxios.post).toHaveBeenCalledWith(
        ZarinpalUrls.REQUEST,
        expect.any(Object),
        expect.any(Object)
      )
    })

    it('should use custom domain for sandbox environment', async () => {
      const customDomain = 'api.example.com'
      driver.setCustomDomain(customDomain)

      const mockData: TransactionCreateInputZp = {
        amount: 1000,
        description: 'Test transaction',
        callback_url: 'https://example.com/callback'
      }

      const expectedResponse: any = {
        data: {
          code: 1000,
          message: '',
          fee: 100,
          url: '',
          authority: 'xx',
          fee_type: ''
        },
        errors: {
          code: 0,
          message: 'Transaction created successfully',
          validations: []
        },
        isError: false
      }

      mockedAxios.post.mockResolvedValue({ data: expectedResponse })

      await driver.request(mockData, true) // Enable sandbox

      // Verify that the custom domain URL was used (with sandbox path)
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.example.com/pg/v4/payment/request.json',
        expect.any(Object),
        expect.any(Object)
      )
    })
  })
})
