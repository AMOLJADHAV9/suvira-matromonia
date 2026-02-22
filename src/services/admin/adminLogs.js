import { collection, addDoc, query, where, orderBy, getDocs, limit } from 'firebase/firestore'
import { serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const COLLECTION = 'adminLogs'

/**
 * Log an admin action for audit trail.
 */
export const logAdminAction = async (adminId, action, targetUserId, metadata = {}) => {
  if (!adminId || !action) return
  try {
    await addDoc(collection(db, COLLECTION), {
      adminId,
      actionType: action,
      action,
      targetUserId: targetUserId || null,
      metadata,
      timestamp: serverTimestamp(),
    })
  } catch (err) {
    console.error('[Admin] logAdminAction error:', err)
  }
}

/**
 * Get recent admin logs (for admin panel display).
 */
export const getRecentAdminLogs = async (limitCount = 50) => {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('[Admin] getRecentAdminLogs error:', err)
    return []
  }
}
