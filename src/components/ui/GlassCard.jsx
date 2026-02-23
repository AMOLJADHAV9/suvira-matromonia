import React from 'react'
import { motion } from 'framer-motion'

/**
 * Glassmorphism card with maroon-gold theme (matches landing page)
 * Rounded corners, soft shadows, backdrop blur
 */
const GlassCard = ({
  children,
  className = '',
  hover = true,
  onClick,
  padding = 'p-6',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`
        bg-white/90 backdrop-blur-xl rounded-2xl
        border border-primary-gold/20
        shadow-premium
        ${padding}
        ${hover ? 'hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default GlassCard
