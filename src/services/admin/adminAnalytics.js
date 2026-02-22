import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
} from 'firebase/firestore'
import { db } from '../firebase'
import { requireAdmin } from './adminAuth'

/**
 * Fetch dashboard analytics using aggregation where possible for performance.
 */
export const getDashboardAnalytics = async (adminId) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    const usersRef = collection(db, 'users')
    const interestsRef = collection(db, 'interests')
    const reportsRef = collection(db, 'reports')

    const [
      totalUsersSnap,
      activeUsersSnap,
      maleCountSnap,
      femaleCountSnap,
      pendingSnap,
      premiumCountSnap,
      interestsSnap,
      reportsSnap,
      openReportsSnap,
    ] = await Promise.all([
      getCountFromServer(usersRef),
      getCountFromServer(query(usersRef, where('isSuspended', '==', false))),
      getCountFromServer(query(usersRef, where('personal.gender', '==', 'male'))),
      getCountFromServer(query(usersRef, where('personal.gender', '==', 'female'))),
      getCountFromServer(query(usersRef, where('profileStatus', '==', 'pending'))),
      getCountFromServer(query(usersRef, where('role', '==', 'premium_user'))),
      getCountFromServer(interestsRef),
      getCountFromServer(reportsRef),
      getCountFromServer(query(reportsRef, where('status', '==', 'open'))),
    ])

    const maleCount = maleCountSnap.data().count
    const femaleCount = femaleCountSnap.data().count

    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    let monthlyRevenue = 0
    try {
      const paymentsSnap = await getDocs(
        query(
          collection(db, 'payments'),
          where('createdAt', '>=', thisMonthStart)
        )
      )
      paymentsSnap.docs.forEach((d) => {
        monthlyRevenue += d.data()?.amount || 0
      })
    } catch (e) {}

    return {
      success: true,
      data: {
        totalUsers: totalUsersSnap.data().count,
        activeUsers: activeUsersSnap.data().count,
        maleCount,
        femaleCount,
        maleFemaleRatio: femaleCount > 0 ? (maleCount / femaleCount).toFixed(2) : maleCount,
        pendingApprovals: pendingSnap.data().count,
        premiumCount: premiumCountSnap.data().count,
        totalInterests: interestsSnap.data().count,
        totalReports: reportsSnap.data().count,
        openReports: openReportsSnap.data().count,
        monthlyRevenue,
      },
    }
  } catch (err) {
    console.error('[Admin] getDashboardAnalytics error:', err)
    return { success: false, error: err?.message || 'Failed to fetch analytics' }
  }
}
