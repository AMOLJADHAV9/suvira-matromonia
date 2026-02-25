import { auth, app } from './firebase'

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(window.Razorpay)
      return
    }
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`)
    if (existing) {
      const check = () => (window.Razorpay ? resolve(window.Razorpay) : setTimeout(check, 50))
      check()
      return
    }
    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT
    script.async = true
    script.onload = () => resolve(window.Razorpay)
    script.onerror = () => resolve(null)
    document.head.appendChild(script)
  })
}

const PROJECT_ID = app?.options?.projectId || 'suvira-firebase-react'
const FUNCTIONS_REGION = 'us-central1'
const FUNCTIONS_BASE = `https://${FUNCTIONS_REGION}-${PROJECT_ID}.cloudfunctions.net`
const CREATE_ORDER_HTTP_URL = `${FUNCTIONS_BASE}/createRazorpayOrderHttp`
const VERIFY_PAYMENT_HTTP_URL = `${FUNCTIONS_BASE}/verifyRazorpayPaymentHttp`

/**
 * Create a Razorpay order for the given package. Uses HTTP endpoint with CORS (callable had CORS issues).
 */
export async function createOrder(packageId) {
  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be logged in to create an order')
  }
  const token = await user.getIdToken()
  const res = await fetch(CREATE_ORDER_HTTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ packageId }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`)
  }
  if (!data?.orderId) {
    throw new Error(data?.message || 'Failed to create order')
  }
  return {
    orderId: data.orderId,
    amount: data.amount,
    currency: data.currency || 'INR',
  }
}

/**
 * Open Razorpay Checkout. onSuccess receives { razorpay_payment_id, razorpay_order_id, razorpay_signature }.
 */
export async function openRazorpayCheckout({
  orderId,
  amount,
  currency = 'INR',
  userEmail = '',
  userName = '',
  onSuccess,
  onDismiss,
}) {
  const Razorpay = await loadRazorpayScript()
  if (!Razorpay) {
    throw new Error('Razorpay failed to load')
  }

  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID
  if (!keyId) {
    throw new Error('Razorpay Key ID not configured')
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: keyId,
      amount,
      currency,
      order_id: orderId,
      name: 'Suvira Matromony',
      description: 'Premium package purchase',
      prefill: {
        email: userEmail || undefined,
        name: userName || undefined,
      },
      modal: {
        ondismiss() {
          const err = new Error('Payment cancelled')
          if (onDismiss) onDismiss()
          reject(err)
        },
      },
      handler(response) {
        if (onSuccess) {
          onSuccess({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          })
        }
        resolve(response)
      },
    }

    const rzp = new Razorpay(options)
    rzp.on('payment.failed', (response) => {
      const err = new Error(response.error?.description || 'Payment failed')
      reject(err)
    })
    rzp.open()
  })
}

/**
 * Verify payment with backend and activate plan. Uses HTTP endpoint with CORS.
 */
export async function verifyPayment({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  packageId,
}) {
  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be logged in to verify payment')
  }
  const token = await user.getIdToken()
  const res = await fetch(VERIFY_PAYMENT_HTTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      packageId,
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error || `Verification failed (${res.status})`)
  }
  if (!data?.success) {
    throw new Error(data?.message || 'Verification failed')
  }
  return data
}
