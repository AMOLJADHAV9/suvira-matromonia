import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { requireAdmin } from './adminAuth'
import { logAdminAction } from './adminLogs'
import { ADMIN_ACTIONS } from '../../utils/adminConstants'
import { SPAM_THRESHOLD } from '../../utils/adminConstants'

/**
 * Get interest counts (total, pending, accepted, rejected).
 */
export const getInterestCounts = async (adminId) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    const [totalSnap, pendingSnap, acceptedSnap, rejectedSnap] = await Promise.all([
      getDocs(collection(db, 'interests')),
      getDocs(query(collection(db, 'interests'), where('status', '==', 'pending'))),
      getDocs(query(collection(db, 'interests'), where('status', '==', 'accepted'))),
      getDocs(query(collection(db, 'interests'), where('status', '==', 'rejected'))),
    ])
    return {
      success: true,
      data: {
        total: totalSnap.size,
        pending: pendingSnap.size,
        accepted: acceptedSnap.size,
        rejected: rejectedSnap.size,
      },
    }
  } catch (err) {
    console.error('[Admin] getInterestCounts error:', err)
    return { success: false, error: err?.message }
  }
}

/**
 * Fetch all interests with optional status filter.
 */
export const fetchInterests = async (adminId, { statusFilter = null, limitCount = 100 } = {}) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error, data: [] }

  try {
    const constraints = [orderBy('createdAt', 'desc'), limit(limitCount)]
    if (statusFilter) {
      constraints.unshift(where('status', '==', statusFilter))
    }
    const q = query(collection(db, 'interests'), ...constraints)
    const snapshot = await getDocs(q)
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    return { success: true, data }
  } catch (err) {
    console.error('[Admin] fetchInterests error:', err)
    return { success: false, error: err?.message || 'Failed to fetch interests', data: [] }
  }
}

/**
 * Delete a suspicious interest.
 */
export const deleteInterest = async (adminId, interestId) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    const ref = doc(db, 'interests', interestId)
    const snap = await getDoc(ref)
    const targetUserId = snap.exists() ? snap.data()?.senderId : null
    await deleteDoc(ref)
    await logAdminAction(adminId, ADMIN_ACTIONS.DELETE_INTEREST, targetUserId, { interestId })
    return { success: true }
  } catch (err) {
    console.error('[Admin] deleteInterest error:', err)
    return { success: false, error: err?.message || 'Failed to delete interest' }
  }
}

/**
 * Check if user has exceeded spam threshold (20 interests in 1 hour).
 * Call this from sendInterest or as a scheduled check.
 */
export const checkSpamAndFlag = async (senderId) => {
  try {
    const oneHourAgo = Timestamp.fromDate(
      new Date(Date.now() - SPAM_THRESHOLD.windowHours * 60 * 60 * 1000)
    )
    const q = query(
      collection(db, 'interests'),
      where('senderId', '==', senderId),
      where('createdAt', '>=', oneHourAgo)
    )
    const snapshot = await getDocs(q)
    const count = snapshot.size
    if (count >= SPAM_THRESHOLD.count) {
      await updateDoc(doc(db, 'users', senderId), { spamFlag: true })
      return { flagged: true, count }
    }
    return { flagged: false, count }
  } catch (err) {
    console.error('[Admin] checkSpamAndFlag error:', err)
    return { flagged: false }
  }
}

/**
 * Suspend sender (admin action from interest monitoring).
 */
export const suspendInterestSender = async (adminId, senderId) => {
  const { suspendUser } = await import('./adminUsers')
  return suspendUser(adminId, senderId)
}
