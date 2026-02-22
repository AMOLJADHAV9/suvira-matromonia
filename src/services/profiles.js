import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'
import { PROFILE_STATUS } from '../utils/constants'

const DEBUG = import.meta.env.DEV

const log = (...args) => {
  if (DEBUG) {
    console.log('[Profiles]', ...args)
  }
}

/**
 * Normalize gender string for consistent Firestore queries.
 * Firestore is case-sensitive - normalize to lowercase.
 */
const normalizeGender = (gender) => {
  if (!gender || typeof gender !== 'string') return null
  const normalized = gender.trim().toLowerCase()
  if (normalized === 'male' || normalized === 'female') return normalized
  return null
}

/**
 * STRICT BUSINESS RULE: Get opposite gender only.
 * Male → Female, Female → Male. No same-gender, no both.
 * @param {string} userGender - 'male' | 'female' (case-insensitive)
 * @returns {string|null} - 'male' | 'female' | null (null = invalid, do not query)
 */
export const getOppositeGender = (userGender) => {
  const normalized = normalizeGender(userGender)
  if (!normalized) {
    log('getOppositeGender: invalid gender', userGender)
    return null
  }
  const opposite = normalized === 'male' ? 'female' : 'male'
  log('getOppositeGender:', normalized, '→', opposite)
  return opposite
}

/**
 * Validate that we never fetch same gender.
 * Returns true if userGender and targetGender are opposite.
 */
const validateOppositeGender = (userGender, targetGender) => {
  const user = normalizeGender(userGender)
  const target = normalizeGender(targetGender)
  if (!user || !target) return false
  return (user === 'male' && target === 'female') || (user === 'female' && target === 'male')
}

/**
 * Get profile photo URL from various profile structures
 */
export const getProfilePhotoUrl = (profile) => {
  return (
    profile?.profile?.lifestyleHabits?.profilePhotoUrl ||
    profile?.profilePhotoUrl ||
    profile?.photos?.[0] ||
    null
  )
}

/**
 * Get education/degree from profile (supports old and new structure)
 */
export const getProfileEducation = (profile) => {
  return (
    profile?.profile?.educationEmployment?.degree ||
    profile?.profile?.educationEmployment?.highestEducation ||
    profile?.education?.degree ||
    null
  )
}

/**
 * Get occupation/job from profile (supports old and new structure)
 */
export const getProfileOccupation = (profile) => {
  return (
    profile?.profile?.educationEmployment?.jobTitle ||
    profile?.education?.occupation ||
    null
  )
}

/**
 * Get all profile photo URLs for gallery (main + additional)
 */
export const getProfilePhotos = (profile) => {
  const main = getProfilePhotoUrl(profile)
  const additional = profile?.profile?.lifestyleHabits?.additionalPhotos ||
    profile?.photos ||
    profile?.additionalPhotos ||
    []
  const urls = main ? [main, ...(Array.isArray(additional) ? additional : [])] : (Array.isArray(additional) ? additional : [])
  return urls.filter(Boolean)
}

/**
 * Get height from profile (cm) - supports personal.height or profile
 */
export const getProfileHeight = (profile) => {
  return (
    profile?.personal?.height ||
    profile?.profile?.personalDetails?.height ||
    profile?.height ||
    null
  )
}

/**
 * Get mother tongue / languages
 */
export const getProfileMotherTongue = (profile) => {
  return (
    profile?.personal?.motherTongue ||
    profile?.profile?.finalLifestyle?.languagesKnown ||
    profile?.profile?.communityBirthDetails?.motherTongue ||
    null
  )
}

/**
 * Check if profile should show Verified badge
 */
export const isProfileVerified = (profile) => {
  return (
    profile?.profileStatus === PROFILE_STATUS.APPROVED ||
    profile?.emailVerified === true
  )
}

/**
 * STRICT GENDER-BASED PROFILE FETCHING
 *
 * Business Rules:
 * - Male user → fetch ONLY female profiles
 * - Female user → fetch ONLY male profiles
 * - NEVER fetch both genders
 * - NEVER fetch same gender
 * - Exclude logged-in user's own profile
 * - Filtering happens at Firestore query level (where clause)
 *
 * @param {string} currentUserId - Logged-in user's UID (excluded from results)
 * @param {string} userGender - From personal.gender (male|female, case-insensitive)
 * @param {number} maxLimit - Max profiles to return (default 50)
 * @returns {Promise<{success: boolean, data: Array, error?: string}>}
 */
