import {
  TransactionCreateInputIdPay,
  TransactionVerifyInputIdPay,
  TransactionCreateResponseIdPay,
  TransactionVerifyResponseIdPay,
} from "../";
import axios from "axios";
import { IdPayDriver } from "../idpay";

jest.mock("axios");

describe("IdPayDriver", () => {
  const createTransactionMockData: TransactionCreateInputIdPay = {
    token: "your_token",
    order_id: "12345",
    amount: 10000,
    name: "John Doe",
    phone: "09381234567",
    mail: "john.doe@example.com",
    desc: "Payment for a product",
    callback: "https://example.com/callback",
  };

  const verifyTransactionMockData: TransactionVerifyInputIdPay = {
    token: "your_token",
    order_id: "12345",
    id: "987654",
  };

  const mockData = {
    id: "123456",
    link: "https://example.com/payment-link",
    error_code: "ERR001",
    error_message: "Error message",
  };

  const mockAxiosPost = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("request method - success", async () => {
    mockAxiosPost.mockResolvedValue({ data: mockData });
    axios.post = mockAxiosPost;

    const idPayDriver = new IdPayDriver();
    const result = await idPayDriver.request(createTransactionMockData);

    const expectedResponse: TransactionCreateResponseIdPay = {
      isError: false,
      data: {
        id: mockData.id,
        link: mockData.link,
      },
      error_code: null,
      error_message: null,
    };

    expect(result).toEqual(expectedResponse);

    expect(mockAxiosPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining(createTransactionMockData),
      expect.any(Object),
    );
  });

  test("request method - error", async () => {
    mockAxiosPost.mockRejectedValue({
      isAxiosError: true,
      response: {
        data: {
          error_code: mockData.error_code,
          error_message: mockData.error_message,
        },
      },
    });
    axios.post = mockAxiosPost;

    const idPayDriver = new IdPayDriver();
    const result = await idPayDriver.request(createTransactionMockData);

    const expectedResponse: TransactionCreateResponseIdPay = {
      isError: true,
      error_code: mockData.error_code,
      error_message: mockData.error_message,
      data: {} as any,
    };

    expect(result).toEqual(expectedResponse);
  });

  test("verify method - success", async () => {
    const mockVerifyData = {
      status: "Success",
      track_id: "123456789",
      id: "987654321",
      order_id: "ORDER12345",
      amount: "100.00",
      date: "2023-10-29T14:30:00Z",
      payment: {
        track_id: "987654321",
        amount: "100.00",
        card_no: "**** **** **** 1234",
        hashed_card_no: "4b0b192d675b8632c19f989315c78e91",
        date: "2023-10-29T14:30:00Z",
      },
      verify: {
        date: "2023-10-29T14:35:00Z",
      },
    };

    mockAxiosPost.mockResolvedValue({ data: mockVerifyData });
    axios.post = mockAxiosPost;

    const idPayDriver = new IdPayDriver();
    const result = await idPayDriver.verify(verifyTransactionMockData);

    const expectedResponse: TransactionVerifyResponseIdPay = {
      isError: false,
      data: {
        status: mockVerifyData.status,
        track_id: mockVerifyData.track_id,
        id: mockVerifyData.id,
        order_id: mockVerifyData.order_id,
        amount: mockVerifyData.amount,
        date: mockVerifyData.date,
        payment: {
          track_id: mockVerifyData.payment.track_id,
          amount: mockVerifyData.payment.amount,
          card_no: mockVerifyData.payment.card_no,
          hashed_card_no: mockVerifyData.payment.hashed_card_no,
          date: mockVerifyData.payment.date,
        },
        verify: {
          date: mockVerifyData.verify.date,
        },
      },
      error_code: null,
      error_message: null,
    };

    expect(result).toEqual(expectedResponse);

    expect(mockAxiosPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining(verifyTransactionMockData),
      expect.any(Object),
    );
  });

  test("verify method - error", async () => {
    mockAxiosPost.mockRejectedValue({
      isAxiosError: true,
      response: {
        data: {
          error_code: mockData.error_code,
          error_message: mockData.error_message,
        },
      },
    });
    axios.post = mockAxiosPost;

    const idPayDriver = new IdPayDriver();
    const result = await idPayDriver.verify(verifyTransactionMockData);

    const expectedResponse: TransactionVerifyResponseIdPay = {
      isError: true,
      error_code: mockData.error_code,
      error_message: mockData.error_message,
      data: {} as any,
    };

    expect(result).toEqual(expectedResponse);
  });
});
