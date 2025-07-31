# easypay.js

![GitHub package.json version](https://img.shields.io/github/package-json/v/sajjadmrx/easypay-js)
![GitHub](https://img.shields.io/github/license/sajjadmrx/easypay-js)
![GitHub last commit](https://img.shields.io/github/last-commit/sajjadmrx/easypay-js)

**easypay.js** is a comprehensive payment service library designed specifically for handling various Iranian payment gateways with ease.

## Features
- **Extensible**: Easily extend the library to support other Iranian payment gateways in the future.
- **Simple Integration**: Designed for developers to quickly integrate payment functionalities into their applications.

## Supported Gateways
- [x] ZarinPal
- [x] IDPay
- [x] Zibal
- [x] PayStar

## Installation

```bash
npm install easypay.js
```

## Usage

Here's a basic example demonstrating how to integrate ZarinPal using `easypay.js` with an Express.js application:

```typescript
import express, { Request, Response } from "express";
import { getPaymentDriver, ZarinPalDriver } from "easypay.js";

const app = express();

app.listen(3000);

const zarinPalDriver: ZarinPalDriver = getPaymentDriver("zarinpal");
zarinPalDriver.setToken("your-zarinpal-token");

const AMOUNT = 100000;

app.post("/payment/checkout", async (req: Request, res: Response) => {
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

console.log(`Server running on port: 3000`);
```

### PayStar Example

Here's how to integrate PayStar (which requires HMAC signatures):

```typescript
import express, { Request, Response } from "express";
import { getPaymentDriver, PayStarDriver } from "easypay.js";

const app = express();
app.listen(3000);

const paystarDriver: PayStarDriver = getPaymentDriver("paystar");
paystarDriver
  .setToken("your-gateway-id")
  .setSignKey("your-sign-key"); // Required for HMAC signatures

const AMOUNT = 50000; // Minimum 5000 IRR

app.post("/payment/checkout", async (req: Request, res: Response) => {
  const result = await paystarDriver.request({
    amount: AMOUNT,
    order_id: "ORDER-123",
    callback: "http://localhost:3000/payment/checkout/cb",
    description: "Test payment",
    name: "John Doe",
    phone: "09123456789"
  });

  if (result.isError) {
    res.status(500).json({
      success: false,
      message: result.error.message,
      code: result.error.code,
    });
  } else {
    res.status(200).json({
      success: true,
      ref_num: result.data.ref_num,
      url: result.data.url,
    });
  }
});

app.get("/payment/checkout/cb", async (req: Request, res: Response) => {
  const { status, ref_num, card_number, tracking_code } = req.query;
  
  if (status === "1") {
    const verifyResult = await paystarDriver.verify(
      {
        ref_num: String(ref_num),
        amount: AMOUNT,
      },
      String(card_number), // From callback
      String(tracking_code) // From callback
    );

    if (verifyResult.isError) {
      res.status(400).json({
        success: false,
        message: verifyResult.error.message,
        code: verifyResult.error.code,
      });
    } else {
      res.status(200).json({
        success: true,
        verifyResult,
      });
    }
  } else {
    res.status(400).json({ success: false, message: "Payment failed" });
  }
});
```

## Documentation

For detailed documentation and API references, visit the official documentation: [easypay.js Documentation](https://sajjadmrx.github.io/easypay-js)

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](link-to-contributing-guidelines) for details on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
