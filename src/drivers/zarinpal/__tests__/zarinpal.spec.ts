import axios from 'axios'
import { ZarinPalDriver } from '../zarinpal'
import { TransactionCreateInputZp } from '../interfaces/requests.interface'
import { zarinPalErrors } from '../enums/errors.enum'

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
        validations: []
      },
      isError: true
    }

    mockedAxios.post.mockResolvedValue({ data: errorResponseAxios })

    const response = await driver.request(mockData)

    expect(response).toEqual(errorResponse)
  })
})
