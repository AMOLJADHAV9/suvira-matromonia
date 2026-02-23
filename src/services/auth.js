import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { uploadProfilePhoto as uploadToCloudinary } from './cloudinary'
import { PROFILE_STATUS } from '../utils/constants'

// User Registration
export const registerUser = async (email, password, userData) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Send email verification. Ensure Email/Password is enabled and add your domain to Firebase Auth > Authorized domains.
    await sendEmailVerification(user)
    
    // Create user document in Firestore
    const userDoc = {
      uid: user.uid,
      email: user.email,
      personal: {
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        religion: userData.religion,
        caste: userData.caste,
        location: userData.location,
        ...userData.personal
      },
      profileStatus: PROFILE_STATUS.PENDING,
      role: 'free_user',
      isSuspended: false,
      isPremium: false,
      createdAt: new Date(),
      lastActive: new Date(),
      profileCompletion: 0
    }
    
    await setDoc(doc(db, 'users', user.uid), userDoc)
    
    return { success: true, user, message: 'Registration successful. Please check your email for verification.' }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: error.message }
  }
}

// Admin Registration
export const registerAdminUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await sendEmailVerification(user)

    const userDoc = {
      uid: user.uid,
      email: user.email,
      personal: {
        name: name || 'Admin',
      },
      profileStatus: PROFILE_STATUS.APPROVED,
      role: 'admin',
      isSuspended: false,
      isPremium: true,
      isVerified: true,
      createdAt: new Date(),
      lastActive: new Date(),
      profileCompletion: 100,
    }

    await setDoc(doc(db, 'users', user.uid), userDoc)

    const adminDoc = {
      uid: user.uid,
      email: user.email,
      name: name || 'Admin',
      createdAt: new Date(),
    }
    await setDoc(doc(db, 'admins', user.uid), adminDoc)

    return {
      success: true,
      user,
      message: 'Admin account created. Please verify your email.',
    }
  } catch (error) {
    console.error('Admin registration error:', error)
    const code = error?.code || ''
    let message = error.message
    if (code === 'auth/email-already-in-use') {
      message = 'This email is already registered. Please log in or use a different email.'
    } else if (code === 'auth/weak-password') {
      message = 'Password is too weak. Use at least 6 characters.'
    } else if (code === 'auth/invalid-email') {
      message = 'Invalid email address.'
    }
    return { success: false, error: message }
  }
}

// User Login (allows login even if email not verified - user will be redirected to verify page)
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        if (data.isSuspended) {
          await signOut(auth)
          return { success: false, error: 'Your account has been suspended. Please contact support.' }
        }
      }

      await updateDoc(doc(db, 'users', user.uid), {
        lastActive: new Date()
      })
    } catch (firestoreError) {
      // Permission errors: rules may not be deployed or misconfigured - still allow login
      const code = firestoreError?.code || ''
      const isPermissionError = code === 'permission-denied' || (firestoreError?.message || '').includes('permission')
      if (isPermissionError) {
        console.warn('Firestore access failed during login (rules may need deployment):', firestoreError)
        // User is authenticated; proceed with login
      } else {
        throw firestoreError
      }
    }

    return {
      success: true,
      user,
      requiresEmailVerification: !user.emailVerified
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: error.message }
  }
}

// Logout User
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: error.message }
  }
}

// Send Password Reset Email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true, message: 'Password reset email sent successfully.' }
  } catch (error) {
    console.error('Password reset error:', error)
    return { success: false, error: error.message }
  }
}

// Calculate Profile Completion Percentage (supports both old and new profile structure)
export const calculateProfileCompletion = (profileData) => {
  const personal = profileData.personal || {}
  const profile = profileData.profile || {}
  const community = profile.communityBirthDetails || {}
  const education = profile.educationEmployment || {}
  const family = profile.familyDetails || {}
  const lifestyle = profile.lifestyleHabits || profile.finalLifestyle || {}
  const legacyEducation = profileData.education || {}
  const legacyFamily = profileData.family || {}
  const legacyLifestyle = profileData.lifestyle || {}

  const checks = [
    personal.name,
    personal.age,
    personal.gender,
    personal.religion || community.religion,
    personal.caste || community.caste,
    personal.location,
    education.highestEducation || legacyEducation.degree,
    education.jobTitle || legacyEducation.occupation,
    education.workCountry,
    education.workCity,
    family.fatherName || legacyFamily.fatherName,
    family.motherName || legacyFamily.motherName,
    lifestyle.diet || legacyLifestyle.diet
  ]

  const filled = checks.filter(v => v && (typeof v === 'string' ? v.trim() !== '' : true))
  return Math.round((filled.length / checks.length) * 100)
}

