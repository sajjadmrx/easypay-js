# Paystar API – Consolidated Reference (July 31 2025)

> **Purpose**
> This single markdown file gathers every publicly‑available Paystar endpoint, parameter, workflow and status code so that engineering teams can integrate the platform without jumping between pages on [https://docs.paystar.ir](https://docs.paystar.ir). All descriptions are condensed and translated to English for clarity while preserving the original field names and request/response formats.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Open‑Banking Services](#open-banking-services)
   3.1 [Identity & Verification](#identity--verification)
   3.2 [Fund Transfer](#fund-transfer)
   3.3 [Inquiry & Conversion](#inquiry--conversion)
4. [Payment Services](#payment-services)
   4.1 [Internet Payment Gateway (IPG)](#internet-payment-gateway-ipg)
   4.2 [Wallet Payout APIs](#wallet-payout-apis)
5. [Shared Status Codes](#shared-status-codes)
6. [HMAC Signatures](#hmac-signatures)
7. [Sample Workflows](#sample-workflows)
8. [Change Log](#change-log)

---

## Getting Started

- **Base domains**

  - REST APIs: `https://core.paystar.ir/api`
  - Docs root: `https://docs.paystar.ir`

- **REST style** – All endpoints are JSON‑over‑HTTP; successful requests return `application/json` with a top‑level `status` field (int or string) plus `message` and `data`.

---

## Authentication

| Asset                                   | Lifetime  | Where it appears                  | How to refresh                                                        |
| --------------------------------------- | --------- | --------------------------------- | --------------------------------------------------------------------- |
| **api_key** (Open‑Banking / Wallet)     | 24 h      | `Authorization: Bearer <api_key>` | `POST /application/refresh-api-key` or `POST /wallet/refresh-api-key` |
| **inquiry_key** (Wallet balance/report) | 24 h      | same as above                     | `POST /wallet/refresh-inquiry-key`                                    |
| **gateway_id** (Payment gateway)        | permanent | Bearer header for IPG endpoints   | —                                                                     |

**Common headers**

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <TOKEN>
```

---

## Open‑Banking Services

### Identity & Verification

| Use‑case                        | Endpoint                                                 | Method | Required body                                                                                |
| ------------------------------- | -------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- |
| Refresh API Key                 | `/open-banking/application/refresh-api-key`              | `POST` | `application_id`, `access_password`, `refresh_token`                                         |
| Mobile ↔ National ID (SHAHKAR) | `/open-banking/service/info-matching/mobile-national-id` | `POST` | `application_id`, `access_password`, `national_id`, `mobile_number`                          |
| Card ↔ National ID             | `/open-banking/service/info-matching/card-national-id`   | `POST` | `application_id`, `access_password`, `national_id`, `card_number`, `birth_date (YYYY-MM-DD)` |
| IBAN ↔ National ID             | `/open-banking/service/info-matching/iban-national-id`   | `POST` | `application_id`, `access_password`, `national_id`, `iban`, `birth_date`                     |

**Successful response skeleton**

```json
{
  "status": 1,
  "data": { "is_matched": true },
  "message": "Request succeeded"
}
```

### Fund Transfer

| Function                           | Endpoint                             | Method               | Notes                                                                 |
| ---------------------------------- | ------------------------------------ | -------------------- | --------------------------------------------------------------------- |
| Bank transfer (single / batch)     | `/bank-transfer/v2/settlement`       | `POST`               | Body outer keys: `application_id`, `access_password`, `transfers:[…]` |
| List transfer requests             | `/bank-transfer/settlement-requests` | `GET` (query string) | Supports `deposit`, `track_id`, `limit`, `skip` filters               |
| Account balance (Export Bank only) | `/open-banking/service/balance`      | `GET`                | `account_number` required                                             |

`transfers[]` object

```json
{
  "amount": 100000,
  "deposit": "011123456789",
  "destination_account": "IR930170000000123456789001",
  "destination_firstname": "Ali",
  "destination_lastname": "Moradi",
  "track_id": "UNIQUE_TX_ID",
  "pay_id": "(optional if destination is Sheba)"
}
```

Return value (single)

```json
{
  "status": "ok",
  "data": {
    "hashid": "1j18r",
    "track_id": "UNIQUE_TX_ID",
    "status": "success|failed|pending",
    "message": "…",
    "ref_code": "bank_ref"
  }
}
```

### Inquiry & Conversion

| Function                     | Endpoint                                             | Method | Body                                                             |
| ---------------------------- | ---------------------------------------------------- | ------ | ---------------------------------------------------------------- |
| Account ➜ IBAN               | `/open-banking/service/bank-inquiry/account-to-iban` | `POST` | `application_id`, `access_password`, `account_number`, `bank_id` |
| Card ➜ IBAN                  | `/open-banking/service/bank-inquiry/card-to-iban`    | `POST` | `application_id`, `access_password`, `card`                      |
| IBAN Inquiry (owners + bank) | `/open-banking/service/bank-inquiry/iban-inquiry`    | `POST` | `application_id`, `access_password`, `iban`                      |

**Bank‑ID catalogue** (partial)
`010` Central Bank, `012` Bank Mellat, `016` Keshavarzi, `017` Bank Melli, `018` Tejarat, `019` Saderat, …

---

## Payment Services

### Internet Payment Gateway (IPG)

Base path: `https://core.paystar.ir/api/pardakht`

1. **Create Transaction**
   `POST /create`
   Required: `amount (≥5000 IRR)`, `order_id`, `callback`, `sign`
   Optional: `name`, `phone`, `mail`, `description`, `allotment[]`, `callback_method`, `wallet_hashid`, `national_code`, `card_number`, `referer_id`

   ```json
   {
     "amount": 10000,
     "order_id": "ORD‑45245",
     "callback": "https://merchant.com/pay/callback",
     "sign": "<HMAC_SHA512>",
     "wallet_hashid": "w123…"
   }
   ```

   Success ⇒ token + `ref_num`.

2. **Redirect User to Gateway**
   `GET|POST /payment` with form/qs param `token`.

3. **Callback Payload** (to merchant)
   Fields: `status`, `order_id`, `ref_num`, `transaction_id`, `card_number`, `hashed_card_number`, `tracking_code` (the last three omitted if status≠1).

4. **Verify Transaction**
   `POST /verify` with `ref_num`, `amount`, `sign`. Use `card_number`+`tracking_code` inside signature.

5. **Inquiry**
   `POST /inquiry` – same payload as verify; idempotent; can be called repeatedly.

### Wallet Payout APIs

- **Refresh API Key**
  `POST /wallet/refresh-api-key` with `wallet_hashid`, `password`, `refresh_token`, `sign`.
- **Refresh Inquiry Key**
  `POST /wallet/refresh-inquiry-key` with `wallet_hashid`, `password`, `refresh_inquiry_key`, `sign`.

_HMAC signing rule_
`sign_data = "WALLET_HASHID#PASSWORD"` ➜ `HMAC_SHA512(sign_key, sign_data)`.

---

## Shared Status Codes

| Code   | Meaning                             |
| ------ | ----------------------------------- |
| **0**  | Internal server error               |
| **1**  | Success                             |
| **2**  | Application not found               |
| **3**  | Application inactive                |
| **4**  | Invalid auth token                  |
| **5**  | Expired auth token                  |
| **6**  | Wrong access password               |
| **7**  | IP not whitelisted                  |
| **8**  | Service disabled for app            |
| **9**  | Insufficient banking wallet balance |
| **10** | Invalid input data                  |
| **11** | Upstream provider error             |
| **12** | Open‑banking settings missing       |
| **13** | Invalid refresh token               |

Payment‑gateway also returns `unauthenticated` string statuses when `gateway_id` is invalid.

---

## HMAC Signatures

```
# Generic example in Python
import hmac, hashlib
message = "{amount}#{order_id}#{callback}".encode()
signature = hmac.new(sign_key.encode(), message, hashlib.sha512).hexdigest()
```

- Always lowercase hex.
- Use `SHA512` and **never expose** your `sign_key` to the front‑end.

---

## Sample Workflows

### A. Card ↔ National ID Verification + Conditional Payout

1. `POST /open-banking/service/info-matching/card-national-id`
2. If `is_matched`, generate single transfer with `/bank-transfer/v2/settlement`.
3. Poll `/bank-transfer/settlement-requests?track_id=…` until `status=success`.

### B. Standard 3‑Step IPG Payment

1. `POST /pardakht/create` → receive `token`, `ref_num`.
2. Redirect customer to `/pardakht/payment?token=…`.
3. On callback, `POST /pardakht/verify` within **10 minutes**.
   If timeout or uncertain, fall back to `/pardakht/inquiry`.

---

## Change Log

| Date       | Notes                                                                 |
| ---------- | --------------------------------------------------------------------- |
| 2025‑07‑31 | First consolidated English edition generated from public Paystar docs |

---

### Need something missing?

Feel free to highlight any additional endpoints, sandbox details or edge‑cases and we will update this reference.
