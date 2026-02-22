import React from 'react'
import { Link } from 'react-router-dom'
import AdminRegisterForm from '../components/auth/AdminRegisterForm'

const AdminRegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-maroon/95 via-[#5d0018] to-primary-maroon flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 text-white/90 hover:text-white mb-8">
          <span className="text-2xl font-serif font-bold">Suvira</span>
          <span className="text-primary-gold">Matrimony</span>
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-primary-gold/20">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-primary-maroon">Create Admin Account</h1>
            <p className="text-gray-600 text-sm mt-1">Create a new admin account</p>
          </div>
          <AdminRegisterForm />
        </div>
        <p className="text-center text-white/70 text-sm mt-6">
          <Link to="/admin/login" className="hover:text-white underline">
            Already have an account? Admin Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AdminRegisterPage
