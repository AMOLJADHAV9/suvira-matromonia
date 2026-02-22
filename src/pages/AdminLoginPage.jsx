import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import AdminLoginForm from '../components/auth/AdminLoginForm'

const AdminLoginPage = () => {
  const location = useLocation()
  const message = location.state?.message
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-maroon/95 via-[#5d0018] to-primary-maroon flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 text-white/90 hover:text-white mb-8">
          <span className="text-2xl font-serif font-bold">Suvira</span>
          <span className="text-primary-gold">Matrimony</span>
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-primary-gold/20">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-primary-maroon">Admin Login</h1>
            <p className="text-gray-600 text-sm mt-1">Sign in to access the admin panel</p>
            {message && (
              <p className="text-amber-600 text-sm mt-2 bg-amber-50 rounded-lg py-2 px-3">
                {message}
              </p>
            )}
          </div>
          <AdminLoginForm />
        </div>
        <p className="text-center text-white/70 text-sm mt-6">
          <Link to="/admin/register" className="hover:text-white underline">
            Create admin account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AdminLoginPage
