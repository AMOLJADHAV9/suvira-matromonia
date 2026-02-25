import { doc, getDoc, updateDoc, runTransaction } from 'firebase/firestore'
import { db } from './firebase'
import { getPackageById } from '../utils/premiumPackages'

/**
 * Get start of next week (Monday 00:00:00) from a given date
 */
const getNextWeekStart = (date = new Date()) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? 1 : 8 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Check if user can perform a contact action (profile view, interest, mobile view).
 * Returns { allowed, reason?, weeklyUsed, weeklyLimit, totalUsed, totalLimit, isExpired? }
 */
export const checkCanContact = async (userId, targetProfileId) => {
  if (!userId || !targetProfileId) {
    return { allowed: false, reason: 'Missing user or profile ID' }
  }

  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
      return { allowed: false, reason: 'User not found' }
    }

    const user = userSnap.data()
    const sub = user.subscription || {}
    const packageId = sub.packageId || sub.planType

    if (!packageId) {
      return { allowed: false, reason: 'No active package. Purchase a plan to view profiles, send interest, and see contact details.' }
    }

    const expiryDate = sub.expiryDate?.toDate?.() || sub.expiryDate
    const now = new Date()
    if (expiryDate && new Date(expiryDate) <= now) {
      return {
        allowed: false,
        reason: 'Your package has expired. Purchase a new plan to continue.',
        isExpired: true,
      }
    }

    if (sub.isActive === false) {
      return { allowed: false, reason: 'Package is inactive. Please purchase a new plan.' }
    }

    const pkg = getPackageById(packageId)
    if (!pkg) {
      return { allowed: false, reason: 'Invalid package. Please contact support.' }
    }

    const usage = user.contactUsage || {}
    let weeklyCount = usage.weeklyCount ?? 0
    let totalCount = usage.totalCount ?? 0
    const contactedIds = usage.contactedProfileIds || []
    const weeklyResetAt = usage.weeklyResetAt?.toDate?.() || usage.weeklyResetAt

    if (contactedIds.includes(targetProfileId)) {
      return {
        allowed: true,
        reason: null,
        weeklyUsed: weeklyCount,
        weeklyLimit: pkg.contactsPerWeek,
        totalUsed: totalCount,
        totalLimit: pkg.totalContacts,
        alreadyContacted: true,
      }
    }

    const resetAt = weeklyResetAt ? new Date(weeklyResetAt) : getNextWeekStart()
    if (now >= resetAt) {
      weeklyCount = 0
    }

    if (weeklyCount >= pkg.contactsPerWeek) {
      return {
        allowed: false,
        reason: `Weekly limit reached (${pkg.contactsPerWeek} contacts/week). Try again next week.`,
        weeklyUsed: weeklyCount,
        weeklyLimit: pkg.contactsPerWeek,
        totalUsed: totalCount,
        totalLimit: pkg.totalContacts,
      }
    }

    if (totalCount >= pkg.totalContacts) {
      return {
        allowed: false,
        reason: `Total profile contact limit reached (${pkg.totalContacts}). Upgrade to a higher package.`,
        weeklyUsed: weeklyCount,
        weeklyLimit: pkg.contactsPerWeek,
        totalUsed: totalCount,
        totalLimit: pkg.totalContacts,
      }
    }

    return {
      allowed: true,
      reason: null,
      weeklyUsed: weeklyCount,
      weeklyLimit: pkg.contactsPerWeek,
      totalUsed: totalCount,
      totalLimit: pkg.totalContacts,
      alreadyContacted: false,
    }
  } catch (err) {
    console.error('[contactUsage] checkCanContact error:', err)
    return { allowed: false, reason: err?.message || 'Failed to check contact limit' }
  }
}

/**
 * Record a contact (profile view, interest sent, or mobile view).
 * Resets weekly count if needed. Deduplicates by targetProfileId.
 */
export const recordContact = async (userId, targetProfileId) => {
  if (!userId || !targetProfileId) {
    return { success: false, error: 'Missing user or profile ID' }
  }

  try {
    const userRef = doc(db, 'users', userId)
    const result = await runTransaction(db, async (tx) => {
      const userSnap = await tx.get(userRef)
      if (!userSnap.exists()) return { success: false, error: 'User not found' }

      const user = userSnap.data()
      const sub = user.subscription || {}
      const packageId = sub.packageId || sub.planType
      if (!packageId) return { success: false, error: 'No active package' }

      const expiryDate = sub.expiryDate?.toDate?.() || sub.expiryDate
      if (expiryDate && new Date(expiryDate) <= new Date()) {
        return { success: false, error: 'Package expired' }
      }

      const pkg = getPackageById(packageId)
      if (!pkg) return { success: false, error: 'Invalid package' }

      const usage = user.contactUsage || {}
      let weeklyCount = usage.weeklyCount ?? 0
      let totalCount = usage.totalCount ?? 0
      const contactedIds = [...(usage.contactedProfileIds || [])]
      let weeklyResetAt = usage.weeklyResetAt?.toDate?.() || usage.weeklyResetAt || getNextWeekStart()

      if (contactedIds.includes(targetProfileId)) {
        return { success: true, alreadyContacted: true }
      }

      const now = new Date()
      const resetAt = new Date(weeklyResetAt)
      if (now >= resetAt) {
        weeklyCount = 0
        weeklyResetAt = getNextWeekStart(now)
      }

      if (weeklyCount >= pkg.contactsPerWeek || totalCount >= pkg.totalContacts) {
        return { success: false, error: 'Contact limit reached' }
      }

      contactedIds.push(targetProfileId)
      const newUsage = {
        weeklyCount: weeklyCount + 1,
        totalCount: totalCount + 1,
        weeklyResetAt,
        contactedProfileIds: contactedIds,
      }

      tx.update(userRef, { contactUsage: newUsage })
      return { success: true }
    })

    return result
  } catch (err) {
    console.error('[contactUsage] recordContact error:', err)
    return { success: false, error: err?.message || 'Failed to record contact' }
  }
}
