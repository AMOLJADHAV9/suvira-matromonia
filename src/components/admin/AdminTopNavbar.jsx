import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logoutUser } from '../../services/auth'
import { FaBars, FaBell, FaCalendarAlt, FaChevronDown, FaArrowLeft, FaCheck, FaSignOutAlt } from 'react-icons/fa'
import { useAdminDateRange } from '../../context/AdminDateRangeContext'

const AdminTopNavbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate()
  const { userProfile, logout } = useAuth()
  const { selectedRange, setSelectedRange, DATE_RANGE_OPTIONS, formatShortDate } = useAdminDateRange()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showCustomCalendar, setShowCustomCalendar] = useState(false)

  const todayStr = new Date().toISOString().split('T')[0]
  const defaultStartStr = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [startDate, setStartDate] = useState(defaultStartStr)
  const [endDate, setEndDate] = useState(todayStr)

  const handleApplyCustomDate = (e) => {
    e.preventDefault()
    if (!startDate || !endDate) return

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) {
      alert('Start date cannot be after end date')
      return
    }

    const diffTime = Math.abs(end - start)
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

    const startFormatted = formatShortDate ? formatShortDate(startDate) : startDate
    const endFormatted = formatShortDate ? formatShortDate(endDate) : endDate

    setSelectedRange({
      days: diffDays,
      label: 'Custom Range',
      dateText: `${startFormatted} – ${endFormatted}`,
      isCustom: true,
      startDate,
      endDate
    })

    setShowCustomCalendar(false)
    setDropdownOpen(false)
  }

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout()
      } else {
        await logoutUser()
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      navigate('/admin/login')
    }
  }

  return (
    <header className="h-16 border-b border-gray-200/80 bg-white flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Toggle Sidebar"
        >
          <FaBars className="text-base" />
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-[#801B2E] text-xs font-bold transition-all border border-rose-200/80 shadow-2xs shrink-0"
          title="Go back to previous page"
        >
          <FaArrowLeft className="text-xs" />
          <span>Back</span>
        </button>
        <Link 
          to="/" 
          className="hidden sm:flex items-center space-x-2 text-xs text-[#801B2E] font-medium hover:underline transition-all"
        >
          <span>Back to site</span>
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Interactive Date Range Picker Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-all shadow-sm"
          >
            <FaCalendarAlt className="text-[#801B2E]" />
            <span>{selectedRange.dateText}</span>
            <FaChevronDown className={`text-gray-400 text-[10px] transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
              <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Select Date Range</p>
                <button 
                  type="button"
                  onClick={() => setShowCustomCalendar(!showCustomCalendar)}
                  className="text-[11px] font-bold text-[#801B2E] hover:underline flex items-center space-x-1"
                >
                  <FaCalendarAlt className="text-xs" />
                  <span>{showCustomCalendar ? 'Predefined' : 'Custom Calendar'}</span>
                </button>
              </div>

              {showCustomCalendar ? (
                <form onSubmit={handleApplyCustomDate} className="p-3 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Start Date</label>
                    <input 
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#801B2E]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">End Date</label>
                    <input 
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#801B2E]"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-1.5 bg-[#801B2E] text-white text-xs font-bold rounded-xl hover:bg-[#5d0018] transition-colors"
                    >
                      Apply Range
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomCalendar(false)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-1 max-h-72 overflow-y-auto">
                  {DATE_RANGE_OPTIONS.map((option) => (
                    <button
                      key={option.days}
                      type="button"
                      onClick={() => {
                        setSelectedRange(option)
                        setDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between transition-colors ${
                        !selectedRange.isCustom && selectedRange.days === option.days 
                          ? 'bg-rose-50 text-[#801B2E] font-bold' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{option.label}</p>
                        <p className="text-[10px] text-gray-400 font-normal">{option.dateText}</p>
                      </div>
                      {!selectedRange.isCustom && selectedRange.days === option.days && (
                        <FaCheck className="text-[#801B2E] text-xs" />
                      )}
                    </button>
                  ))}

                  <div className="border-t border-gray-100 mt-1 pt-1 px-3">
                    <button
                      type="button"
                      onClick={() => setShowCustomCalendar(true)}
                      className="w-full text-left py-2 px-2 text-xs text-[#801B2E] font-bold flex items-center space-x-2 rounded-xl hover:bg-rose-50 transition-colors"
                    >
                      <FaCalendarAlt className="text-xs text-[#801B2E]" />
                      <span>Custom Date Range (Calendar)...</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>



        {/* Admin Profile Info */}
        <button
          type="button"
          onClick={() => navigate('/admin/settings')}
          className="flex items-center space-x-3 pl-2 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-all text-left"
          title="Click to manage Admin Settings"
        >
          <img
            src={
              userProfile?.personal?.avatar || 
              userProfile?.photoURL || 
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
            }
            alt="Admin Avatar"
            className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm"
          />
          <div className="hidden md:block text-left leading-tight">
            <p className="text-xs font-bold text-gray-800">
              {userProfile?.personal?.name || 'admin'}
            </p>
            <p className="text-[11px] text-gray-400">
              {userProfile?.adminRoleTitle || 'Super Admin'}
            </p>
          </div>
        </button>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ml-2"
          title="Logout from Admin Panel"
        >
          <FaSignOutAlt className="text-xs" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}

export default AdminTopNavbar


