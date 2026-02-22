// Color Palette Constants
export const COLORS = {
  primary: {
    maroon: '#800020',
    gold: '#D4AF37',
    cream: '#FFF8E7',
    charcoal: '#1F1F1F',
  },
  secondary: {
    light: '#FFF5E6',
    dark: '#4A4A4A',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  }
}

// Role Constants
export const ROLES = {
  FREE_USER: 'free_user',
  PREMIUM_USER: 'premium_user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
}

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  ONE_MONTH: {
    id: '1m',
    name: '1 Month Premium',
    price: 999,
    features: [
      'Unlimited Profile Views',
      'Full Photos Access',
      'Contact Details',
      'Premium Chat',
      'Advanced Search Filters'
    ]
  },
  THREE_MONTHS: {
    id: '3m',
    name: '3 Months Premium',
    price: 2499,
    popular: true,
    features: [
      'All 1 Month Features',
      'Priority in Match Suggestions',
      'Profile Highlighting',
      '20% Savings'
    ]
  },
  SIX_MONTHS: {
    id: '6m',
    name: '6 Months Premium',
    price: 4499,
    features: [
      'All 3 Month Features',
      'Maximum Visibility',
      'Dedicated Support',
      '40% Savings'
    ]
  }
}

// Profile Status
export const PROFILE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
  HIDDEN: 'hidden',
}

// Interest Status
export const INTEREST_STATUS = {
  SENT: 'sent',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
}

// Religions
export const RELIGIONS = [
  'Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Jewish', 'Other'
]

// Indian States
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Other'
]

// Education Levels
export const EDUCATION_LEVELS = [
  'High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate',
  'Diploma', 'Professional Degree', 'Other'
]

// Working Sectors
export const WORKING_SECTORS = [
  'IT/Software', 'Business/Management', 'Banking/Finance', 'Healthcare',
  'Education', 'Government', 'Engineering', 'Marketing', 'Media/Entertainment',
  'Hospitality', 'Retail', 'Other'
]

// Horoscope Signs
export const HOROSCOPE_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]