// Update User Profile (deep merge for personal and profile nested objects)
export const updateUserProfile = async (userId, profileData) => {
  try {
    const currentProfile = await getUserProfile(userId)
    const existingData = currentProfile.success ? currentProfile.data : {}

    // Deep merge personal if passed
    const mergedPersonal = profileData.personal
      ? { ...(existingData.personal || {}), ...profileData.personal }
      : existingData.personal

    // Deep merge profile if passed
    const mergedProfile = profileData.profile
      ? { ...(existingData.profile || {}), ...profileData.profile }
      : existingData.profile

    const mergedData = { ...existingData, ...profileData }
    if (mergedPersonal !== undefined) mergedData.personal = mergedPersonal
    if (mergedProfile !== undefined) mergedData.profile = mergedProfile

    const updatedData = {
      ...mergedData,
      profileCompletion: profileData.profileCompletion ?? calculateProfileCompletion(mergedData)
    }

    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, updatedData)
    return { success: true, message: 'Profile updated successfully.', data: updatedData }
  } catch (error) {
    console.error('Profile update error:', error)
    return { success: false, error: error.message }
  }
}

// Firestore rejects undefined; recursively replace with null
const sanitizeForFirestore = (value) => {
  if (value === undefined) return null
  if (value === null) return null
  if (Array.isArray(value)) return value.map(sanitizeForFirestore)
  if (typeof value === 'object' && value.constructor === Object) {
    const result = {}
    for (const [k, v] of Object.entries(value)) {
      result[k] = sanitizeForFirestore(v)
    }
    return result
  }
  return value
}

// Save profile step (step-specific storage under profile key)
export const saveProfileStep = async (userId, stepKey, stepData, nextStep) => {
  try {
    const currentProfile = await getUserProfile(userId)
    const existingData = currentProfile.success ? currentProfile.data : {}
    const profile = existingData.profile || {}
    const sanitizedStepData = sanitizeForFirestore(stepData)

    const updatedProfile = {
      ...profile,
      [stepKey]: sanitizedStepData,
      lastUpdatedStep: nextStep,
      updatedAt: new Date()
    }

    const updatedData = sanitizeForFirestore({
      ...existingData,
      profile: updatedProfile,
      profileUpdatedAt: new Date()
    })

    // Sync religion/caste to personal so search and profile views stay in sync
    if (stepKey === 'communityBirthDetails' && (stepData.religion || stepData.caste)) {
      updatedData.personal = {
        ...(existingData.personal || {}),
        ...(stepData.religion != null && stepData.religion !== '' && { religion: stepData.religion }),
        ...(stepData.caste != null && stepData.caste !== '' && { caste: stepData.caste })
      }
    }

    await updateDoc(doc(db, 'users', userId), updatedData)
    return { success: true, message: 'Profile step saved.', data: updatedData }
  } catch (error) {
    console.error('Save profile step error:', error)
    return { success: false, error: error.message }
  }
}

// Upload profile photo to Cloudinary (URL stored in Firebase/Firestore)
export const uploadProfilePhoto = async (userId, file, onProgress) => {
  return uploadToCloudinary(file, userId, onProgress)
}

// Get User Profile
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() }
    } else {
      return { success: false, error: 'User profile not found.' }
    }
  } catch (error) {
    console.error('Get profile error:', error)
    return { success: false, error: error.message }
  }
}

// Listen to Auth State Changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

// Check if user is admin
export const isAdmin = async (userId) => {
  try {
    const profile = await getUserProfile(userId)
    return profile.success && profile.data.role === 'admin'
  } catch (error) {
    return false
  }
}

// Check if user is premium
export const isPremiumUser = async (userId) => {
  try {
    const profile = await getUserProfile(userId)
    return profile.success && profile.data.role === 'premium_user'
  } catch (error) {
    return false
  }
}