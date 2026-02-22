import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import ProfileStepLayout from './ProfileStepLayout'
import {
  updateUserProfile,
  saveProfileStep,
  uploadProfilePhoto,
  calculateProfileCompletion
} from '../../services/auth'
import {
  RELIGIONS,
  CASTE_BY_RELIGION,
  SUBCASTE_BY_CASTE,
  GOTRAS,
  RASHIS,
  NAKSHATRAS,
  MANGLIK_OPTIONS,
  HIGHEST_EDUCATION,
  DEGREE_TYPES,
  EMPLOYMENT_TYPES,
  INCOME_RANGES,
  WORK_COUNTRIES,
  DIET_OPTIONS,
  FOOD_TYPE_OPTIONS,
  DRINKING_OPTIONS,
  SMOKING_OPTIONS,
  FITNESS_OPTIONS,
  HOBBIES_OPTIONS,
  INTERESTS_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  HEIGHT_OPTIONS,
  AGE_OPTIONS
} from '../../utils/profileConstants'
import { INDIAN_STATES } from '../../utils/constants'

const SelectField = ({ label, required, value, onChange, error, options, placeholder = 'Select...' }) => {
  const opts = Array.isArray(options) ? options.map(o => (typeof o === 'string' ? { value: o, label: o } : o)) : []
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value || ''}
        onChange={onChange}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white ${
          error ? 'border-red-500' : 'border-gray-200 focus:border-primary-gold'
        }`}
      >
        <option value="">{placeholder}</option>
        {opts.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

const ChipSelect = ({ label, options, selected = [], onChange }) => {
  const toggle = (opt) => {
    const next = selected.includes(opt)
      ? selected.filter((o) => o !== opt)
      : [...selected, opt]
    onChange(next)
  }
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              selected.includes(opt)
                ? 'bg-primary-gold text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

const ProfileCompletionModal = ({ isOpen, onClose, onComplete, required = false }) => {
  const { currentUser, userProfile, updateProfile } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const profile = userProfile?.profile || {}

  const [formData, setFormData] = useState({
    // Step 1
    religion: profile.communityBirthDetails?.religion || '',
    caste: profile.communityBirthDetails?.caste || '',
    subCaste: profile.communityBirthDetails?.subCaste || '',
    gotra: profile.communityBirthDetails?.gotra || '',
    rashi: profile.communityBirthDetails?.rashi || '',
    nakshatra: profile.communityBirthDetails?.nakshatra || '',
    manglik: profile.communityBirthDetails?.manglik || '',
    timeOfBirth: profile.communityBirthDetails?.timeOfBirth || '',
    placeOfBirth: profile.communityBirthDetails?.placeOfBirth || '',
    // Step 2
    highestEducation: profile.educationEmployment?.highestEducation || '',
    degree: profile.educationEmployment?.degree || '',
    college: profile.educationEmployment?.college || '',
    employmentType: profile.educationEmployment?.employmentType || '',
    jobTitle: profile.educationEmployment?.jobTitle || '',
    companyName: profile.educationEmployment?.companyName || '',
    incomeRange: profile.educationEmployment?.incomeRange || '',
    workCountry: profile.educationEmployment?.workCountry || 'India',
    workCity: profile.educationEmployment?.workCity || '',
    workFromHome: profile.educationEmployment?.workFromHome || false,
    // Step 3 - Family
    fatherName: profile.familyDetails?.fatherName || '',
    motherName: profile.familyDetails?.motherName || '',
    siblings: profile.familyDetails?.siblings || '',
    familyType: profile.familyDetails?.familyType || '',
    // Step 4
    profilePhotoUrl: profile.lifestyleHabits?.profilePhotoUrl || '',
    diet: profile.lifestyleHabits?.diet || '',
    foodType: profile.lifestyleHabits?.foodType || '',
    drinkingHabit: profile.lifestyleHabits?.drinkingHabit || '',
    smokingHabit: profile.lifestyleHabits?.smokingHabit || '',
    fitnessHabit: profile.lifestyleHabits?.fitnessHabit || '',
    hobbies: profile.lifestyleHabits?.hobbies || [],
    interests: profile.lifestyleHabits?.interests || [],
    // Step 5
    preferredAgeMin: profile.partnerPreferences?.preferredAgeRange?.min ?? '',
    preferredAgeMax: profile.partnerPreferences?.preferredAgeRange?.max ?? '',
    preferredHeightMin: profile.partnerPreferences?.preferredHeightRange?.min ?? '',
    preferredHeightMax: profile.partnerPreferences?.preferredHeightRange?.max ?? '',
    preferredMaritalStatus: profile.partnerPreferences?.preferredMaritalStatus || [],
    preferredReligion: profile.partnerPreferences?.preferredReligion || [],
    preferredCaste: profile.partnerPreferences?.preferredCaste || [],
    preferredCountry: profile.partnerPreferences?.preferredLocation?.country || 'India',
    preferredState: profile.partnerPreferences?.preferredLocation?.state || '',
    preferredCity: profile.partnerPreferences?.preferredLocation?.city || '',
    preferredEducation: profile.partnerPreferences?.preferredEducation || [],
    preferredOccupation: profile.partnerPreferences?.preferredOccupation || [],
    preferredIncomeRange: profile.partnerPreferences?.preferredIncomeRange || '',
    preferredDiet: profile.partnerPreferences?.preferredDiet || '',
    preferredDrinking: profile.partnerPreferences?.preferredDrinking || '',
    preferredSmoking: profile.partnerPreferences?.preferredSmoking || '',
    additionalExpectations: profile.partnerPreferences?.additionalExpectations || '',
    // Step 6
    diet6: profile.finalLifestyle?.diet || '',
    smoking6: profile.finalLifestyle?.smoking || 'No',
    drinking6: profile.finalLifestyle?.drinking || '',
    hobbies6: profile.finalLifestyle?.hobbies || '',
    languagesKnown: profile.finalLifestyle?.languagesKnown || '',
    fitnessHabits: profile.finalLifestyle?.fitnessHabits || '',
    foodPreference: profile.finalLifestyle?.foodPreference || 'Home food'
  })

  const totalSteps = 6

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
    setServerError('')
  }

  const casteOptions = formData.religion ? (CASTE_BY_RELIGION[formData.religion] || ['Other']) : []
  const subCasteOptions = formData.caste ? (SUBCASTE_BY_CASTE[formData.caste] || ['Other']) : []

  const handleComplete = async () => {
    if (!validateStep(currentStep)) return
    setSubmitting(true)
    setServerError('')
    try {
      const key = 'finalLifestyle'
      const payload = {
        diet: formData.diet6,
        smoking: formData.smoking6,
        drinking: formData.drinking6,
        hobbies: formData.hobbies6,
        languagesKnown: formData.languagesKnown,
        fitnessHabits: formData.fitnessHabits,
        foodPreference: formData.foodPreference
      }
      const res = await saveProfileStep(currentUser.uid, key, payload, 7)
      if (!res.success) {
        setServerError(res.error || 'Failed to save.')
        return
      }
      const fullProfile = { ...profile, [key]: payload }
      updateProfile({ profile: fullProfile })
      const completion = calculateProfileCompletion({ personal: userProfile?.personal, profile: fullProfile })
      await updateUserProfile(currentUser.uid, { profileCompletion: completion })
      updateProfile({ profileCompletion: completion })
      onComplete?.()
      onClose()
    } catch (err) {
      setServerError(err.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const validateStep = (step) => {
    const e = {}

    if (step === 1) {
      if (!formData.religion) e.religion = 'Religion is required'
      if (formData.religion && formData.religion !== 'Other' && !formData.caste) {
        e.caste = 'Caste is required'
      }
    }

    if (step === 2) {
      if (!formData.highestEducation) e.highestEducation = 'Education is required'
      if (!formData.degree) e.degree = 'Degree type is required'
      if (!formData.employmentType) e.employmentType = 'Employment type is required'
      if (!formData.jobTitle?.trim()) e.jobTitle = 'Job title is required'
      if (!formData.workCountry) e.workCountry = 'Work country is required'
      if (!formData.workCity?.trim()) e.workCity = 'Work city is required'
    }

    if (step === 4) {
      if (!formData.diet) e.diet = 'Please select your diet preference'
    }

    if (step === 5) {
      if (formData.preferredAgeMin && formData.preferredAgeMax) {
        const minA = Number(formData.preferredAgeMin)
        const maxA = Number(formData.preferredAgeMax)
        if (isNaN(minA) || isNaN(maxA) || minA > maxA) e.preferredAgeRange = 'Invalid age range'
      }
      if (formData.preferredHeightMin && formData.preferredHeightMax) {
        const minH = Number(formData.preferredHeightMin)
        const maxH = Number(formData.preferredHeightMax)
        if (isNaN(minH) || isNaN(maxH) || minH > maxH) e.preferredHeightRange = 'Invalid height range'
      }
    }

    if (step === 6) {
      if (!formData.diet6) e.diet6 = 'Please select your diet preference'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, profilePhotoUrl: 'Please select an image file.' }))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, profilePhotoUrl: 'Image must be less than 5MB.' }))
      return
    }
    setUploadProgress(0)
    try {
      const result = await uploadProfilePhoto(currentUser.uid, file, setUploadProgress)
      if (result.success) {
        setField('profilePhotoUrl', result.url)
      } else {
        setErrors((prev) => ({ ...prev, profilePhotoUrl: result.error }))
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, profilePhotoUrl: 'Upload failed.' }))
    }
  }

  const handleNext = async () => {
    if (!validateStep(currentStep)) return

    setSubmitting(true)
    setServerError('')
    try {
      const stepKeys = [
        'communityBirthDetails',
        'educationEmployment',
        'familyDetails',
        'lifestyleHabits',
        'partnerPreferences',
        'finalLifestyle'
      ]
      const stepPayloads = [
        {
          religion: formData.religion,
          caste: formData.caste,
          subCaste: formData.subCaste,
          gotra: formData.gotra,
          rashi: formData.rashi,
          nakshatra: formData.nakshatra,
          manglik: formData.manglik,
          timeOfBirth: formData.timeOfBirth,
          placeOfBirth: formData.placeOfBirth
        },
        {
          highestEducation: formData.highestEducation,
          degree: formData.degree,
          college: formData.college,
          employmentType: formData.employmentType,
          jobTitle: formData.jobTitle,
          companyName: formData.companyName,
          incomeRange: formData.incomeRange,
          workCountry: formData.workCountry,
          workCity: formData.workCity,
          workFromHome: formData.workFromHome
        },
        {
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          siblings: formData.siblings,
          familyType: formData.familyType
        },
        {
          profilePhotoUrl: formData.profilePhotoUrl || profile.lifestyleHabits?.profilePhotoUrl,
          diet: formData.diet,
          foodType: formData.foodType,
          drinkingHabit: formData.drinkingHabit,
          smokingHabit: formData.smokingHabit,
          fitnessHabit: formData.fitnessHabit,
          hobbies: formData.hobbies,
          interests: formData.interests
        },
        {
          preferredAgeRange: { min: Number(formData.preferredAgeMin), max: Number(formData.preferredAgeMax) },
          preferredHeightRange: { min: Number(formData.preferredHeightMin), max: Number(formData.preferredHeightMax) },
          preferredMaritalStatus: formData.preferredMaritalStatus,
          preferredReligion: formData.preferredReligion,
          preferredCaste: formData.preferredCaste,
          preferredLocation: { country: formData.preferredCountry, state: formData.preferredState, city: formData.preferredCity },
          preferredEducation: formData.preferredEducation,
          preferredOccupation: formData.preferredOccupation,
          preferredIncomeRange: formData.preferredIncomeRange,
          preferredDiet: formData.preferredDiet,
          preferredDrinking: formData.preferredDrinking,
          preferredSmoking: formData.preferredSmoking,
          additionalExpectations: formData.additionalExpectations
        },
        {
          diet: formData.diet6,
          smoking: formData.smoking6,
          drinking: formData.drinking6,
          hobbies: formData.hobbies6,
          languagesKnown: formData.languagesKnown,
          fitnessHabits: formData.fitnessHabits,
          foodPreference: formData.foodPreference
        }
      ]

      const key = stepKeys[currentStep - 1]
      const payload = stepPayloads[currentStep - 1]
      const res = await saveProfileStep(currentUser.uid, key, payload, currentStep + 1)
      if (!res.success) {
        setServerError(res.error || 'Failed to save.')
        return
      }
      updateProfile({ profile: { ...profile, [key]: payload } })
      setCurrentStep((s) => Math.min(s + 1, totalSteps))
    } catch (err) {
      setServerError(err.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const isLastStep = currentStep === totalSteps

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Your Profile"
      size="xl"
      closeOnOverlayClick={!required}
      showCloseButton={!required}
    >
      <div className="space-y-6">
        <ProfileStepLayout currentStep={currentStep} totalSteps={totalSteps}>
          {/* Step 1: Community & Birth */}
          {currentStep === 1 && (
            <>
              <h3 className="text-xl font-semibold text-primary-maroon mb-4">Community & Birth Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Religion" required value={formData.religion} onChange={(e) => setField('religion', e.target.value)} error={errors.religion} options={RELIGIONS} />
                <SelectField label="Caste" required={formData.religion !== 'Other'} value={formData.caste} onChange={(e) => { setField('caste', e.target.value); setField('subCaste', '') }} error={errors.caste} options={casteOptions} />
                <SelectField label="Sub Caste" value={formData.subCaste} onChange={(e) => setField('subCaste', e.target.value)} options={subCasteOptions} />
                <SelectField label="Gotra" value={formData.gotra} onChange={(e) => setField('gotra', e.target.value)} options={GOTRAS} />
                <SelectField label="Rashi (Zodiac)" value={formData.rashi} onChange={(e) => setField('rashi', e.target.value)} options={RASHIS} />
                <SelectField label="Nakshatra" value={formData.nakshatra} onChange={(e) => setField('nakshatra', e.target.value)} options={NAKSHATRAS} />
                <SelectField label="Manglik" value={formData.manglik} onChange={(e) => setField('manglik', e.target.value)} options={MANGLIK_OPTIONS} />
                <Input label="Time of Birth" value={formData.timeOfBirth} onChange={(e) => setField('timeOfBirth', e.target.value)} placeholder="e.g. 10:30 AM" />
                <Input label="Place of Birth" value={formData.placeOfBirth} onChange={(e) => setField('placeOfBirth', e.target.value)} placeholder="City, State" className="sm:col-span-2" />
              </div>
            </>
          )}

          {/* Step 2: Education & Employment */}
          {currentStep === 2 && (
            <>
              <h3 className="text-xl font-semibold text-primary-maroon mb-4">Education & Employment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Highest Education" required value={formData.highestEducation} onChange={(e) => setField('highestEducation', e.target.value)} error={errors.highestEducation} options={HIGHEST_EDUCATION} />
                <SelectField label="Degree" required value={formData.degree} onChange={(e) => setField('degree', e.target.value)} error={errors.degree} options={DEGREE_TYPES} />
                <Input label="College/University" value={formData.college} onChange={(e) => setField('college', e.target.value)} className="sm:col-span-2" />
                <SelectField label="Employment Type" required value={formData.employmentType} onChange={(e) => setField('employmentType', e.target.value)} error={errors.employmentType} options={EMPLOYMENT_TYPES} />
                <Input label="Job Title" required value={formData.jobTitle} onChange={(e) => setField('jobTitle', e.target.value)} error={errors.jobTitle} placeholder="e.g. Software Engineer" />
                <Input label="Company Name" value={formData.companyName} onChange={(e) => setField('companyName', e.target.value)} />
                <SelectField label="Income Range" value={formData.incomeRange} onChange={(e) => setField('incomeRange', e.target.value)} options={INCOME_RANGES} />
                <SelectField label="Work Country" required value={formData.workCountry} onChange={(e) => setField('workCountry', e.target.value)} error={errors.workCountry} options={WORK_COUNTRIES} />
                <Input label="Work City" required value={formData.workCity} onChange={(e) => setField('workCity', e.target.value)} error={errors.workCity} placeholder="City" />
                <label className="flex items-center gap-2 sm:col-span-2">
                  <input type="checkbox" checked={formData.workFromHome} onChange={(e) => setField('workFromHome', e.target.checked)} className="rounded" />
                  <span className="text-sm text-gray-700">Work from Home</span>
                </label>
              </div>
            </>
          )}

          {/* Step 3: Family */}
          {currentStep === 3 && (
            <>
              <h3 className="text-xl font-semibold text-primary-maroon mb-4">Family Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Father's Name" value={formData.fatherName} onChange={(e) => setField('fatherName', e.target.value)} />
                <Input label="Mother's Name" value={formData.motherName} onChange={(e) => setField('motherName', e.target.value)} />
                <Input label="Siblings" value={formData.siblings} onChange={(e) => setField('siblings', e.target.value)} placeholder="e.g. 1 Brother, 1 Sister" className="sm:col-span-2" />
                <SelectField label="Family Type" value={formData.familyType} onChange={(e) => setField('familyType', e.target.value)} options={['Nuclear', 'Joint', 'Extended']} />
              </div>
            </>
          )}

          {/* Step 4: Lifestyle & Habits */}
          {currentStep === 4 && (
            <>
              <h3 className="text-xl font-semibold text-primary-maroon mb-4">Lifestyle & Habits</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {formData.profilePhotoUrl || profile.lifestyleHabits?.profilePhotoUrl ? (
                        <img src={formData.profilePhotoUrl || profile.lifestyleHabits?.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-2xl">👤</span>
                      )}
                    </div>
                    <div>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
                      <label htmlFor="photo-upload" className="inline-block">
                        <span className="inline-flex items-center px-4 py-2 border-2 border-primary-gold text-primary-gold rounded-xl cursor-pointer hover:bg-primary-gold/10 text-sm font-medium">Upload Photo</span>
                      </label>
                      {uploadProgress > 0 && uploadProgress < 100 && <p className="text-sm text-gray-600 mt-1">{uploadProgress}%</p>}
                      <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG</p>
                    </div>
                  </div>
                  {errors.profilePhotoUrl && <p className="mt-1 text-sm text-red-600">{errors.profilePhotoUrl}</p>}
                </div>
                <SelectField label="Diet" required value={formData.diet} onChange={(e) => setField('diet', e.target.value)} error={errors.diet} options={DIET_OPTIONS} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField label="Food Type" value={formData.foodType} onChange={(e) => setField('foodType', e.target.value)} options={FOOD_TYPE_OPTIONS} />
                  <SelectField label="Drinking" value={formData.drinkingHabit} onChange={(e) => setField('drinkingHabit', e.target.value)} options={DRINKING_OPTIONS} />
                  <SelectField label="Smoking" value={formData.smokingHabit} onChange={(e) => setField('smokingHabit', e.target.value)} options={SMOKING_OPTIONS} />
                  <SelectField label="Fitness" value={formData.fitnessHabit} onChange={(e) => setField('fitnessHabit', e.target.value)} options={FITNESS_OPTIONS} />
                </div>
                <ChipSelect label="Hobbies" options={HOBBIES_OPTIONS} selected={formData.hobbies} onChange={(v) => setField('hobbies', v)} />
                <ChipSelect label="Interests" options={INTERESTS_OPTIONS} selected={formData.interests} onChange={(v) => setField('interests', v)} />
              </div>
            </>
          )}

          {/* Step 5: Partner Preferences */}
          {currentStep === 5 && (
            <>
              <h3 className="text-xl font-semibold text-primary-maroon mb-4">Partner Preferences</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <SelectField label="Preferred Age Min" value={formData.preferredAgeMin} onChange={(e) => setField('preferredAgeMin', e.target.value)} options={AGE_OPTIONS.map((a) => ({ value: a, label: a }))} />
                  <SelectField label="Preferred Age Max" value={formData.preferredAgeMax} onChange={(e) => setField('preferredAgeMax', e.target.value)} options={AGE_OPTIONS.map((a) => ({ value: a, label: a }))} />
                </div>
                {errors.preferredAgeRange && <p className="text-sm text-red-600">{errors.preferredAgeRange}</p>}
                <div className="grid grid-cols-2 gap-4">
                  <SelectField label="Preferred Height Min (cm)" value={formData.preferredHeightMin} onChange={(e) => setField('preferredHeightMin', e.target.value)} options={HEIGHT_OPTIONS.map((h) => ({ value: h, label: h }))} />
                  <SelectField label="Preferred Height Max (cm)" value={formData.preferredHeightMax} onChange={(e) => setField('preferredHeightMax', e.target.value)} options={HEIGHT_OPTIONS.map((h) => ({ value: h, label: h }))} />
                </div>
                {errors.preferredHeightRange && <p className="text-sm text-red-600">{errors.preferredHeightRange}</p>}
                <ChipSelect label="Preferred Marital Status" options={MARITAL_STATUS_OPTIONS} selected={formData.preferredMaritalStatus} onChange={(v) => setField('preferredMaritalStatus', v)} />
                <ChipSelect label="Preferred Religion" options={RELIGIONS} selected={formData.preferredReligion} onChange={(v) => setField('preferredReligion', v)} />
                <ChipSelect label="Preferred Education" options={HIGHEST_EDUCATION} selected={formData.preferredEducation} onChange={(v) => setField('preferredEducation', v)} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SelectField label="Country" value={formData.preferredCountry} onChange={(e) => setField('preferredCountry', e.target.value)} options={WORK_COUNTRIES} />
                  <SelectField label="State" value={formData.preferredState} onChange={(e) => setField('preferredState', e.target.value)} options={INDIAN_STATES} />
                  <Input label="City" value={formData.preferredCity} onChange={(e) => setField('preferredCity', e.target.value)} />
                </div>
                <SelectField label="Preferred Income Range" value={formData.preferredIncomeRange} onChange={(e) => setField('preferredIncomeRange', e.target.value)} options={INCOME_RANGES} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SelectField label="Preferred Diet" value={formData.preferredDiet} onChange={(e) => setField('preferredDiet', e.target.value)} options={DIET_OPTIONS} />
                  <SelectField label="Preferred Drinking" value={formData.preferredDrinking} onChange={(e) => setField('preferredDrinking', e.target.value)} options={DRINKING_OPTIONS} />
                  <SelectField label="Preferred Smoking" value={formData.preferredSmoking} onChange={(e) => setField('preferredSmoking', e.target.value)} options={SMOKING_OPTIONS} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Expectations</label>
                  <textarea value={formData.additionalExpectations} onChange={(e) => setField('additionalExpectations', e.target.value)} rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" placeholder="Any other preferences..." />
                </div>
              </div>
            </>
          )}

          {/* Step 6: Final Lifestyle */}
          {currentStep === 6 && (
            <>
              <h3 className="text-xl font-semibold text-primary-maroon mb-4">Final Lifestyle Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Diet" required value={formData.diet6} onChange={(e) => setField('diet6', e.target.value)} error={errors.diet6} options={DIET_OPTIONS} />
                <SelectField label="Smoking" value={formData.smoking6} onChange={(e) => setField('smoking6', e.target.value)} options={SMOKING_OPTIONS} />
                <SelectField label="Drinking" value={formData.drinking6} onChange={(e) => setField('drinking6', e.target.value)} options={DRINKING_OPTIONS} />
                <SelectField label="Food Preference" value={formData.foodPreference} onChange={(e) => setField('foodPreference', e.target.value)} options={FOOD_TYPE_OPTIONS} />
                <Input label="Hobbies" value={formData.hobbies6} onChange={(e) => setField('hobbies6', e.target.value)} placeholder="e.g. Reading, Travel" className="sm:col-span-2" />
                <Input label="Languages Known" value={formData.languagesKnown} onChange={(e) => setField('languagesKnown', e.target.value)} placeholder="e.g. Hindi, English" />
                <Input label="Fitness Habits" value={formData.fitnessHabits} onChange={(e) => setField('fitnessHabits', e.target.value)} placeholder="e.g. Gym, Yoga" />
              </div>
            </>
          )}
        </ProfileStepLayout>

        {serverError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{serverError}</div>
        )}

        <div className="flex justify-between pt-4 border-t">
          {currentStep === 1 && required ? (
            <div />
          ) : (
            <Button variant="ghost" onClick={currentStep === 1 ? onClose : handleBack} disabled={submitting}>
              {currentStep === 1 ? 'Skip for Now' : 'Back'}
            </Button>
          )}
          {isLastStep ? (
            <Button onClick={handleComplete} loading={submitting}>Complete Profile</Button>
          ) : (
            <Button onClick={handleNext} loading={submitting}>Next</Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ProfileCompletionModal
