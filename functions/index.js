const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");

admin.initializeApp();

/** Set CORS headers and handle OPTIONS preflight for HTTP functions. */
function withCors(req, res, handler) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  Promise.resolve(handler(req, res)).catch((err) => {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ error: "Internal error" });
  });
}

const db = admin.firestore();

const PACKAGES = {
  remarriage: { id: "remarriage", validityMonths: 12, price: 2100 },
  platinum: { id: "platinum", validityMonths: 6, price: 2500 },
  gold: { id: "gold", validityMonths: 12, price: 3600 },
  nri: { id: "nri", validityMonths: 12, price: 4100 },
};

const VALID_PACKAGE_IDS = Object.keys(PACKAGES);

function getPackage(packageId) {
  return PACKAGES[packageId] || null;
}

function getNextWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getRazorpaySecret() {
  return (
    process.env.RAZORPAY_KEY_SECRET ||
    (functions.config().razorpay && functions.config().razorpay.key_secret) ||
    ""
  );
}

exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in"
    );
  }

  const { packageId } = data || {};
  if (!packageId || !VALID_PACKAGE_IDS.includes(packageId)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid or missing packageId"
    );
  }

  const pkg = getPackage(packageId);
  if (!pkg) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Package not found"
    );
  }

  const keySecret = getRazorpaySecret();
  if (!keySecret) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Razorpay key secret not configured"
    );
  }

  const amountPaise = pkg.price * 100;

  try {
    const razorpay = new Razorpay({
      key_id:
        process.env.RAZORPAY_KEY_ID ||
        (functions.config().razorpay && functions.config().razorpay.key_id) ||
        "",
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `suvira_${context.auth.uid}_${packageId}_${Date.now()}`,
      notes: {
        userId: context.auth.uid,
        packageId,
      },
    });

    return {
      orderId: order.id,
      amount: amountPaise,
      currency: "INR",
    };
  } catch (err) {
    console.error("[createRazorpayOrder]", err);
    throw new functions.https.HttpsError(
      "internal",
      err.message || "Failed to create order"
    );
  }
});

/** HTTP endpoint with CORS for creating Razorpay order (2nd gen: cors at gateway + explicit in handler). */
exports.createRazorpayOrderHttp = onRequest(
  { cors: true },
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Max-Age", "86400");
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing or invalid Authorization header" });
      return;
    }
    const idToken = authHeader.split("Bearer ")[1];
    let uid;
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      uid = decoded.uid;
    } catch (e) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }
    const { packageId } = typeof req.body === "object" ? req.body : {};
    if (!packageId || !VALID_PACKAGE_IDS.includes(packageId)) {
      res.status(400).json({ error: "Invalid or missing packageId" });
      return;
    }
    const pkg = getPackage(packageId);
    if (!pkg) {
      res.status(400).json({ error: "Package not found" });
      return;
    }
    const keySecret = getRazorpaySecret();
    if (!keySecret) {
      res.status(500).json({ error: "Razorpay not configured" });
      return;
    }
    const amountPaise = pkg.price * 100;
    try {
      const razorpay = new Razorpay({
        key_id:
          process.env.RAZORPAY_KEY_ID ||
          (functions.config().razorpay && functions.config().razorpay.key_id) ||
          "",
        key_secret: keySecret,
      });
      const order = await razorpay.orders.create({
        amount: amountPaise,
        currency: "INR",
        receipt: `suvira_${uid}_${packageId}_${Date.now()}`,
        notes: { userId: uid, packageId },
      });
      res.status(200).json({
        orderId: order.id,
        amount: amountPaise,
        currency: "INR",
      });
    } catch (err) {
      console.error("[createRazorpayOrderHttp]", err);
      res.status(500).json({ error: err.message || "Failed to create order" });
    }
  }
);

