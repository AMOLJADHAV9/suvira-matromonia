const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

admin.initializeApp();

setGlobalOptions({ maxInstances: 10 });

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_Sk5NRNRnvH7M77",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "N3WQtEHFBmTLrLPsva9pKtsW",
});

// Packages mapped by ID matching the frontend definitions
const PACKAGES = {
  remarriage: { amount: 2100, currency: "INR" },
  platinum: { amount: 2500, currency: "INR" },
  gold: { amount: 3600, currency: "INR" },
  nri: { amount: 4100, currency: "INR" },
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
        // Payment verified successfully
        
        // Now update the user's Firestore document
        const authHeader = req.headers.authorization || "";
        if (!authHeader.startsWith("Bearer ")) {
          logger.error("No valid auth token found for successful payment");
          return res.status(401).json({ success: false, message: "Payment successful but failed to update profile (unauthorized)" });
        }
        const idToken = authHeader.split("Bearer ")[1];
        
        let uid;
        try {
          const decodedToken = await admin.auth().verifyIdToken(idToken);
          uid = decodedToken.uid;
        } catch (authErr) {
          logger.error("Error verifying auth token:", authErr);
          return res.status(401).json({ success: false, message: "Payment successful but failed to update profile (invalid token)" });
        }

        const packageIdToUse = req.body.packageId || 'unknown';
        const pkgConfig = PACKAGES[packageIdToUse] || { amount: 0, currency: "INR" };
        
        // Calculate expiry date (assuming 12 months for remarriage, gold, nri and 6 months for platinum based on frontend code)
        // If we don't know exactly, default to 12 months.
        let validityMonths = 12;
        if (packageIdToUse === 'platinum') validityMonths = 6;
        
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + validityMonths);

        try {
          await admin.firestore().collection("users").doc(uid).update({
            role: "premium_user",
            subscription: {
              packageId: packageIdToUse,
              isActive: true,
              purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
              expiryDate: admin.firestore.Timestamp.fromDate(expiryDate),
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id
            }
          });
          logger.info(`Successfully updated user ${uid} to premium_user with package ${packageIdToUse}`);
          return res.status(200).json({ success: true, message: "Payment verified successfully and profile upgraded" });
        } catch (dbErr) {
          logger.error(`Error updating Firestore for user ${uid}:`, dbErr);
          return res.status(500).json({ success: false, message: "Payment successful but database update failed" });
        }
      } else {
        return res.status(400).json({ success: false, message: "Invalid signature" });
      }
    } catch (error) {
      logger.error("Error verifying payment:", error);
      return res.status(500).json({ error: "Verification failed" });
    }
  });
});
