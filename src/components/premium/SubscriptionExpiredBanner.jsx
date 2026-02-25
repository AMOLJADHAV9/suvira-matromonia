import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaExclamationTriangle } from 'react-icons/fa'

/**
 * Banner shown when user's subscription has expired.
 * Appears at top of authenticated pages to warn and prompt purchase.
 */
const SubscriptionExpiredBanner = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-amber-500 text-white px-4 py-3 flex flex-wrap items-center justify-center gap-4 shadow-md">
      <div className="flex items-center gap-2">
        <FaExclamationTriangle className="text-xl flex-shrink-0" />
        <span className="font-medium">
          Your package has expired. All premium features are now disabled.
        </span>
      </div>
      <button
        type="button"
        onClick={() => navigate('/subscription')}
        className="px-4 py-1.5 bg-white text-amber-700 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
      >
        Purchase New Plan
      </button>
    </div>
  )
}

export default SubscriptionExpiredBanner
