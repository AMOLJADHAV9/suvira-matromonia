import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  shadow = true, 
  border = true,
  padding = 'p-6',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-2xl transition-all duration-300'
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1' : ''
  const shadowClasses = shadow ? 'shadow-lg' : ''
  const borderClasses = border ? 'border border-primary-gold/10' : ''
  
  const combinedClasses = `${baseClasses} ${hoverClasses} ${shadowClasses} ${borderClasses} ${padding} ${className}`
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={combinedClasses}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card