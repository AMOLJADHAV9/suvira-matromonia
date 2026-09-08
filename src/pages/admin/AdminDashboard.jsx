import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAdminDateRange } from '../../context/AdminDateRangeContext'
import { getDashboardAnalytics, getDashboardChartData } from '../../services/admin'
import { 
  FaUsers, 
  FaUserCheck, 
  FaHeart, 
  FaExclamationTriangle, 
  FaCrown, 
  FaRupeeSign, 
  FaChevronDown, 
  FaEllipsisV,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa'
import GenderPieChart from '../../components/admin/charts/GenderPieChart'
import StatusPieChart from '../../components/admin/charts/StatusPieChart'
import UsersOverTimeChart from '../../components/admin/charts/UsersOverTimeChart'
import InterestsOverTimeChart from '../../components/admin/charts/InterestsOverTimeChart'
import RevenueLineChart from '../../components/admin/charts/RevenueLineChart'

// Sparkline SVG renderer
const MiniSparkline = ({ color = '#E11D48', path = 'M0 15 Q 15 5, 30 18 T 60 8 T 90 20 T 120 5' }) => (
  <svg className="w-24 h-8 overflow-visible" viewBox="0 0 120 25" fill="none">
    <path d={path} stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
)

const StatCard = ({ icon: Icon, iconBg = 'bg-rose-50', iconColor = 'text-rose-700', label, value, sub, trend, sparklineColor, sparklinePath, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all text-left w-full flex flex-col justify-between ${
      onClick ? 'cursor-pointer' : 'cursor-default'
    }`}
  >
    <div className="flex items-start justify-between w-full">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className={`text-lg ${iconColor}`} />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 text-right">{label}</p>
        <p className="text-2xl font-bold text-gray-900 text-right mt-1">{value}</p>
      </div>
    </div>

    <div className="flex items-end justify-between mt-4 pt-2 w-full">
      <div>
        {sub && <p className="text-xs text-gray-400 font-medium">{sub}</p>}
        {trend && (
          <p className="text-[11px] font-bold flex items-center gap-1 text-gray-500">
            {trend.includes('↑') ? (
              <span className="text-emerald-600 flex items-center"><FaArrowUp className="text-[9px] mr-0.5" /> {trend.replace('↑ ', '')}</span>
            ) : trend.includes('↓') ? (
              <span className="text-rose-600 flex items-center"><FaArrowDown className="text-[9px] mr-0.5" /> {trend.replace('↓ ', '')}</span>
            ) : (
              <span className="text-gray-400">{trend}</span>
            )}
          </p>
        )}
      </div>
      {sparklineColor && (
        <MiniSparkline color={sparklineColor} path={sparklinePath} />
      )}
    </div>
  </button>
)

const AdminDashboard = () => {
  const { currentUser, userProfile } = useAuth()
  const { selectedRange, setSelectedRange, DATE_RANGE_OPTIONS } = useAdminDateRange()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chartMenuOpen, setChartMenuOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!currentUser?.uid) return
      setLoading(true)
      const [analyticsRes, chartRes] = await Promise.all([
        getDashboardAnalytics(currentUser.uid, selectedRange.days),
        getDashboardChartData(currentUser.uid, selectedRange.days),
      ])
      if (analyticsRes.success) setData(analyticsRes.data)
      else setError(analyticsRes.error)
      if (chartRes.success) setChartData(chartRes.data)
      setLoading(false)
    }
    load()
  }, [currentUser?.uid, selectedRange.days])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-12 h-12 rounded-full border-4 border-[#D4AF37]/30 border-t-[#801B2E] animate-spin" />
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

  const daysLabel = selectedRange.subLabel || `last ${selectedRange.days} days`

  return (
    <div className="space-y-8 pb-12">
      {/* Greeting Header */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-gray-900">
          Welcome back, {userProfile?.personal?.name || 'admin'}! 👋
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with your platform today ({selectedRange.label}).
        </p>
      </div>

      {/* Top Stat Cards Grid (4 Top Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={FaUsers}
          iconBg="bg-rose-50"
          iconColor="text-rose-700"
          label="Total Users"
          value={data?.totalUsers ?? 51}
          trend={`↑ 12.5% from ${daysLabel}`}
          sparklineColor="#E11D48"
          sparklinePath="M0 20 Q 20 15, 40 22 T 80 8 T 120 5"
          onClick={() => navigate('/admin/users')}
        />

        <StatCard
          icon={FaUserCheck}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          label="Active Users"
          value={data?.activeUsers ?? 51}
          sub={`${data?.maleCount ?? 39} M / ${data?.femaleCount ?? 10} F${data?.unspecifiedCount ? ` / ${data.unspecifiedCount} Pending` : ''}`}
          trend={`↑ 8.7% from ${daysLabel}`}
          sparklineColor="#10B981"
          sparklinePath="M0 18 Q 30 22, 60 12 T 90 15 T 120 4"
        />

        <StatCard
          icon={FaExclamationTriangle}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          label="Pending Approvals"
          value={data?.pendingApprovals ?? 43}
          trend={`↑ 5.3% from ${daysLabel}`}
          sparklineColor="#F59E0B"
          sparklinePath="M0 15 Q 30 18, 60 10 T 120 6"
          onClick={() => navigate('/admin/profiles')}
        />

        <StatCard
          icon={FaCrown}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          label="Premium Users"
          value={data?.premiumCount ?? 5}
          trend={`↑ 20% from ${daysLabel}`}
          sparklineColor="#8B5CF6"
          sparklinePath="M0 22 Q 40 18, 80 12 T 120 4"
          onClick={() => navigate('/admin/premium')}
        />
      </div>

      {/* Second Row Stat Cards + Platform Health Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={FaHeart}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
          label="Total Interests"
          value={data?.totalInterests ?? 10}
          trend={`↑ 15% from ${daysLabel}`}
          sparklineColor="#EC4899"
          sparklinePath="M0 22 Q 30 15, 60 20 T 120 6"
          onClick={() => navigate('/admin/interests')}
        />

        <StatCard
          icon={FaExclamationTriangle}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="Open Reports"
          value={data?.openReports ?? 1}
          sub={`${data?.totalReports ?? 1} total`}
          trend={`↓ 50% from ${daysLabel}`}
          sparklineColor="#3B82F6"
          sparklinePath="M0 5 Q 40 12, 80 18 T 120 22"
          onClick={() => navigate('/admin/reports')}
        />

        <StatCard
          icon={FaRupeeSign}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
          label="Total Revenue"
          value={`₹${(data?.totalRevenue || data?.monthlyRevenue || 0).toLocaleString()}`}
          sub={`₹${(data?.monthlyRevenue || 0).toLocaleString()} in ${daysLabel}`}
          trend="↑ Collected Plan Revenue"
          sparklineColor="#10B981"
          sparklinePath="M0 20 Q 30 14, 60 18 T 120 4"
          onClick={() => navigate('/admin/premium')}
        />

        {/* Platform Health Promo Gauge Card */}
        <div className="bg-gradient-to-br from-[#540D1A] to-[#3B0A12] rounded-2xl p-5 text-white shadow-md flex flex-col justify-between border border-[#D4AF37]/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="22" stroke="rgba(255,255,255,0.15)" strokeWidth="5" fill="none" />
                <circle cx="28" cy="28" r="22" stroke="#D4AF37" strokeWidth="5" fill="none" strokeDasharray="138" strokeDashoffset="11" strokeLinecap="round" />
              </svg>
              <span className="absolute text-xs font-bold text-white">92%</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-rose-200/80">Platform Health</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">Excellent</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => navigate('/admin/settings')}
            className="w-full mt-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1 border border-white/10"
          >
            <span>View Details</span>
            <span className="text-xs">→</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview Section */}
      <div className="pt-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-gray-900">Analytics Overview</h3>
            <p className="text-xs text-gray-500 mt-0.5">Key insights about your platform ({selectedRange.label})</p>
          </div>
        </div>

        {/* Charts Grid Row 1: Gender Distribution, Profile Status, New User Registrations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Gender Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-900">Gender Distribution</h4>
              <div className="flex items-center space-x-2">
                <button type="button" className="text-xs text-gray-500 hover:text-gray-800">View Details</button>
                <FaEllipsisV className="text-xs text-gray-400 cursor-pointer" />
              </div>
            </div>
            <GenderPieChart data={chartData?.genderBreakdown || []} />
          </div>

          {/* Card 2: Profile Status Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-900">Profile Status Breakdown</h4>
              <div className="flex items-center space-x-2">
                <button type="button" className="text-xs text-gray-500 hover:text-gray-800">View Details</button>
                <FaEllipsisV className="text-xs text-gray-400 cursor-pointer" />
              </div>
            </div>
            <StatusPieChart data={chartData?.profileStatusBreakdown || []} />
          </div>

          {/* Card 3: New User Registrations */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-900">New User Registrations</h4>
              <div className="relative">
                <button 
                  type="button" 
                  onClick={() => setChartMenuOpen(!chartMenuOpen)}
                  className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100"
                >
                  <span>{selectedRange.label}</span>
                  <FaChevronDown className="text-[10px]" />
                </button>
                {chartMenuOpen && (
                  <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                    {DATE_RANGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.days}
                        type="button"
                        onClick={() => {
                          setSelectedRange(opt)
                          setChartMenuOpen(false)
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <UsersOverTimeChart data={chartData?.usersOverTime || []} />
          </div>
        </div>

        {/* Charts Grid Row 2: Connection Activity & Monthly Revenue Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 4: Connection Activity */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-900">Connection Activity ({selectedRange.label})</h4>
              <div className="flex items-center space-x-2">
                <button type="button" className="text-xs text-gray-500 hover:text-gray-800">View Details</button>
                <FaEllipsisV className="text-xs text-gray-400 cursor-pointer" />
              </div>
            </div>
            <InterestsOverTimeChart data={chartData?.interestsOverTime || []} />
          </div>

          {/* Card 5: Monthly Revenue Trends */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-900">Monthly Revenue Trends</h4>
              <div className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 cursor-pointer">
                <span>Last 6 Months</span>
                <FaChevronDown className="text-[10px]" />
              </div>
            </div>
            <RevenueLineChart data={chartData?.revenueOverTime || []} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard


