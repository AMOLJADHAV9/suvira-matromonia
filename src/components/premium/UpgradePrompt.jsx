import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import { FaCrown } from 'react-icons/fa'

/**
 * Reusable upgrade prompt when user has no package or limit reached
 */
const UpgradePrompt = ({ title, message, variant = 'default' }) => {
  const navigate = useNavigate()
  const isExpired = variant === 'expired'

  return (
    <div
      className={`
        rounded-2xl p-8 text-center
        ${isExpired
          ? 'bg-amber-50 border-2 border-amber-200'
          : 'bg-primary-cream/80 border border-primary-gold/30'
        }
      `}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-maroon/10 text-primary-maroon mb-4">
        <FaCrown className="text-2xl" />
      </div>
      <h3 className="text-xl font-serif font-semibold text-primary-maroon mb-2">
        {title || (isExpired ? 'Your Package Has Expired' : 'Upgrade to Continue')}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message ||
          (isExpired
            ? 'Your premium package has expired. Purchase a new plan to view profiles, send interest, and see contact details.'
            : 'Purchase a premium package to view profiles, send interest, and see contact details.')}
      </p>
      <Button
        variant="primary"
        onClick={() => navigate('/subscription')}
        icon={<FaCrown />}
        className="bg-gradient-to-r from-primary-maroon to-primary-gold text-white"
      >
        {isExpired ? 'Purchase New Plan' : 'View Packages'}
      </Button>
    </div>
  )
}

export default UpgradePrompt
