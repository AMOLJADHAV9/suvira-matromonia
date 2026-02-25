import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { requireAdmin } from './adminAuth'
import { logAdminAction } from './adminLogs'
import { ADMIN_ACTIONS } from '../../utils/adminConstants'
import { getPackageById } from '../../utils/premiumPackages'
import { recordPlanPurchase } from '../packages'

const getNextWeekStart = (date = new Date()) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? 1 : 8 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Activate premium for a user with a package (remarriage, platinum, gold, nri).
 */
export const activatePremium = async (adminId, userId, packageId = 'platinum', customMonths = null) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }

  const pkg = getPackageById(packageId)
  const months = customMonths ?? (pkg?.validityMonths ?? 1)

  try {
    const startDate = new Date()
    const expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() + months)

    const contactUsage = {
      weeklyCount: 0,
      weeklyResetAt: getNextWeekStart(),
      totalCount: 0,
      contactedProfileIds: [],
    }

    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      role: 'premium_user',
      isPremium: true,
      subscription: {
        packageId: packageId || 'platinum',
        planType: packageId,
        startDate,
        expiryDate,
        isActive: true,
      },
      contactUsage,
    })

    await recordPlanPurchase({
      userId,
      packageId: packageId || 'platinum',
      startDate,
      expiryDate,
      price: pkg?.price ?? 0,
      activatedBy: adminId,
    })

    await logAdminAction(adminId, ADMIN_ACTIONS.ACTIVATE_PREMIUM, userId, { packageId, months })
    return { success: true }
  } catch (err) {
    console.error('[Admin] activatePremium error:', err)
    return { success: false, error: err?.message || 'Failed to activate premium' }
  }
}

/**
 * Extend premium expiry date.
 */
export const extendPremium = async (adminId, userId, additionalMonths = 1) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    const userRef = doc(db, 'users', userId)
    const snap = await getDoc(userRef)
    const sub = snap.data()?.subscription || {}
    const currentExpiry = sub.expiryDate?.toDate?.() || new Date()
    const newExpiry = new Date(currentExpiry)
    newExpiry.setMonth(newExpiry.getMonth() + additionalMonths)

    await updateDoc(userRef, {
      subscription: {
        ...sub,
        expiryDate: newExpiry,
        isActive: true,
      },
    })
    await logAdminAction(adminId, ADMIN_ACTIONS.EXTEND_PREMIUM, userId, { additionalMonths })
    return { success: true }
  } catch (err) {
    console.error('[Admin] extendPremium error:', err)
    return { success: false, error: err?.message || 'Failed to extend premium' }
  }
}

/**
 * Mark subscription as expired (sets isActive: false, reverts to free_user).
 */
export const expireSubscription = async (adminId, userId) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    const userRef = doc(db, 'users', userId)
    const snap = await getDoc(userRef)
    const sub = snap.data()?.subscription || {}
    await updateDoc(userRef, {
      role: 'free_user',
      isPremium: false,
      subscription: { ...sub, isActive: false },
    })
    await logAdminAction(adminId, ADMIN_ACTIONS.CANCEL_PREMIUM, userId, { reason: 'expired' })
    return { success: true }
  } catch (err) {
    console.error('[Admin] expireSubscription error:', err)
    return { success: false, error: err?.message || 'Failed to expire subscription' }
  }
}

/**
 * Cancel premium subscription.
 */
export const cancelPremium = async (adminId, userId) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    const userRef = doc(db, 'users', userId)
    const snap = await getDoc(userRef)
    const sub = snap.data()?.subscription || {}
    await updateDoc(userRef, {
      role: 'free_user',
      isPremium: false,
      subscription: { ...sub, isActive: false },
    })
    await logAdminAction(adminId, ADMIN_ACTIONS.CANCEL_PREMIUM, userId)
    return { success: true }
  } catch (err) {
    console.error('[Admin] cancelPremium error:', err)
    return { success: false, error: err?.message || 'Failed to cancel premium' }
  }
}
