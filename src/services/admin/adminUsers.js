import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { requireAdmin } from './adminAuth'
import { logAdminAction } from './adminLogs'
import { ADMIN_ACTIONS } from '../../utils/adminConstants'

const USERS_COLLECTION = 'users'

/**
 * Build dynamic Firestore query with optional filters.
 * Uses limit(10) and startAfter for pagination.
 */
export const fetchUsers = async (
  adminId,
  { pageSize = 10, startAfterDoc = null, search = '', filters = {} } = {}
) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error, data: [], lastDoc: null }

  try {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    )
    const hasFilters = Object.keys(cleanFilters).length > 0

    const fetchLimit = hasFilters ? 200 : pageSize + 1
    const baseConstraints = [orderBy('createdAt', 'desc'), limit(fetchLimit)]
    let usedFilter = null
    let whereClause = null
    if (cleanFilters.profileStatus) {
      usedFilter = 'profileStatus'
      whereClause = where('profileStatus', '==', cleanFilters.profileStatus)
    } else if (cleanFilters.gender) {
      usedFilter = 'gender'
      whereClause = where('personal.gender', '==', String(cleanFilters.gender).toLowerCase())
    } else if (cleanFilters.isSuspended === true || cleanFilters.isSuspended === false) {
      usedFilter = 'isSuspended'
      whereClause = where('isSuspended', '==', cleanFilters.isSuspended)
    } else if (cleanFilters.isPremium === true) {
      usedFilter = 'isPremium'
      whereClause = where('role', '==', 'premium_user')
    } else if (cleanFilters.isPremium === false) {
      usedFilter = 'isPremium'
      whereClause = where('role', '==', 'free_user')
    } else if (cleanFilters.isVerified === true || cleanFilters.isVerified === false) {
      usedFilter = 'isVerified'
      whereClause = where('emailVerified', '==', cleanFilters.isVerified)
    }

    let q
    if (whereClause) {
      q = query(collection(db, USERS_COLLECTION), whereClause, ...baseConstraints)
    } else {
      q = query(collection(db, USERS_COLLECTION), ...baseConstraints)
    }
    if (startAfterDoc && !search?.trim()) {
      q = query(q, startAfter(startAfterDoc))
    }

    const snapshot = await getDocs(q)
    let users = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))

    if (usedFilter !== 'gender' && cleanFilters.gender) {
      users = users.filter((u) => (u.personal?.gender || '').toLowerCase() === String(cleanFilters.gender).toLowerCase())
    }
    if (usedFilter !== 'isSuspended') {
      if (cleanFilters.isSuspended === true) users = users.filter((u) => !!u.isSuspended)
      else if (cleanFilters.isSuspended === false) users = users.filter((u) => !u.isSuspended)
    }
    if (usedFilter !== 'isPremium') {
      if (cleanFilters.isPremium === true) users = users.filter((u) => u.role === 'premium_user' || !!u.isPremium)
      else if (cleanFilters.isPremium === false) users = users.filter((u) => u.role !== 'premium_user' && !u.isPremium)
    }
    if (usedFilter !== 'isVerified') {
      if (cleanFilters.isVerified === true) users = users.filter((u) => !!u.emailVerified)
      else if (cleanFilters.isVerified === false) users = users.filter((u) => !u.emailVerified)
    }
    if (usedFilter !== 'profileStatus' && cleanFilters.profileStatus) {
      users = users.filter((u) => (u.profileStatus || 'pending') === cleanFilters.profileStatus)
    }

    if (search?.trim()) {
      const s = search.trim().toLowerCase()
      users = users.filter(
        (u) =>
          (u.personal?.name || '').toLowerCase().includes(s) ||
          (u.email || '').toLowerCase().includes(s) ||
          (u.id || '').toLowerCase().includes(s)
      )
    }

    const hasMore = users.length > pageSize
    const data = hasMore ? users.slice(0, pageSize) : users
    const lastVisible = data.length > 0 ? snapshot.docs.find((d) => d.id === data[data.length - 1]?.id) : null
    const lastDoc = hasMore && lastVisible ? lastVisible : null

    return { success: true, data, lastDoc }
  } catch (err) {
    console.error('[Admin] fetchUsers error:', err)
    return { success: false, error: err?.message || 'Failed to fetch users', data: [], lastDoc: null }
  }
}

/**
 * Get user details for admin view.
 */
export const getUserDetailsForAdmin = async (adminId, targetUserId) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    const [userSnap, interestsSentSnap, interestsReceivedSnap, reportsSnap] = await Promise.all([
      getDoc(doc(db, USERS_COLLECTION, targetUserId)),
      getDocs(query(collection(db, 'interests'), where('senderId', '==', targetUserId))),
      getDocs(query(collection(db, 'interests'), where('receiverId', '==', targetUserId))),
      getDocs(query(collection(db, 'reports'), where('reportedUserId', '==', targetUserId))),
    ])

    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' }
    }

    const user = { id: userSnap.id, ...userSnap.data() }
    const interestCount = interestsSentSnap.size + interestsReceivedSnap.size
    const reportsCount = reportsSnap.size
    const lastActive = user.lastActive?.toDate?.() || user.lastActive

    return {
      success: true,
      data: { ...user, interestCount, reportsCount, lastActive },
    }
  } catch (err) {
    console.error('[Admin] getUserDetailsForAdmin error:', err)
    return { success: false, error: err?.message || 'Failed to fetch user details' }
  }
}

