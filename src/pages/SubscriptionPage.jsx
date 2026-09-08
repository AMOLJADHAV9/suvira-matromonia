import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCrown } from 'react-icons/fa'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { getAllPackages } from '../utils/premiumPackages'
import { createOrder, openRazorpayCheckout, verifyPayment } from '../services/payment'

const SubscriptionPage = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile, isPremiumUser, getActivePackage, refreshUserProfile } = useAuth()
  const packages = getAllPackages()
  const isUserPremium = isPremiumUser ? isPremiumUser() : false
  const activePackage = getActivePackage ? getActivePackage() : null
  const [loadingPackageId, setLoadingPackageId] = useState(null)
  const [paymentError, setPaymentError] = useState(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handlePayNow = async (pkg) => {
    if (!currentUser?.uid) {
      setPaymentError('Please log in to purchase a package')
      return
    }
    setPaymentError(null)
    setLoadingPackageId(pkg.id)
    try {
      const { orderId, amount, currency } = await createOrder(pkg.id)
      await openRazorpayCheckout({
        orderId,
        amount,
        currency,
        userEmail: currentUser.email || '',
        userName: currentUser.displayName || currentUser.email || '',
        onSuccess: async (response) => {
          try {
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              packageId: pkg.id,
            })
            setPaymentSuccess(true)
            await refreshUserProfile?.()
          } catch (verifyErr) {
            setPaymentError(verifyErr?.message || 'Failed to activate plan')
          }
        },
      })
    } catch (err) {
      setPaymentError(err?.message || 'Payment failed')
    } finally {
      setLoadingPackageId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-cream to-white">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-primary-maroon mb-4 text-center">
            Premium Packages
          </h1>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Purchase a plan to view profiles, send interest, see contact details, and chat with matches.
          </p>

          {isUserPremium && (
            <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-300/80 shadow-sm max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-xl shadow-md shrink-0">
                  <FaCrown />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                    Active Subscription: {activePackage?.name || 'Premium Member'}
                  </h3>
                  <p className="text-sm text-amber-900/80">
                    {userProfile?.subscription?.expiryDate
                      ? `Valid until ${userProfile.subscription.expiryDate.toDate ? userProfile.subscription.expiryDate.toDate().toLocaleDateString() : new Date(userProfile.subscription.expiryDate).toLocaleDateString()}`
                      : 'You currently have active premium access.'}
                  </p>
                </div>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-amber-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs shrink-0">
                Active Plan
              </span>
            </div>
          )}

          {paymentSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-800 text-center font-medium">
              Payment successful. Your plan is now active.
            </div>
          )}
          {paymentError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-center">
              {paymentError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, index) => {
              const isCurrent = activePackage?.id === pkg.id || (isUserPremium && index === 0 && !activePackage?.id)
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 relative ${
                    isCurrent
                      ? 'border-amber-400 shadow-xl ring-2 ring-amber-400/50 scale-[1.02]'
                      : 'border-primary-gold/20 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isCurrent && (
                    <div className="bg-amber-500 text-white text-xs font-bold text-center py-1 uppercase tracking-wider">
                      Current Active Plan
                    </div>
                  )}
                  <div
                    className="px-6 py-4 text-center font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor: pkg.headerColor || '#800020',
                      color: pkg.headerColor === '#D4AF37' ? '#1F1F1F' : 'white',
                    }}
                  >
                    {pkg.name.replace(' Package', '')}
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <p className="text-2xl font-bold text-primary-maroon">
                        {pkg.validityMonths} MONTHS
                      </p>
                      <p className="text-sm text-gray-500">Months Validity</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary-maroon">
                        {pkg.contactsPerWeek}
                      </p>
                      <p className="text-sm text-gray-500">Contact per week</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary-maroon">
                        {pkg.totalContacts}
                      </p>
                      <p className="text-sm text-gray-500">Total Profile contact</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{pkg.price}/-
                    </p>
                    <Button
                      variant="primary"
                      className="w-full rounded-full py-3 font-semibold"
                      style={{
                        background: pkg.headerColor === '#D4AF37'
                          ? 'linear-gradient(to right, #D4AF37, #e8c547)'
                          : 'linear-gradient(to right, #800020, #a00028)',
                        color: pkg.headerColor === '#D4AF37' ? '#1F1F1F' : 'white',
                        border: 'none',
                      }}
                      onClick={() => handlePayNow(pkg)}
                      disabled={!!loadingPackageId}
                      loading={loadingPackageId === pkg.id}
                    >
                      {loadingPackageId === pkg.id ? 'Processing...' : isCurrent ? 'Renew Plan' : 'Pay Now'}
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            Pay securely with cards, UPI, or net banking. You can also contact us for manual activation.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SubscriptionPage
