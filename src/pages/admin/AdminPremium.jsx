import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchUsers, activatePremium, extendPremium, cancelPremium, expireSubscription } from '../../services/admin'
import { PREMIUM_PACKAGES } from '../../utils/premiumPackages'
import { FaSearch, FaFilter, FaCrown, FaCalendarAlt } from 'react-icons/fa'

const AdminPremium = () => {
  const { currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [extendMonths, setExtendMonths] = useState(1)
  const [activateUserId, setActivateUserId] = useState('')
  const [selectedPackage, setSelectedPackage] = useState('platinum')

  // Quick Auto-Filter States
  const [filterPackage, setFilterPackage] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const load = async () => {
    if (!currentUser?.uid) return
    setLoading(true)
    const res = await fetchUsers(currentUser.uid, {
      pageSize: 200,
      filters: { isPremium: true },
    })
    if (res.success) setUsers(res.data)
    else setError(res.error)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [currentUser?.uid])

  const handleExtend = async (userId) => {
    setActionLoading(userId)
    const res = await extendPremium(currentUser.uid, userId, extendMonths)
    if (res.success) load()
    else setError(res.error)
    setActionLoading(null)
  }

  const handleActivateById = async () => {
    if (!activateUserId.trim()) return
    setActionLoading('activate')
    const res = await activatePremium(currentUser.uid, activateUserId.trim(), selectedPackage)
    if (res.success) {
      setActivateUserId('')
      load()
    } else setError(res.error)
    setActionLoading(null)
  }

  const handleExpire = async (userId) => {
    if (!window.confirm('Mark subscription as expired for this user?')) return
    setActionLoading(userId)
    const res = await expireSubscription(currentUser.uid, userId)
    if (res.success) load()
    else setError(res.error)
    setActionLoading(null)
  }

  const handleCancel = async (userId) => {
    if (!window.confirm('Cancel premium for this user?')) return
    setActionLoading(userId)
    const res = await cancelPremium(currentUser.uid, userId)
    if (res.success) load()
    else setError(res.error)
    setActionLoading(null)
  }

  // Quick Package Filter Calculation
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Filter by package
      if (filterPackage !== 'all') {
        const userPkg = u.subscription?.packageId || u.packageId || 'platinum'
        if (userPkg !== filterPackage) return false
      }
      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const name = (u.personal?.name || '').toLowerCase()
        const email = (u.email || '').toLowerCase()
        const id = (u.id || '').toLowerCase()
        if (!name.includes(q) && !email.includes(q) && !id.includes(q)) return false
      }
      return true
    })
  }, [users, filterPackage, searchQuery])

  // Count per package for pills badge
  const packageCounts = useMemo(() => {
    const counts = { all: users.length, remarriage: 0, platinum: 0, gold: 0, nri: 0 }
    users.forEach((u) => {
      const pkg = u.subscription?.packageId || u.packageId || 'platinum'
      if (counts[pkg] !== undefined) counts[pkg] += 1
    })
    return counts
  }, [users])

  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary-maroon">Premium Management</h2>
          <p className="text-xs text-gray-500 mt-0.5">Filter, activate, and manage premium memberships per package.</p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search by name, email, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#801B2E]"
          />
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs">{error}</div>}

      {/* Manual Activation Card */}
      <div className="p-5 bg-white rounded-2xl border border-rose-100 shadow-2xs space-y-3">
        <p className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
          <FaCrown className="text-[#C59B27]" />
          <span>Activate Premium (Manual)</span>
        </p>
        <div className="flex gap-2 flex-wrap items-center">
          <select
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
            className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-semibold bg-white outline-none"
          >
            {Object.entries(PREMIUM_PACKAGES).map(([id, pkg]) => (
              <option key={id} value={id}>
                {pkg.name} ({pkg.validityMonths}m, ₹{pkg.price})
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter User ID..."
            value={activateUserId}
            onChange={(e) => setActivateUserId(e.target.value)}
            className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs flex-1 min-w-[200px] outline-none"
          />
          <button
            type="button"
            onClick={handleActivateById}
            disabled={actionLoading === 'activate' || !activateUserId.trim()}
            className="px-5 py-2 bg-[#801B2E] hover:bg-[#681423] text-white rounded-xl font-bold text-xs shadow-xs disabled:opacity-50 transition-all"
          >
            {actionLoading === 'activate' ? 'Activating...' : 'Activate Package'}
          </button>
        </div>
      </div>

      {/* QUICK AUTO-FILTER TABS BY PACKAGE */}
      <div className="bg-white p-3 rounded-2xl border border-rose-100 shadow-2xs flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-gray-500 mr-2 flex items-center space-x-1">
          <FaFilter className="text-[10px]" />
          <span>Package Filter:</span>
        </span>

        <button
          onClick={() => setFilterPackage('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            filterPackage === 'all'
              ? 'bg-[#801B2E] text-white shadow-2xs'
              : 'bg-rose-50/60 text-gray-700 hover:bg-rose-100'
          }`}
        >
          <span>All Packages</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${filterPackage === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
            {packageCounts.all}
          </span>
        </button>

        {Object.entries(PREMIUM_PACKAGES).map(([id, pkg]) => {
          const isSelected = filterPackage === id
          const count = packageCounts[id] || 0
          return (
            <button
              key={id}
              onClick={() => setFilterPackage(id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isSelected
                  ? 'bg-[#801B2E] text-white shadow-2xs'
                  : 'bg-rose-50/60 text-gray-700 hover:bg-rose-100'
              }`}
            >
              <span>{pkg.name.replace(' Package', '')}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* EXTEND MONTHS BAR & USER CARDS LIST */}
      <div className="flex items-center justify-between text-xs text-gray-600 font-semibold px-1">
        <span>Showing {filteredUsers.length} of {users.length} Premium Users</span>
        <div className="flex items-center space-x-2">
          <span>Extend Duration by:</span>
          <select
            value={extendMonths}
            onChange={(e) => setExtendMonths(Number(e.target.value) || 1)}
            className="px-2 py-1 border border-gray-200 rounded-lg text-xs font-bold bg-white"
          >
            <option value={1}>1 Month</option>
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
          </select>
        </div>
      </div>

      {/* USER LIST CARDS */}
      <div className="space-y-3">
        {filteredUsers.map((u) => {
          const pkgId = u.subscription?.packageId || u.packageId || 'platinum'
          const pkgInfo = PREMIUM_PACKAGES[pkgId] || { name: 'Platinum Package', price: 2500 }

          return (
            <div
              key={u.id}
              className="bg-white rounded-2xl p-4 border border-rose-100/90 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 text-left">
                <div className="flex items-center space-x-2">
                  <p className="font-bold text-gray-900 text-sm">{u.personal?.name || u.email || 'User'}</p>

                  {/* Package Badge */}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-[#801B2E] border border-rose-200/80">
                    👑 {pkgInfo.name} (₹{pkgInfo.price})
                  </span>
                </div>

                <p className="text-xs text-gray-500 font-medium">Email: {u.email || 'N/A'} • ID: <span className="font-mono text-[11px] text-gray-400">{u.id}</span></p>

                {u.subscription?.expiryDate && (
                  <p className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                    <FaCalendarAlt className="text-[10px]" />
                    <span>Expires: {u.subscription?.expiryDate?.toDate ? u.subscription.expiryDate.toDate().toLocaleDateString() : 'Active'}</span>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExtend(u.id)}
                  disabled={actionLoading === u.id}
                  className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all border border-emerald-200"
                >
                  + Extend {extendMonths}m
                </button>
                <button
                  type="button"
                  onClick={() => handleExpire(u.id)}
                  disabled={actionLoading === u.id}
                  className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-all border border-amber-200"
                >
                  Expire
                </button>
                <button
                  type="button"
                  onClick={() => handleCancel(u.id)}
                  disabled={actionLoading === u.id}
                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all border border-rose-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="bg-white p-8 rounded-2xl border border-rose-100 text-center text-gray-500 space-y-1">
          <p className="font-bold text-sm text-gray-700">No premium users match the selected package filter.</p>
          <p className="text-xs text-gray-400">Try selecting "All Packages" or clearing your search term.</p>
        </div>
      )}
      {loading && <p className="mt-4 text-xs font-bold text-gray-400 text-center">Loading premium users...</p>}
    </div>
  )
}

export default AdminPremium