export const suspendUser = async (adminId, targetUserId) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }
  if (adminId === targetUserId) return { success: false, error: 'Cannot suspend your own account' }

  try {
    await updateDoc(doc(db, USERS_COLLECTION, targetUserId), { isSuspended: true, suspendedAt: new Date() })
    await logAdminAction(adminId, ADMIN_ACTIONS.SUSPEND_USER, targetUserId)
    return { success: true }
  } catch (err) {
    console.error('[Admin] suspendUser error:', err)
    return { success: false, error: err?.message || 'Failed to suspend user' }
  }
}

export const activateUser = async (adminId, targetUserId) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    await updateDoc(doc(db, USERS_COLLECTION, targetUserId), { isSuspended: false, suspendedAt: null })
    await logAdminAction(adminId, ADMIN_ACTIONS.ACTIVATE_USER, targetUserId)
    return { success: true }
  } catch (err) {
    console.error('[Admin] activateUser error:', err)
    return { success: false, error: err?.message || 'Failed to activate user' }
  }
}

export const verifyUser = async (adminId, targetUserId) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    await updateDoc(doc(db, USERS_COLLECTION, targetUserId), { isVerified: true, emailVerified: true })
    await logAdminAction(adminId, ADMIN_ACTIONS.VERIFY_USER, targetUserId)
    return { success: true }
  } catch (err) {
    console.error('[Admin] verifyUser error:', err)
    return { success: false, error: err?.message || 'Failed to verify user' }
  }
}

export const updateProfileStatus = async (adminId, targetUserId, status, rejectionReason = '') => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }
  if (!['approved', 'rejected', 'hidden'].includes(status)) {
    return { success: false, error: 'Invalid status' }
  }

  const actionMap = {
    approved: ADMIN_ACTIONS.APPROVE_PROFILE,
    rejected: ADMIN_ACTIONS.REJECT_PROFILE,
    hidden: ADMIN_ACTIONS.HIDE_PROFILE,
  }

  try {
    const ref = doc(db, USERS_COLLECTION, targetUserId)
    const updates = { profileStatus: status }
    if (status === 'approved') {
      updates.approvedAt = new Date()
      updates.approvedBy = adminId
    } else if (status === 'rejected') {
      updates.rejectedAt = new Date()
      if (rejectionReason) updates.rejectionReason = rejectionReason
    }
    await updateDoc(ref, updates)
    await logAdminAction(adminId, actionMap[status], targetUserId, { rejectionReason: status === 'rejected' ? rejectionReason : undefined })
    return { success: true }
  } catch (err) {
    console.error('[Admin] updateProfileStatus error:', err)
    return { success: false, error: err?.message || 'Failed to update profile status' }
  }
}

export const deleteUser = async (adminId, targetUserId) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }
  if (adminId === targetUserId) return { success: false, error: 'Cannot delete your own account' }

  try {
    const [sentInterests, receivedInterests, chatsSnap] = await Promise.all([
      getDocs(query(collection(db, 'interests'), where('senderId', '==', targetUserId))),
      getDocs(query(collection(db, 'interests'), where('receiverId', '==', targetUserId))),
      getDocs(query(collection(db, 'chats'), where('participants', 'array-contains', targetUserId))),
    ])

    const allInterestIds = [
      ...sentInterests.docs.map((d) => d.id),
      ...receivedInterests.docs.map((d) => d.id),
    ]
    for (const id of [...new Set(allInterestIds)]) {
      try {
        await deleteDoc(doc(db, 'interests', id))
      } catch (e) {}
    }

    for (const chatDoc of chatsSnap.docs) {
      try {
        const msgSnap = await getDocs(collection(db, 'chats', chatDoc.id, 'messages'))
        for (const msg of msgSnap.docs) {
          await deleteDoc(doc(db, 'chats', chatDoc.id, 'messages', msg.id))
        }
        await deleteDoc(doc(db, 'chats', chatDoc.id))
      } catch (e) {}
    }

    await deleteDoc(doc(db, USERS_COLLECTION, targetUserId))
    await logAdminAction(adminId, ADMIN_ACTIONS.DELETE_USER, targetUserId)
    return { success: true }
  } catch (err) {
    console.error('[Admin] deleteUser error:', err)
    return { success: false, error: err?.message || 'Failed to delete user' }
  }
}

export const fetchPremiumUsers = async (adminId) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error, data: [] }

  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('role', '==', 'premium_user'),
      limit(200)
    )
    const snapshot = await getDocs(q)
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    return { success: true, data }
  } catch (err) {
    console.error('[Admin] fetchPremiumUsers error:', err)
    return { success: false, error: err?.message || 'Failed to fetch', data: [] }
  }
}
