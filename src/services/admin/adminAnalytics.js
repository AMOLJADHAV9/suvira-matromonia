import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getCountFromServer,
  limit,
} from 'firebase/firestore'
import { db } from '../firebase'
import { requireAdmin } from './adminAuth'
import { getInterestCounts } from './adminInterests'

const MAROON = '#7C2D3A'
const GOLD = '#D4AF37'
const MAROON_LIGHT = '#9e4a54'

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

/**
 * Fetch chart-ready data for admin dashboard (pie, bar, line charts).
 */
export const getDashboardChartData = async (adminId) => {
  const auth = await requireAdmin(adminId)
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    const usersRef = collection(db, 'users')
    const interestsRef = collection(db, 'interests')
    const paymentsRef = collection(db, 'payments')

    const now = new Date()
    const fourteenDaysAgo = new Date(now)
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)

    // Profile status counts (approved, rejected) - we have pending from main analytics
    const [approvedSnap, rejectedSnap, interestCountsRes, usersSnap, interestsSnap, paymentsSnap] = await Promise.all([
      getCountFromServer(query(usersRef, where('profileStatus', '==', 'approved'))),
      getCountFromServer(query(usersRef, where('profileStatus', '==', 'rejected'))),
      getInterestCounts(adminId),
      getDocs(query(usersRef, where('createdAt', '>=', fourteenDaysAgo), orderBy('createdAt', 'asc'), limit(1000))),
      getDocs(query(interestsRef, where('createdAt', '>=', fourteenDaysAgo), orderBy('createdAt', 'asc'), limit(1000))),
      getDocs(query(paymentsRef, where('createdAt', '>=', sixMonthsAgo), limit(500))),
    ])

    const approvedCount = approvedSnap.data().count
    const rejectedCount = rejectedSnap.data().count
    const pendingSnap = await getCountFromServer(query(usersRef, where('profileStatus', '==', 'pending')))
    const pendingCount = pendingSnap.data().count

    const maleSnap = await getCountFromServer(query(usersRef, where('personal.gender', '==', 'male')))
    const femaleSnap = await getCountFromServer(query(usersRef, where('personal.gender', '==', 'female')))
    const maleCount = maleSnap.data().count
    const femaleCount = femaleSnap.data().count

    const interestCounts = interestCountsRes.success ? interestCountsRes.data : { pending: 0, accepted: 0, rejected: 0 }

    // Build usersOverTime: last 14 days buckets
    const usersByDay = {}
    for (let d = 0; d < 14; d++) {
      const dte = new Date(now)
      dte.setDate(dte.getDate() - (13 - d))
      const key = dte.toISOString().slice(0, 10)
      usersByDay[key] = { date: key, count: 0 }
    }
    usersSnap.docs.forEach((doc) => {
      const createdAt = doc.data().createdAt
      const ts = createdAt?.toDate ? createdAt.toDate() : (createdAt ? new Date(createdAt) : null)
      if (ts) {
        const key = ts.toISOString().slice(0, 10)
        if (usersByDay[key]) usersByDay[key].count += 1
      }
    })
    const usersOverTime = Object.values(usersByDay).sort((a, b) => a.date.localeCompare(b.date))

    // Build interestsOverTime: last 14 days buckets
    const interestsByDay = {}
    for (let d = 0; d < 14; d++) {
      const dte = new Date(now)
      dte.setDate(dte.getDate() - (13 - d))
      const key = dte.toISOString().slice(0, 10)
      interestsByDay[key] = { date: key, count: 0 }
    }
    interestsSnap.docs.forEach((doc) => {
      const createdAt = doc.data().createdAt
      const ts = createdAt?.toDate ? createdAt.toDate() : (createdAt ? new Date(createdAt) : null)
      if (ts) {
        const key = ts.toISOString().slice(0, 10)
        if (interestsByDay[key]) interestsByDay[key].count += 1
      }
    })
    const interestsOverTime = Object.values(interestsByDay).sort((a, b) => a.date.localeCompare(b.date))

    // Build revenueOverTime: last 6 months
    const revenueByMonth = {}
    for (let m = 0; m < 6; m++) {
      const dte = new Date(now.getFullYear(), now.getMonth() - (5 - m), 1)
      const key = `${dte.getFullYear()}-${String(dte.getMonth() + 1).padStart(2, '0')}`
      revenueByMonth[key] = { month: key, revenue: 0, label: dte.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }) }
    }
    paymentsSnap.docs.forEach((doc) => {
      const createdAt = doc.data().createdAt
      const ts = createdAt?.toDate ? createdAt.toDate() : (createdAt ? new Date(createdAt) : null)
      const amount = doc.data().amount || 0
      if (ts) {
        const key = `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(2, '0')}`
        if (revenueByMonth[key]) revenueByMonth[key].revenue += amount
      }
    })
    const revenueOverTime = Object.values(revenueByMonth).sort((a, b) => a.month.localeCompare(b.month))

    return {
      success: true,
      data: {
        genderBreakdown: [
          { name: 'Male', value: maleCount, fill: MAROON },
          { name: 'Female', value: femaleCount, fill: GOLD },
        ],
        profileStatusBreakdown: [
          { name: 'Approved', value: approvedCount, fill: '#10B981' },
          { name: 'Pending', value: pendingCount, fill: GOLD },
          { name: 'Rejected', value: rejectedCount, fill: MAROON },
        ],
        interestStatusBreakdown: [
          { name: 'Pending', value: interestCounts.pending, fill: GOLD },
          { name: 'Accepted', value: interestCounts.accepted, fill: '#10B981' },
          { name: 'Rejected', value: interestCounts.rejected, fill: MAROON },
        ],
        usersOverTime,
        interestsOverTime,
        revenueOverTime,
      },
    }
  } catch (err) {
    console.error('[Admin] getDashboardChartData error:', err)
    return { success: false, error: err?.message || 'Failed to fetch chart data' }
  }
}
