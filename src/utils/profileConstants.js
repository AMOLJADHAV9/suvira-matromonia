// Profile Step 1 - Community & Birth Details

export const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other']

export const CASTE_BY_RELIGION = {
  Hindu: ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Other'],
  Muslim: ['Sunni', 'Shia', 'Other'],
  Christian: ['Catholic', 'Protestant', 'Orthodox', 'Other'],
  Sikh: ['Jat', 'Khatri', 'Arora', 'Other'],
  Buddhist: ['Theravada', 'Mahayana', 'Vajrayana', 'Other'],
  Jain: ['Digambar', 'Shvetambar', 'Other'],
  Other: ['Other']
}

export const SUBCASTE_BY_CASTE = {
  Brahmin: ['Iyer', 'Iyengar', 'Kanyakubja', 'Gaur', 'Maithil', 'Saraswat', 'Other'],
  Kshatriya: ['Rajput', 'Maratha', 'Jat', 'Gurjar', 'Other'],
  Vaishya: ['Agarwal', 'Gupta', 'Marwari', 'Other'],
  Shudra: ['Other'],
  Sunni: ['Hanafi', 'Shafi', 'Maliki', 'Hanbali', 'Other'],
  Shia: ['Twelver', 'Ismaili', 'Other'],
  Catholic: ['Other'],
  Protestant: ['Other'],
  Orthodox: ['Other'],
  Jat: ['Other'],
  Khatri: ['Other'],
  Arora: ['Other'],
  Theravada: ['Other'],
  Mahayana: ['Other'],
  Vajrayana: ['Other'],
  Digambar: ['Other'],
  Shvetambar: ['Other'],
  Other: ['Other']
}

export const GOTRAS = ['Bharadwaj', 'Kashyap', 'Vashishtha', 'Vishwamitra', 'Gautam', 'Other']

export const RASHIS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati'
]

export const MANGLIK_OPTIONS = ['Yes', 'No', 'Unknown']

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
