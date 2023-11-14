import axios from "axios";
import { IdPayUrls } from "./enums/urls.enum";
import {
  TransactionCreateInputIdPay,
  TransactionVerifyInputIdPay,
} from "./interfaces/request.interface";
import {
  TransactionCreateResponseIdPay,
  TransactionVerifyResponseIdPay,
} from "./interfaces/response.interface";

export class IdPayDriver {
  private token: string | null = null;
  private sandBox: boolean = false;

  setToken(token: string): this {
    this.token = token;
    return this;
  }

  setSandBox(sandBox: boolean): this {
    this.sandBox = sandBox;
    return this;
  }

  async request(
    dataInput: TransactionCreateInputIdPay,
  ): Promise<TransactionCreateResponseIdPay> {
    try {
      const { data } = await axios.post(IdPayUrls.REQUEST, dataInput, {
        headers: this.getHeader(this.token || dataInput.token, this.sandBox),
      });
      return {
        isError: false,
        data: {
          id: data.id,
          link: data.link,
        },
        error_code: null,
        error_message: null,
      };
    } catch (error: any) {
      if (error.isAxiosError) {
        return {
          isError: true,
          error_message: error.response.data.error_message,
          error_code: error.response.data.error_code,
          data: {} as any,
        };
      } else throw error;
    }
  }

  async verify(
    dataInput: TransactionVerifyInputIdPay,
  ): Promise<TransactionVerifyResponseIdPay> {
    try {
      const { data } = await axios.post(IdPayUrls.VERIFY, dataInput, {
        headers: this.getHeader(this.token || dataInput.token, this.sandBox),
      });
      return {
        isError: false,
        error_message: null,
        error_code: null,
        data: data,
      };
    } catch (error: any) {
      if (error.isAxiosError) {
        return {
          isError: true,
          error_message: error.response.data.error_message,
          error_code: error.response.data.error_code,
          data: {} as any,
        };
      } else throw error;
    }
  }

  private getHeader(token: string | undefined, sandbox: boolean) {
    if (!token) throw new Error("token is required");
    return {
      "Content-Type": "application/json",
      "X-API-KEY": token,
      "X-SANDBOX": sandbox,
    };
  }
}
