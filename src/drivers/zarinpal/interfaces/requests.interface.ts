export interface TransactionCreateInputZp {
  merchant_id?: string;
  amount: number;
  callback_url: string;
  description: string;
  currency?: "IRR" | "IRT";
  metadata?: {
    mobile?: string;
    email?: string;
    order_id?: string;
  };
}

export interface TransactionVerifyInputZp
  extends Pick<TransactionCreateInputZp, "merchant_id" | "amount"> {
  authority: string;
}

export interface TransactionErrorZp {
  code: number;
  message: string;
  validations: Record<keyof TransactionCreateInputZp, string>[];
}

export interface TransactionCreateResponseZp {
  isError: boolean;
  data: {
    code: number;
    message: string;
    authority: string;
    fee_type: string;
    fee: number;
    url: string;
  };
  error: TransactionErrorZp;
}

export interface TransactionVerifyResponseZp {
  isError: boolean;
  data: {
    code: number;
    message: string;
    card_hash: string;
    card_pan: string;
    ref_id: number;
    fee_type: string;
    fee: number;
  };
  error: TransactionErrorZp;
}
