import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { ADMIN_ROLE } from '../../utils/adminConstants'

/**
 * Verify that the current user has admin role.
 * Must be called before any admin operation.
 */
export const requireAdmin = async (userId) => {
  if (!userId) return { authorized: false, error: 'Not authenticated' }
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) return { authorized: false, error: 'User not found' }
    const data = userDoc.data()
    const role = data?.role
    if (role !== ADMIN_ROLE) {
      return { authorized: false, error: 'Admin access required' }
    }
    return { authorized: true, profile: { id: userDoc.id, ...data } }
  } catch (err) {
    console.error('[Admin] requireAdmin error:', err)
    return { authorized: false, error: err?.message || 'Authorization failed' }
  }
}
