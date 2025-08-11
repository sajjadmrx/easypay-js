import express, { type Request, type Response } from "express";
import {
	TransactionCreateInputIdPay,
	TransactionCreateInputZp,
	TransactionCreateResponseIdPay,
	TransactionCreateResponseZp,
	ZarinPalDriver,
	getPaymentDriver,
} from "../../src";
import { IdPayDriver } from "../../src/drivers/idpay/idpay";
import type { TransactionCreateResponseZibal } from "../../src/drivers/zibal/interfaces/response.interface";

const app = express();

app.listen(3000);

app.post("/payment/checkout", async (req: Request, res: Response) => {
	const zarinPalDriver = getPaymentDriver("zarinpal");

	zarinPalDriver.setToken("token");
	const AMOUNT = 100000;
	const result = await zarinPalDriver.request(
		{
			amount: AMOUNT,
			callback_url: "http://localhost:3000/payment/checkout/cb",
			description: "test description",
		},
		false,
	);

	if (result.isError) {
		res.status(500).json({
			success: false,
			message: result.error.message,
			errCode: result.error.code,
			validations: result.error.validations,
		});
	} else {
		res.status(200).json({
			success: true,
			messsage: result.data.message,
			url: result.data.url,
		});
	}
});

app.get("/payment/checkout/cb", async (req: Request, res: Response) => {
	const zarinPalDriver = getPaymentDriver("zarinpal");
	const AMOUNT = 100000;
	zarinPalDriver.setToken("token");

	const Status = String(req.query.Status);

	if (Status === "OK") {
		const verifyResult = await zarinPalDriver.verify({
			amount: AMOUNT,
			authority: String(req.query.Authority),
		});

		if (verifyResult.isError) {
			res.status(400).json({
				success: true,
				message: verifyResult.error.message, // or custom message
				code: verifyResult.error.code,
			});
		} else {
			res.status(200).json({
				success: true,
				verifyResult,
			});
		}
	} else {
		res.status(400).json({ success: false, message: "canceled" });
	}
});

app.get("/payment/zibal/checkout", async (req: Request, res: Response) => {
	const zibalDriver = getPaymentDriver("zibal");
	const AMOUNT = 10;
	const result: TransactionCreateResponseZibal = await zibalDriver.request(
		{
			amount: AMOUNT,
			callbackUrl: "http://localhost:3000/payment/zibal/checkout/cb",
			description: "test description",
		},
		true,
	);
	if (result.isError) {
		res.status(500).json({
			success: false,
			message: result.error?.message,
		});
	} else {
		res.status(200).json({
			success: true,
			trackId: result.data?.trackId,
			url: result.data?.url,
		});
	}
});

app.get("/payment/zibal/checkout/cb", async (req: Request, res: Response) => {
	const zibalDriver = getPaymentDriver("zibal");
	const AMOUNT = 1000;

	const response = await zibalDriver.verify(
		{
			trackId: String(req.query.trackId),
		},
		true,
	);

	if (response.isError) {
		res.status(500).json({
			success: false,
			message: response.error?.message,
		});
	} else {
		res.status(200).json({
			success: true,
			data: response.data,
		});
	}
});

app.get("/payment/paystar/checkout", async (req: Request, res: Response) => {
	const paystarDriver = getPaymentDriver("paystar");
	const AMOUNT = 10000;
	paystarDriver.setToken("-----");
	paystarDriver.setSignKey(
		'xxxx-yyy'
	);
	const result = await paystarDriver.request({
		amount: AMOUNT,
		callback: "http://localhost:3000/callback",
		order_id: "14523",
	});

	if (result.isError) {
		res.status(500).json({
			success: false,
			message: result.error?.message,
		});
	} else {
		res.status(200).send(result.data)
	}
});
 

app.get("/payment/paystar/checkout/cb", async (req: Request, res: Response) => {
	const paystarDriver = getPaymentDriver("paystar");
	const AMOUNT = 10000;
	
	paystarDriver.setToken("-----");
	paystarDriver.setSignKey(
		'xxxx-yyy'
	);

	const response = await paystarDriver.verify(
		{
			amount: AMOUNT,
			ref_num: '67gd8wk',
			card_number: '1234567890123456',
			tracking_code: 'tracking_123',
		},
	);

	if (response.isError) {
		res.status(500).json({
			success: false,
			message: response.error?.message,
		});
	} else {
		res.status(200).json({
			success: true,
			data: response.data,
		});
	}
});

console.log("Server is running on port 3000");
