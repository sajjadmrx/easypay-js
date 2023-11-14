import axios from "axios";
import { ZarinpalUrls } from "./enums/urls.enum";
import {
  TransactionCreateInputZp,
  TransactionCreateResponseZp,
  TransactionVerifyInputZp,
  TransactionVerifyResponseZp,
} from "./interfaces/requests.interface";
import { zarinPalErrors } from "./enums/errors.enum";

export class ZarinPalDriver {
  private merchant_id: string | null = null;

  setToken(merchant_id: string): this {
    if (!merchant_id) throw new Error("invalid parameters");
    this.merchant_id = merchant_id;
    return this;
  }

  async request(
    data: TransactionCreateInputZp,
  ): Promise<TransactionCreateResponseZp> {
    try {
      if (!data.amount || !data.description || !data.callback_url)
        throw new Error("invalid parameters");

      const { data: dataAxios } = await axios.post(ZarinpalUrls.REQUEST, {
        ...data,
        merchant_id: data.merchant_id || this.merchant_id,
      });

      dataAxios.isError = dataAxios.errors.code < 0;
      if (dataAxios.isError) {
        return {
          data: dataAxios.data,
          error: {
            message: zarinPalErrors[dataAxios.errors.code],
            code: dataAxios.errors.code,
            validations: dataAxios.errors.validations,
          },
          isError: true,
        };
      }
      dataAxios.data.url = `${ZarinpalUrls.REQUEST_PAGE}/${dataAxios.data.authority}`;
      return dataAxios;
    } catch (error: any) {
      if (error.isAxiosError) {
        return {
          data: error.response.data.data,
          isError: true,
          error: {
            code: error.response.data?.errors?.code || error.response.status,
            message:
              zarinPalErrors[error.response.data?.errors?.code] ||
              error.message,
            validations: [],
          },
        };
      }
      error.isError = true;
      throw error;
    }
  }

  async verify(
    data: TransactionVerifyInputZp,
  ): Promise<TransactionVerifyResponseZp> {
    try {
      const { data: dataAxios } = await axios.post(ZarinpalUrls.VERIFY, {
        ...data,
        merchant_id: data.merchant_id || this.merchant_id,
      });

      dataAxios.isError = dataAxios.code != 100;
      if (dataAxios.isError) {
        return {
          data: dataAxios.data,
          isError: true,
          error: {
            code: dataAxios.errors.code,
            validations: dataAxios.errors.validations,
            message: zarinPalErrors[dataAxios.errors.code],
          },
        };
      }
      return dataAxios;
    } catch (error: any) {
      if (error.isAxiosError) {
        return {
          data: error.response.data.data,
          isError: true,
          error: {
            code: error.response.data?.errors?.code || error.response.status,
            message:
              zarinPalErrors[error.response.data?.errors?.code] ||
              error.message,
            validations: [],
          },
        };
      }
      error.isError = true;
      throw error;
    }
  }
}
