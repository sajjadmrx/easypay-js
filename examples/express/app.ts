import express, { Request, Response } from "express"
import { getPaymentDriver, ZarinPalDriver } from "../../dist";

const app = express()


app.listen(3000)

const zarinPalDriver: ZarinPalDriver = getPaymentDriver("zarinpal")
zarinPalDriver.setToken("token")
const AMOUNT = 100000
app.post("/payment/checkout", async (req: Request, res: Response) => {
    const result = await zarinPalDriver.request({
        amount: AMOUNT,
        callback_url: "http://localhost:3000/payment/checkout/cb",
        description: "test description",
    }, false)

    if (result.isError) {
        res.status(500).json({
            success: false,
            message: result.error.message,
            errCode: result.error.code,
            validations: result.error.validations
        })
    } else {
        res.status(200).json({
            success: true,
            messsage: result.data.message,
            url: result.data.url,
        })
    }
})

app.get("/payment/checkout/cb", async (req: Request, res: Response) => {
    const Status = String(req.query.Status)
    if (Status === "OK") {
        const verifyResult = await zarinPalDriver.verify({
            amount: AMOUNT,
            authority: String(req.query.Authority)
        })

        if (verifyResult.isError) {
            res.status(400).json({
                success: true,
                message: verifyResult.error.message, // or custom message
                code: verifyResult.error.code
            })
        } else {
            res.status(200).json({
                success: true,
                verifyResult
            })
        }
    }
    else {
        res.status(400).json({ success: false, message: "canceled" })
    }
})

console.log(`port: ${3000}`)
