import React, { useEffect } from 'react'

const Toast = ({ message, onClose, type = 'success' }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const bg = type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg border shadow-lg ${bg} animate-fade-in`}
      role="alert"
    >
      {message}
    </div>
  )
}

export default Toast
