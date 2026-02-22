import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { requireAdmin } from './adminAuth'
import { logAdminAction } from './adminLogs'
import { suspendUser, deleteUser } from './adminUsers'
import { ADMIN_ACTIONS } from '../../utils/adminConstants'
import { REPORT_SEVERITY } from '../../utils/adminConstants'

const REPORTS_COLLECTION = 'reports'

/**
 * Create a new report (called by users).
 */
export const createReport = async (reportedUserId, reportedBy, reason, message = '', severity = REPORT_SEVERITY.MEDIUM) => {
  if (!reportedUserId || !reportedBy || !reason) {
    return { success: false, error: 'Missing required fields' }
  }
  try {
    await addDoc(collection(db, REPORTS_COLLECTION), {
      reportedUserId,
      reportedBy,
      reason,
      description: message,
      severity: severity || REPORT_SEVERITY.MEDIUM,
      status: 'open',
      createdAt: serverTimestamp(),
    })
    return { success: true }
  } catch (err) {
    console.error('[Reports] createReport error:', err)
    return { success: false, error: err?.message || 'Failed to create report' }
  }
}

/**
 * Fetch all reports with optional status filter.
 */
export const fetchReports = async (adminId, { statusFilter = null, limitCount = 100 } = {}) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error, data: [] }

  try {
    const constraints = [orderBy('createdAt', 'desc'), limit(limitCount)]
    if (statusFilter) {
      constraints.unshift(where('status', '==', statusFilter))
    }
    const q = query(collection(db, REPORTS_COLLECTION), ...constraints)
    const snapshot = await getDocs(q)
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    return { success: true, data }
  } catch (err) {
    console.error('[Admin] fetchReports error:', err)
    return { success: false, error: err?.message || 'Failed to fetch reports', data: [] }
  }
}

/**
 * Get high-severity report count for a user (auto-flag for review if >= 3).
 */
export const getHighSeverityReportCount = async (reportedUserId) => {
  try {
    const q = query(
      collection(db, REPORTS_COLLECTION),
      where('reportedUserId', '==', reportedUserId),
      where('severity', '==', REPORT_SEVERITY.HIGH)
    )
    const snapshot = await getDocs(q)
    return snapshot.size
  } catch (err) {
    return 0
  }
}

/**
 * Suspend reported user (from report action).
 */
export const suspendReportedUser = async (adminId, targetUserId) => {
  const res = await suspendUser(adminId, targetUserId)
  if (res.success) {
    await logAdminAction(adminId, ADMIN_ACTIONS.SUSPEND_FROM_REPORT, targetUserId)
  }
  return res
}

/**
 * Warn user - increment warningCount.
 */
export const warnUser = async (adminId, targetUserId) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    const ref = doc(db, 'users', targetUserId)
    const snap = await getDoc(ref)
    const current = snap.exists() ? snap.data()?.warningCount || 0 : 0
    await updateDoc(ref, { warningCount: current + 1 })
    await logAdminAction(adminId, ADMIN_ACTIONS.WARN_USER, targetUserId)
    return { success: true }
  } catch (err) {
    console.error('[Admin] warnUser error:', err)
    return { success: false, error: err?.message || 'Failed to warn user' }
  }
}

/**
 * Delete reported user's account.
 */
export const deleteReportedUser = async (adminId, targetUserId) => {
  return deleteUser(adminId, targetUserId)
}

/**
 * Resolve a report.
 */
export const resolveReport = async (adminId, reportId) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    const ref = doc(db, REPORTS_COLLECTION, reportId)
    const snap = await getDoc(ref)
    const targetUserId = snap.exists() ? snap.data()?.reportedUserId : null
    await updateDoc(ref, { status: 'resolved', resolvedAt: serverTimestamp(), resolvedBy: adminId })
    await logAdminAction(adminId, ADMIN_ACTIONS.RESOLVE_REPORT, targetUserId, { reportId })
    return { success: true }
  } catch (err) {
    console.error('[Admin] resolveReport error:', err)
    return { success: false, error: err?.message || 'Failed to resolve report' }
  }
}
