import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaSignOutAlt } from 'react-icons/fa'

const AdminTopNavbar = () => {
  const navigate = useNavigate()
  const { userProfile } = useAuth()

  const handleLogout = async () => {
    try {
      const { logoutUser } = await import('../../services/auth')
      await logoutUser()
      navigate('/admin/login')
    } catch (e) {
      navigate('/admin/login')
    }
  }

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to site
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {userProfile?.personal?.name || 'Admin'}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <FaSignOutAlt className="text-sm" />
          Logout
        </button>
      </div>
    </header>
  )
}

export default AdminTopNavbar
