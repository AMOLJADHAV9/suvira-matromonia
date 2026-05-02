const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors")({ origin: true });

setGlobalOptions({ maxInstances: 10 });

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_Sk5NRNRnvH7M77",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "N3WQtEHFBmTLrLPsva9pKtsW",
});

// Mock packages mapped by ID
const PACKAGES = {
  basic: { amount: 999, currency: "INR" },
  premium: { amount: 1999, currency: "INR" },
  vip: { amount: 3999, currency: "INR" },
  // If the user's frontend passes numeric IDs or different names, we should handle them
  // For safety, let's just use the amount provided by the frontend if packageId isn't found, 
  // or just default to 999 to avoid crashing. 
};

// 1. Create Order
exports.createRazorpayOrderHttp = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      const { packageId } = req.body;
      let amount = 999;
      let currency = "INR";

      if (PACKAGES[packageId]) {
        amount = PACKAGES[packageId].amount;
        currency = PACKAGES[packageId].currency;
      } else if (typeof packageId === 'number') {
        // Fallback if packageId is actually just the amount
        amount = packageId;
      }

      const options = {
        amount: amount * 100, // Razorpay amount is in paise
        currency: currency,
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);

      return res.status(200).json({
        orderId: order.id,
        amount: options.amount,
        currency: options.currency,
      });
    } catch (error) {
      logger.error("Error creating Razorpay order:", error);
      return res.status(500).json({ error: "Failed to create order" });
    }
  });
});

// 2. Verify Payment
exports.verifyRazorpayPaymentHttp = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing payment details" });
      }

      const secret = process.env.RAZORPAY_KEY_SECRET || "N3WQtEHFBmTLrLPsva9pKtsW";
      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        return res.status(200).json({ success: true, message: "Payment verified successfully" });
      } else {
        return res.status(400).json({ success: false, message: "Invalid signature" });
      }
    } catch (error) {
      logger.error("Error verifying payment:", error);
      return res.status(500).json({ error: "Verification failed" });
    }
  });
});
