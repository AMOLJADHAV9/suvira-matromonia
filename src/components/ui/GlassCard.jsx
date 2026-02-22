import React from 'react'
import { motion } from 'framer-motion'

/**
 * Glassmorphism card with pink-purple theme
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
        bg-white/70 backdrop-blur-xl rounded-2xl
        border border-white/40
        shadow-[0_8px_32px_0_rgba(255,47,146,0.08),0_2px_8px_rgba(138,43,226,0.06)]
        ${padding}
        ${hover ? 'hover:shadow-[0_12px_40px_0_rgba(255,47,146,0.12)] hover:-translate-y-0.5 transition-all duration-300' : ''}
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
