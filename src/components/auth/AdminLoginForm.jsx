import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { loginUser, resetPassword } from '../../services/auth'
import { validateField } from '../../utils/validation'
import { useAuth } from '../../context/AuthContext'

const AdminLoginForm = () => {
  const navigate = useNavigate()
  const { setUserProfile } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSuccess, setResetSuccess] = useState('')

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
    setServerError('')
  }

  const validate = () => {
    const nextErrors = {}
    const emailErrors = validateField('email', form.email, ['required', 'email'])
    if (emailErrors.length) nextErrors.email = emailErrors[0]
    if (!form.password.trim()) nextErrors.password = 'Password is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      const result = await loginUser(form.email.trim(), form.password)
      if (!result.success) {
        setServerError(result.error || 'Login failed.')
        return
      }

      const { getUserProfile } = await import('../../services/auth')
      const profileResult = await getUserProfile(result.user.uid)
      if (profileResult.success) {
        setUserProfile(profileResult.data)
        if (profileResult.data?.role === 'admin') {
          navigate('/admin', { replace: true })
          return
        }
      }

      setServerError('Access denied. Admin credentials required.')
    } catch (error) {
      console.error('Admin login error:', error)
      setServerError('An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!resetEmail.trim()) {
      setServerError('Please enter your email')
      return
    }
    const emailErrors = validateField('email', resetEmail, ['required', 'email'])
    if (emailErrors.length) {
      setServerError(emailErrors[0])
      return
    }
    setSubmitting(true)
    setResetSuccess('')
    try {
      const result = await resetPassword(resetEmail.trim())
      if (result.success) {
        setResetSuccess(result.message)
        setShowForgotPassword(false)
        setResetEmail('')
      } else {
        setServerError(result.error || 'Failed to send reset email.')
      }
    } catch (error) {
      setServerError('An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {showForgotPassword ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary-maroon">Reset Password</h3>
          <p className="text-gray-600 text-sm">Enter your admin email to receive a reset link.</p>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <Input
              label="Email"
              required
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="admin@example.com"
            />
            {resetSuccess && (
              <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                {resetSuccess}
              </div>
            )}
            {serverError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}
            <div className="flex gap-3">
              <Button type="submit" loading={submitting}>Send Reset Link</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForgotPassword(false)
                  setResetEmail('')
                  setServerError('')
                  setResetSuccess('')
                }}
              >
                Back
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Admin Email"
            required
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            error={errors.email}
            placeholder="admin@suviramatrimony.com"
          />
          <div>
            <Input
              label="Password"
              required
              type="password"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              error={errors.password}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-primary-maroon hover:text-primary-gold mt-2"
            >
              Forgot Password?
            </button>
          </div>
          {serverError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}
          <Button type="submit" loading={submitting} className="w-full" size="lg">
            Admin Login
          </Button>
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              <Link to="/admin/register" className="text-primary-maroon hover:text-primary-gold font-semibold">
                Create admin account
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              <Link to="/" className="hover:text-primary-maroon">← Back to site</Link>
            </p>
          </div>
        </form>
      )}
    </div>
  )
}

export default AdminLoginForm
