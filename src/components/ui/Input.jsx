import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

const Input = forwardRef(({ 
  label, 
  error, 
  helperText, 
  className = '',
  type = 'text',
  required = false,
  disabled = false,
  icon,
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300'
  const normalClasses = 'border-gray-200 focus:border-primary-gold focus:ring-2 focus:ring-primary-gold/20'
  const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
  const disabledClasses = 'bg-gray-100 cursor-not-allowed'
  
  const combinedClasses = `${baseClasses} ${error ? errorClasses : normalClasses} ${disabled ? disabledClasses : ''} ${className}`
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={type}
          className={`${combinedClasses} ${icon ? 'pl-10' : ''}`}
          disabled={disabled}
          whileFocus={{ scale: 1.02 }}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input