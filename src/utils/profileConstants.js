// Profile Step 1 - Community & Birth Details (Maharashtra-focused)
import {
  RELIGIONS as MH_RELIGIONS,
  CASTES as MH_CASTES,
  SUB_CASTES as MH_SUB_CASTES,
  GOTRAS as MH_GOTRAS,
  RASHIS as MH_RASHIS,
  NAKSHATRAS as MH_NAKSHATRAS,
  MANGLIK_OPTIONS as MH_MANGLIK_OPTIONS,
  MAHARASHTRA_CITIES
} from '../constants/maharashtraProfileOptions'

export { MAHARASHTRA_CITIES }
export const RELIGIONS = MH_RELIGIONS
export const CASTES = MH_CASTES

// SUBCASTE_BY_CASTE: caste -> subcastes; components use SUBCASTE_BY_CASTE[caste] || ['Other']
export const SUBCASTE_BY_CASTE = { ...MH_SUB_CASTES }

// CASTE_BY_RELIGION for backward compatibility (religion-filtered caste options)
export const CASTE_BY_RELIGION = {
  Hindu: ['Maratha', 'Kunbi', 'Brahmin', 'CKP (Chandraseniya Kayastha Prabhu)', 'Vaishya', 'Lingayat', 'Mali', 'Dhangar', 'Teli', 'Sonar', 'Lohar', 'Koli', 'Banjara', 'Matang', 'Mahar', 'Other'],
  Muslim: ['Muslim Sunni', 'Muslim Shia', 'Other'],
  Buddhist: MH_CASTES,
  Jain: ['Jain', 'Other'],
  Christian: ['Christian', 'Other'],
  Sikh: MH_CASTES,
  Parsi: MH_CASTES,
  Other: ['Other']
}

export const GOTRAS = MH_GOTRAS
export const RASHIS = MH_RASHIS
export const NAKSHATRAS = MH_NAKSHATRAS
export const MANGLIK_OPTIONS = MH_MANGLIK_OPTIONS

// Profile Step 2 - Education & Employment

export const HIGHEST_EDUCATION = [
  'Doctorate / PhD', 'Masters', 'Bachelors', 'Diploma',
  'Higher Secondary', 'Secondary', 'Other'
]

export const DEGREE_TYPES = [
  'Engineering', 'Medical', 'Management', 'Arts / Humanities',
  'Science', 'Commerce', 'Law', 'Other'
]

export const EMPLOYMENT_TYPES = [
  'Private', 'Government', 'PSU', 'Business', 'Self-employed', 'Not working'
]

export const INCOME_RANGES = [
  'Below ₹2 LPA', '₹2–4 LPA', '₹4–6 LPA', '₹6–8 LPA', '₹8–10 LPA',
  '₹10–15 LPA', '₹15–20 LPA', '₹20–25 LPA', 'Above ₹25 LPA'
]

export const WORK_COUNTRIES = [
  'India', 'USA', 'Canada', 'UK', 'UAE', 'Australia', 'Other'
]

// Profile Step 4 - Lifestyle & Habits

export const DIET_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan']

export const FOOD_TYPE_OPTIONS = ['Home food', 'Outside food', 'Both']

export const DRINKING_OPTIONS = ['No', 'Yes', 'Occasionally']

export const SMOKING_OPTIONS = ['No', 'Yes', 'Occasionally']

export const FITNESS_OPTIONS = ['Gym', 'Yoga', 'Walking', 'Sports', 'None', 'Other']

export const HOBBIES_OPTIONS = [
  'Reading', 'Music', 'Movies', 'Travel', 'Cooking', 'Photography', 'Gaming', 'Art', 'Other'
]

export const INTERESTS_OPTIONS = [
  'Family-oriented', 'Career-focused', 'Spiritual', 'Fitness', 'Foodie', 'Travel', 'Pets', 'Other'
]

// Profile Step 5 - Partner Preferences

export const MARITAL_STATUS_OPTIONS = ['Never Married', 'Divorced', 'Widowed']

export const HEIGHT_OPTIONS = Array.from({ length: 91 }, (_, i) => 120 + i) // 120cm to 210cm

export const AGE_OPTIONS = Array.from({ length: 53 }, (_, i) => 18 + i) // 18 to 70
