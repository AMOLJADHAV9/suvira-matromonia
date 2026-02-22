import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaChartLine, FaUsers, FaHeart, FaExclamationTriangle, FaIdCard, FaCrown } from 'react-icons/fa'

const navItems = [
  { to: '/admin', end: true, icon: FaChartLine, label: 'Dashboard' },
  { to: '/admin/users', end: false, icon: FaUsers, label: 'Users' },
  { to: '/admin/profile-approvals', end: false, icon: FaIdCard, label: 'Profile Approvals' },
  { to: '/admin/interests', end: false, icon: FaHeart, label: 'Interests' },
  { to: '/admin/reports', end: false, icon: FaExclamationTriangle, label: 'Reports' },
  { to: '/admin/premium', end: false, icon: FaCrown, label: 'Premium' },
]

const AdminSidebar = () => (
  <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white min-h-screen">
    <div className="p-4 border-b border-gray-100">
      <NavLink to="/admin" className="block">
        <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
        <p className="text-xs text-gray-500 mt-0.5">Suvira Matrimony</p>
      </NavLink>
    </div>
    <nav className="p-3 space-y-0.5">
      {navItems.map(({ to, end, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Icon className="text-base text-gray-500" />
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
)

export default AdminSidebar
