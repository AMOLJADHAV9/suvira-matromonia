# Firebase Cloud Functions (Razorpay)

## Setup

1. Install dependencies: `npm install`
2. Set Razorpay keys (never commit the secret). From the **project root** (not `functions/`):
   ```bash
   firebase functions:config:set razorpay.key_id="YOUR_RAZORPAY_KEY_ID" razorpay.key_secret="YOUR_RAZORPAY_KEY_SECRET"
   ```
   Example for test keys:
   ```bash
   firebase functions:config:set razorpay.key_id="rzp_test_SJxCZQlmSJ9Gdh" razorpay.key_secret="ZeNM5SwRQMcb7PHlWICCCYtn"
   ```
3. Deploy: `firebase deploy --only functions` (requires Blaze plan)

If you see CORS or "Failed to create order" when paying from the app, ensure the Razorpay config above is set and functions are redeployed. The user must be logged in when clicking Pay.

## Callable functions

- **createRazorpayOrder** – Creates a Razorpay order for the given package. Input: `{ packageId }`. Returns `{ orderId, amount, currency }`.
- **verifyRazorpayPayment** – Verifies signature and activates the user's plan. Input: `{ razorpay_payment_id, razorpay_order_id, razorpay_signature, packageId }`.
