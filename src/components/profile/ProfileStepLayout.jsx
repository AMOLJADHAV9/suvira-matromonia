import React from 'react'

const ProfileStepLayout = ({ currentStep, totalSteps, title, children }) => {
  const stepLabels = [
    'Community & Birth',
    'Education & Employment',
    '—',
    'Lifestyle & Habits',
    'Partner Preferences',
    'Final Details'
  ]

  return (
    <div className="space-y-6">
      {/* Step progression indicator */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-primary-maroon font-medium">
            {stepLabels[currentStep - 1] || `Step ${currentStep}`}
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-all ${
                i + 1 <= currentStep ? 'bg-primary-gold' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </p>
      </div>

      {title && (
        <h3 className="text-xl font-semibold text-primary-maroon mb-4">{title}</h3>
      )}

      {children}
    </div>
  )
}

export default ProfileStepLayout
