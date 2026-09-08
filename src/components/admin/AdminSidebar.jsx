import React, { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { 
  FaThLarge, 
  FaUsers, 
  FaUserCheck, 
  FaHeart, 
  FaExclamationTriangle, 
  FaCrown, 
  FaCog, 
  FaGem, 
  FaEllipsisV,
  FaSignOutAlt
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { logoutUser } from '../../services/auth'
import { getCountFromServer, collection, query, where } from 'firebase/firestore'
import { db } from '../../services/firebase'

const navItems = [
  { to: '/admin', end: true, icon: FaThLarge, label: 'Dashboard' },
  { to: '/admin/users', end: false, icon: FaUsers, label: 'Users' },
  { to: '/admin/profiles', end: false, icon: FaUserCheck, label: 'Profile Approvals', badgeKey: 'pendingApprovals' },
  { to: '/admin/interests', end: false, icon: FaHeart, label: 'Interests' },
  { to: '/admin/reports', end: false, icon: FaExclamationTriangle, label: 'Reports' },
  { to: '/admin/premium', end: false, icon: FaCrown, label: 'Premium Plans' },
  { to: '/admin/settings', end: false, icon: FaCog, label: 'Settings' },
]

const AdminSidebar = () => {
  const { userProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [pendingCount, setPendingCount] = useState(43)

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const snap = await getCountFromServer(
          query(collection(db, 'users'), where('profileStatus', '==', 'pending'))
        )
        setPendingCount(snap.data().count)
      } catch (e) {
        // fallback default
      }
    }
    fetchPending()
  }, [])

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout()
      } else {
        await logoutUser()
      }
    } catch (err) {
      console.error('Sidebar logout error:', err)
    } finally {
      navigate('/admin/login')
    }
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-[#420B15] text-white h-screen sticky top-0 flex flex-col justify-between overflow-y-auto select-none border-r border-[#30070F] z-40">
      {/* Background Decorative Mandala Accent */}
      <div 
        className="absolute bottom-0 left-0 w-64 h-64 opacity-5 pointer-events-none transform -translate-x-12 translate-y-12 bg-contain bg-no-repeat"
        style={{ backgroundImage: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }}
      />

      {/* Top Section */}
      <div>
        {/* Header / Logo */}
        <div className="p-6 pb-4">
          <Link to="/admin" className="flex items-center space-x-3 group">
            {/* Official Suvira Butterfly Logo */}
            <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center shadow-md transform group-hover:scale-105 transition-all border border-[#D4AF37]/30">
              <img 
                src="/suviralogo-removebg-preview.png" 
                alt="Suvira Logo" 
                className="w-full h-full object-contain filter drop-shadow" 
              />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white tracking-wide leading-tight">
                Suvira Matrimony
              </h2>
              <p className="text-xs text-[#D4AF37] font-medium tracking-wider uppercase">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map(({ to, end, icon: Icon, label, badgeKey }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#801B2E] text-white shadow-md border-l-4 border-[#D4AF37]'
                    : 'text-rose-100/70 hover:bg-[#58101E] hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="text-base" />
                <span>{label}</span>
              </div>
              {badgeKey === 'pendingApprovals' && pendingCount > 0 && (
                <span className="bg-[#661324] text-rose-200 text-xs font-bold px-2 py-0.5 rounded-full border border-rose-400/20">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section: Promo Card + User Profile Footer + Logout Button */}
      <div className="p-4 space-y-4">
        {/* Admin Profile Footer */}
        <div className="pt-2 border-t border-rose-900/40 space-y-3">
          <Link 
            to="/admin/settings"
            className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-1 rounded-xl transition-all"
            title="Click to manage Admin Settings"
          >
            <div className="flex items-center space-x-3">
              <img
                src={
                  userProfile?.personal?.avatar || 
                  userProfile?.photoURL || 
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
                }
                alt="Admin Avatar"
                className="w-9 h-9 rounded-full object-cover border-2 border-[#D4AF37]/60 shadow-sm"
              />
              <div>
                <p className="text-sm font-bold text-white leading-none group-hover:text-[#D4AF37] transition-colors">
                  {userProfile?.personal?.name || 'admin'}
                </p>
                <p className="text-xs text-[#D4AF37] mt-0.5">
                  {userProfile?.adminRoleTitle || 'Super Admin'}
                </p>
              </div>
            </div>
          </Link>

          {/* Explicit Sidebar Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#661324] hover:bg-[#801B2E] text-rose-100 hover:text-white rounded-xl text-xs font-bold transition-all border border-rose-400/20 shadow-sm cursor-pointer"
          >
            <FaSignOutAlt className="text-sm text-rose-300" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar

