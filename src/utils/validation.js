// Form Validation Rules
export const VALIDATION_RULES = {
  required: (value) => value && value.trim() !== '',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^[6-9]\d{9}$/.test(value),
  password: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
  age: (value) => value >= 18 && value <= 70,
  height: (value) => value >= 100 && value <= 250, // in cm
  income: (value) => value >= 0 && value <= 10000000, // in INR
  name: (value) => /^[a-zA-Z\s]{2,50}$/.test(value),
  date: (value) => !isNaN(Date.parse(value))
}

// Validation Messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid 10-digit Indian mobile number',
  password: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  age: 'Age must be between 18 and 70',
  height: 'Height must be between 100cm and 250cm',
  income: 'Please enter a valid income amount',
  name: 'Name should contain only letters and spaces (2-50 characters)',
  date: 'Please enter a valid date'
}

// Form Validation Function
export const validateField = (fieldName, value, rules = []) => {
  const errors = []
  
  rules.forEach(rule => {
    if (rule === 'required' && !VALIDATION_RULES.required(value)) {
      errors.push(VALIDATION_MESSAGES.required)
    }
    
    if (VALIDATION_RULES[rule] && !VALIDATION_RULES[rule](value)) {
      errors.push(VALIDATION_MESSAGES[rule])
    }
  })
  
  return errors
}

// Profile Completion Validation
export const validateProfileCompletion = (profileData) => {
  const requiredFields = [
    'personal.name',
    'personal.age',
    'personal.gender',
    'personal.religion',
    'personal.caste',
    'personal.location',
    'education.degree',
    'education.working_sector',
    'family.father_name',
    'family.mother_name',
    'lifestyle.diet',
    'photos'
  ]
  
  const missingFields = []
  
  requiredFields.forEach(field => {
    const value = getNestedValue(profileData, field)
    if (!value || (Array.isArray(value) && value.length === 0)) {
      missingFields.push(field)
    }
  })
  
  return {
    isComplete: missingFields.length === 0,
    completionPercentage: Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100),
    missingFields
  }
}

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current && current[key], obj)
}

// Photo Validation
export const validatePhoto = (file) => {
  const errors = []
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  
  if (!file) {
    errors.push('Please select a photo')
    return errors
  }
  
  if (file.size > maxSize) {
    errors.push('Photo size should be less than 5MB')
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('Please upload a JPG, JPEG, or PNG file')
  }
  
  return errors
}

// Horoscope Validation
export const validateHoroscope = (horoscopeData) => {
  const errors = []
  
  if (!horoscopeData.date || !VALIDATION_RULES.date(horoscopeData.date)) {
    errors.push('Please enter a valid birth date')
  }
  
  if (!horoscopeData.time) {
    errors.push('Please enter birth time')
  }
  
  if (!horoscopeData.place) {
    errors.push('Please enter birth place')
  }
  
  return errors
}