/** HTTP endpoint with CORS for verifying Razorpay payment (2nd gen: cors at gateway + explicit in handler). */
exports.verifyRazorpayPaymentHttp = onRequest(
  { cors: true },
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Max-Age", "86400");
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing or invalid Authorization header" });
      return;
    }
    const idToken = authHeader.split("Bearer ")[1];
    let uid;
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      uid = decoded.uid;
    } catch (e) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }
    const body = typeof req.body === "object" ? req.body : {};
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      packageId,
    } = body;
    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !packageId
    ) {
      res.status(400).json({ error: "Missing payment details" });
      return;
    }
    if (!VALID_PACKAGE_IDS.includes(packageId)) {
      res.status(400).json({ error: "Invalid packageId" });
      return;
    }
    const pkg = getPackage(packageId);
    if (!pkg) {
      res.status(400).json({ error: "Package not found" });
      return;
    }
    const keySecret = getRazorpaySecret();
    if (!keySecret) {
      res.status(500).json({ error: "Razorpay not configured" });
      return;
    }
    const sigBody = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(sigBody)
      .digest("hex");
    if (expectedSignature !== razorpay_signature) {
      res.status(400).json({ error: "Invalid payment signature" });
      return;
    }
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + pkg.validityMonths);
    const contactUsage = {
      weeklyCount: 0,
      weeklyResetAt: getNextWeekStart(),
      totalCount: 0,
      contactedProfileIds: [],
    };
    const subscription = {
      packageId,
      planType: packageId,
      startDate,
      expiryDate,
      isActive: true,
    };
    try {
      const batch = db.batch();
      const userRef = db.collection("users").doc(uid);
      batch.update(userRef, {
        role: "premium_user",
        isPremium: true,
        subscription,
        contactUsage,
      });
      const paymentsRef = db.collection("payments").doc();
      batch.set(paymentsRef, {
        userId: uid,
        amount: pkg.price,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        packageId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });
      const planPurchasesRef = db.collection("planPurchases").doc();
      batch.set(planPurchasesRef, {
        userId: uid,
        packageId,
        startDate,
        expiryDate,
        price: pkg.price,
        paymentId: razorpay_payment_id,
        activatedBy: "razorpay",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      await batch.commit();
      res.status(200).json({ success: true });
    } catch (err) {
      console.error("[verifyRazorpayPaymentHttp]", err);
      res.status(500).json({ error: err.message || "Failed to activate plan" });
    }
  }
);

exports.verifyRazorpayPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in"
    );
  }

  const uid = context.auth.uid;
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    packageId,
  } = data || {};

  if (
    !razorpay_payment_id ||
    !razorpay_order_id ||
    !razorpay_signature ||
    !packageId
  ) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing payment details"
    );
  }

  if (!VALID_PACKAGE_IDS.includes(packageId)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid packageId"
    );
  }

  const pkg = getPackage(packageId);
  if (!pkg) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Package not found"
    );
  }

  const keySecret = getRazorpaySecret();
  if (!keySecret) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Razorpay key secret not configured"
    );
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");
  if (expectedSignature !== razorpay_signature) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid payment signature"
    );
  }

  const startDate = new Date();
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + pkg.validityMonths);

  const contactUsage = {
    weeklyCount: 0,
    weeklyResetAt: getNextWeekStart(),
    totalCount: 0,
    contactedProfileIds: [],
  };

  const subscription = {
    packageId,
    planType: packageId,
    startDate,
    expiryDate,
    isActive: true,
  };

  try {
    const batch = db.batch();

    const userRef = db.collection("users").doc(uid);
    batch.update(userRef, {
      role: "premium_user",
      isPremium: true,
      subscription,
      contactUsage,
    });

    const paymentsRef = db.collection("payments").doc();
    batch.set(paymentsRef, {
      userId: uid,
      amount: pkg.price,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      packageId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    const planPurchasesRef = db.collection("planPurchases").doc();
    batch.set(planPurchasesRef, {
      userId: uid,
      packageId,
      startDate,
      expiryDate,
      price: pkg.price,
      paymentId: razorpay_payment_id,
      activatedBy: "razorpay",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await batch.commit();

    return { success: true };
  } catch (err) {
    console.error("[verifyRazorpayPayment]", err);
    throw new functions.https.HttpsError(
      "internal",
      err.message || "Failed to activate plan"
    );
  }
});
