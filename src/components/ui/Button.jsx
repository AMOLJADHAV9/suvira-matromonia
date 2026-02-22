import React from 'react'
import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  className = '',
  onClick,
  type = 'button',
  icon,
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-gold to-amber-600 text-white shadow-lg hover:shadow-xl focus:ring-primary-gold',
    theme: 'bg-gradient-to-r from-theme-pink to-theme-purple text-white shadow-soft hover:shadow-glass-lg focus:ring-theme-pink',
    outline: 'border-2 border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-white focus:ring-primary-gold',
    'outline-theme': 'border-2 border-theme-pink text-theme-pink hover:bg-theme-pink hover:text-white focus:ring-theme-pink',
    secondary: 'bg-white text-primary-maroon border-2 border-primary-maroon hover:bg-primary-maroon hover:text-white focus:ring-primary-maroon',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    ghost: 'text-primary-maroon hover:bg-primary-maroon/10 focus:ring-primary-maroon'
  }
  
  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-8 text-base',
    lg: 'py-4 px-10 text-lg',
    xl: 'py-5 px-12 text-xl'
  }
  
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed transform-none' : ''
  
  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`
  
  return (
    <motion.button
      whileHover={!disabled && !loading ? { y: -2 } : {}}
      whileTap={!disabled && !loading ? { y: 0 } : {}}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {icon && !loading && <span>{icon}</span>}
        <span>{children}</span>
      </div>
    </motion.button>
  )
}

export default Button