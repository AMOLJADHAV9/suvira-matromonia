// Date and Age Helpers
export const calculateAge = (birthDate) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return ''
  
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    default:
      return d.toLocaleDateString()
  }
}

export const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Location Helpers
export const formatLocation = (city, state) => {
  if (city && state) return `${city}, ${state}`
  if (city) return city
  if (state) return state
  return 'Location not specified'
}

// Income Formatting
export const formatIncome = (amount) => {
  if (!amount) return 'Not specified'
  
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)} K`
  } else {
    return `₹${amount}`
  }
}

// Height Formatting
export const formatHeight = (heightInCm) => {
  if (!heightInCm) return 'Not specified'
  
  const feet = Math.floor(heightInCm / 30.48)
  const inches = Math.round((heightInCm % 30.48) / 2.54)
  
  return `${feet}'${inches}" (${heightInCm} cm)`
}

// Name Formatting
export const formatName = (firstName, lastName = '') => {
  if (!firstName) return 'User'
  return lastName ? `${firstName} ${lastName}` : firstName
}

// Profile ID Generation
export const generateProfileId = (name, userId) => {
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  const shortId = userId.substring(0, 8)
  return `${cleanName}${shortId}`
}

// Truncate Text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Capitalize Words
export const capitalizeWords = (str) => {
  if (!str) return ''
  return str.replace(/\b\w/g, char => char.toUpperCase())
}

// Phone Number Formatting
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  const cleanPhone = phone.replace(/\D/g, '')
  if (cleanPhone.length === 10) {
    return `${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6)}`
  }
  return phone
}

// Email Masking
export const maskEmail = (email) => {
  if (!email) return ''
  const [name, domain] = email.split('@')
  if (name.length <= 2) return email
  const maskedName = name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1)
  return `${maskedName}@${domain}`
}

// Time Ago Calculation
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' years ago'
  
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' months ago'
  
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' days ago'
  
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' hours ago'
  
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' minutes ago'
  
  return Math.floor(seconds) + ' seconds ago'
}

// Array Helpers
export const shuffleArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export const chunkArray = (array, chunkSize) => {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

// Object Helpers
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

// Storage Helpers
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error setting localStorage:', error)
  }
}

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error getting localStorage:', error)
    return defaultValue
  }
}

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing localStorage:', error)
  }
}