export const getProfilesByOppositeGender = async (
  currentUserId,
  userGender,
  maxLimit = 50
) => {
  log('getProfilesByOppositeGender called', { currentUserId, userGender: userGender, maxLimit })

  if (!currentUserId || !userGender) {
    log('Validation failed: missing userId or gender')
    return {
      success: false,
      data: [],
      error: 'Missing user ID or gender. Cannot fetch profiles.'
    }
  }

  const oppositeGender = getOppositeGender(userGender)
  if (!oppositeGender) {
    log('Validation failed: invalid gender value', userGender)
    return {
      success: false,
      data: [],
      error: 'Invalid gender. Must be "Male" or "Female".'
    }
  }

  // STRICT: Ensure we never query same gender
  if (!validateOppositeGender(userGender, oppositeGender)) {
    log('Validation failed: same-gender block', { userGender, oppositeGender })
    return {
      success: false,
      data: [],
      error: 'Invalid filter: cannot fetch same gender profiles.'
    }
  }

  try {
    // STRICT BUSINESS RULE: Only approved + not suspended profiles appear in public (Search, Dashboard, Landing)
    const q = query(
      collection(db, 'users'),
      where('personal.gender', '==', oppositeGender),
      where('profileStatus', '==', PROFILE_STATUS.APPROVED),
      where('isSuspended', '==', false),
      limit(maxLimit + 50)
    )

    log('Executing Firestore query: gender==', oppositeGender, 'profileStatus==approved, isSuspended==false')
    const snapshot = await getDocs(q)
    const results = []
    let excludedOwnCount = 0

    snapshot.forEach((docSnap) => {
      if (docSnap.id === currentUserId) {
        excludedOwnCount++
        return
      }

      const data = docSnap.data()
      const docGender = data?.personal?.gender
      if (docGender && normalizeGender(docGender) === normalizeGender(userGender)) {
        log('Skipping same-gender profile (data integrity)', docSnap.id)
        return
      }

      results.push({ id: docSnap.id, ...data })
    })

    results.sort((a, b) => {
      const aTime = a.lastActive?.seconds || 0
      const bTime = b.lastActive?.seconds || 0
      return bTime - aTime
    })

    const data = results.slice(0, maxLimit)
    log('Query success:', data.length, 'profiles', excludedOwnCount > 0 ? `(excluded ${excludedOwnCount} own)` : '')

    return { success: true, data }
  } catch (error) {
    console.error('[Profiles] Error fetching profiles by gender:', error)
    return {
      success: false,
      data: [],
      error: error?.message || 'Failed to load profiles'
    }
  }
}

/**
 * Fetch a single profile by ID.
 * STRICT: Logged-in user can only view opposite gender profiles.
 * Returns 403 if viewing same gender or own profile.
 *
 * @param {string} targetUserId - Profile to fetch
 * @param {string} currentUserId - Logged-in user
 * @param {string} currentUserGender - personal.gender (male|female)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getProfileById = async (targetUserId, currentUserId, currentUserGender) => {
  log('getProfileById called', { targetUserId, currentUserId })

  if (!targetUserId || !currentUserId) {
    return { success: false, error: 'Missing user ID' }
  }

  if (targetUserId === currentUserId) {
    log('Blocked: viewing own profile via profile page')
    return { success: false, error: 'You cannot view your own profile here.' }
  }

  const oppositeGender = getOppositeGender(currentUserGender)
  if (!oppositeGender) {
    return { success: false, error: 'Profile gender not set. Complete your profile.' }
  }

  try {
    const docRef = doc(db, 'users', targetUserId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      log('Profile not found:', targetUserId)
      return { success: false, error: 'Profile not found' }
    }

    const data = docSnap.data()
    const targetGender = normalizeGender(data?.personal?.gender)

    if (!validateOppositeGender(currentUserGender, targetGender)) {
      log('Blocked: same-gender profile view attempt', { currentUserGender, targetGender })
      return { success: false, error: 'Access denied' }
    }

    const profile = { id: docSnap.id, ...data }
    log('Profile fetched successfully:', targetUserId)
    return { success: true, data: profile }
  } catch (error) {
    console.error('[Profiles] Error fetching profile:', error)
    return { success: false, error: error?.message || 'Failed to load profile' }
  }
}

/**
 * Fetch logged-in user's document from Firestore and return personal.gender.
 * Use this when userProfile might not be in context yet.
 *
 * @param {string} userId - Firebase Auth UID
 * @returns {Promise<{success: boolean, gender?: string, error?: string}>}
 */
export const fetchUserGenderFromFirestore = async (userId) => {
  if (!userId) {
    return { success: false, error: 'Missing user ID' }
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) {
      log('User document not found:', userId)
      return { success: false, error: 'User profile not found' }
    }

    const data = userDoc.data()
    const gender = data?.personal?.gender
    const normalized = normalizeGender(gender)

    if (!normalized) {
      log('User has no valid gender in personal.gender:', gender)
      return { success: false, error: 'Profile gender not set' }
    }

    return { success: true, gender: normalized }
  } catch (error) {
    console.error('[Profiles] Error fetching user gender:', error)
    return {
      success: false,
      error: error?.message || 'Failed to fetch user profile'
    }
  }
}
