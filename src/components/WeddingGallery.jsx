import React from 'react'
import { motion } from 'framer-motion'

/**
 * Reusable wedding photo gallery grid with staggered animations and hover effects.
 * @param {Object} props
 * @param {string[]} props.images - Array of image URLs/paths
 * @param {number} [props.columns=4] - Grid columns on large screens (2-4)
 * @param {string} [props.className] - Additional CSS classes for the container
 */
const WeddingGallery = ({ images, columns = 4, className = '' }) => {
  const gridCols = {
    2: 'grid-cols-2 md:grid-cols-2 lg:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }
  const gridClass = gridCols[columns] ?? gridCols[4]

  return (
    <div className={`grid ${gridClass} gap-4 ${className}`}>
      {images.map((src, index) => (
        <motion.div
          key={`${src}-${index}`}
          className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          whileHover={{ scale: 1.03 }}
        >
          <img
            src={src}
            alt={`Wedding ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  )
}

export default WeddingGallery
