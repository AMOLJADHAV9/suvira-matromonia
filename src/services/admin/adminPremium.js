import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { requireAdmin } from './adminAuth'
import { logAdminAction } from './adminLogs'
import { ADMIN_ACTIONS } from '../../utils/adminConstants'

/**
 * Activate premium manually for a user.
 */
export const activatePremium = async (adminId, userId, planType = 'manual', months = 1) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    const startDate = new Date()
    const expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() + months)

    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      role: 'premium_user',
      isPremium: true,
      subscription: {
        planType,
        startDate,
        expiryDate: expiryDate,
        isActive: true,
      },
    })
    await logAdminAction(adminId, ADMIN_ACTIONS.ACTIVATE_PREMIUM, userId, { planType, months })
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
