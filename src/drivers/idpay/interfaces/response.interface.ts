export interface TransactionCreateResponseIdPay {
  isError: boolean;
  data: {
    id: string;
    link: string;
  };
  error_code: string | null;
  error_message: string | null;
}

export interface TransactionVerifyResponseIdPay
  extends Omit<TransactionCreateResponseIdPay, "data"> {
  data: {
    status: string;
    track_id: string;
    id: string;
    order_id: string;
    amount: string;
    date: string;
    payment: PaymentResponseIdPay;
    verify: {
      date: string;
    };
  };
}

export interface PaymentResponseIdPay {
  track_id: string;
  amount: string;
  card_no: string;
  hashed_card_no: string;
  date: string;
}
