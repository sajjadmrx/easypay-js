import axios from "axios";
import { ZarinpalUrls } from "./enums/urls.enum";
import { TransactionCreateInputZp, TransactionCreateResponseZp, TransactionVerifyInputZp, TransactionVerifyResponseZp } from "./interfaces/requests.interface";
import { PaymentDriver } from "../main";



export class ZarinPalDriver implements PaymentDriver<TransactionCreateInputZp> {
    private merchant_id: string | null = null

    setToken(merchant_id: string): this {
        if (!merchant_id)
            throw new Error("invalid parameters")
        this.merchant_id = merchant_id
        return this
    }


    async request(data: TransactionCreateInputZp): Promise<TransactionCreateResponseZp> {
        try {
            if (!data.amount || !data.description || !data.callback_url)
                throw new Error("invalid parameters")

            const { data: dataAxios } = await axios.post<TransactionCreateResponseZp>(ZarinpalUrls.REQUEST, {
                ...data,
                merchant_id: data.merchant_id || this.merchant_id
            })

            dataAxios.isError = dataAxios.errors.code < 0


            return dataAxios
        } catch (error: any) {
            if (error.isAxiosError) {
                return {
                    data: error.response.data.data,
                    isError: true,
                    errors: {
                        code: error.response.status,
                        message: error.response.data?.errors?.message || error.message,
                        validations: []
                    }
                }
            }
            error.isError = true
            throw error
        }
    }

    async verify(data: TransactionVerifyInputZp): Promise<TransactionVerifyResponseZp> {
        try {
            const { data: dataAxios } = await axios.post(ZarinpalUrls.VERIFY, {
                ...data,
                merchant_id: data.merchant_id || this.merchant_id
            })

            dataAxios.isError = dataAxios.code != 100
            return dataAxios
        } catch (error: any) {
            if (error.isAxiosError) {
                return {
                    data: error.response.data.data,
                    isError: true,
                    errors: {
                        code: error.response.status,
                        message: error.response.data?.errors?.message || error.message,
                        validations: []
                    }
                }
            }
            error.isError = true
            throw error
        }
    }
}