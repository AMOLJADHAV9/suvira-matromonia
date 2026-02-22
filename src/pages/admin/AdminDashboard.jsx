import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getDashboardAnalytics } from '../../services/admin'
import { FaUsers, FaUserCheck, FaHeart, FaExclamationTriangle, FaCrown, FaRupeeSign, FaChartLine } from 'react-icons/fa'

const StatCard = ({ icon: Icon, label, value, sub, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`bg-white rounded-xl p-6 border border-primary-gold/20 shadow-sm hover:shadow-md transition-all text-left w-full ${
      onClick ? 'cursor-pointer' : 'cursor-default'
    }`}
  >
    <div className="w-12 h-12 rounded-lg bg-primary-maroon/10 flex items-center justify-center mb-3">
      <Icon className="text-2xl text-primary-maroon" />
    </div>
    <p className="text-2xl font-bold text-primary-maroon">{value}</p>
    <p className="text-gray-600 text-sm">{label}</p>
    {sub && <p className="text-gray-400 text-xs mt-1">{sub}</p>}
  </button>
)

const AdminDashboard = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      if (!currentUser?.uid) return
      setLoading(true)
      const res = await getDashboardAnalytics(currentUser.uid)
      if (res.success) setData(res.data)
      else setError(res.error)
      setLoading(false)
    }
    load()
  }, [currentUser?.uid])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 rounded-full border-4 border-primary-gold/30 border-t-primary-gold animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-50 text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-primary-maroon mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FaUsers}
          label="Total Users"
          value={data?.totalUsers ?? 0}
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          icon={FaUserCheck}
          label="Active Users"
          value={data?.activeUsers ?? 0}
          sub={`${data?.maleCount ?? 0} M / ${data?.femaleCount ?? 0} F`}
        />
        <StatCard
          icon={FaExclamationTriangle}
          label="Pending Approvals"
          value={data?.pendingApprovals ?? 0}
          onClick={() => navigate('/admin/profiles')}
        />
        <StatCard
          icon={FaCrown}
          label="Premium Users"
          value={data?.premiumCount ?? 0}
        />
        <StatCard
          icon={FaHeart}
          label="Total Interests"
          value={data?.totalInterests ?? 0}
          onClick={() => navigate('/admin/interests')}
        />
        <StatCard
          icon={FaExclamationTriangle}
          label="Open Reports"
          value={data?.openReports ?? 0}
          sub={`${data?.totalReports ?? 0} total`}
          onClick={() => navigate('/admin/reports')}
        />
        <StatCard
          icon={FaRupeeSign}
          label="Monthly Revenue"
          value={`₹${(data?.monthlyRevenue ?? 0).toLocaleString()}`}
        />
      </div>
    </div>
  )
}

export default AdminDashboard
