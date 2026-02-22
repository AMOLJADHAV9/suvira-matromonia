import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { loginUser, resetPassword } from '../../services/auth'
import { validateField } from '../../utils/validation'
import { useAuth } from '../../context/AuthContext'

const LoginForm = () => {
  const navigate = useNavigate()
  const { setUserProfile } = useAuth()
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSuccess, setResetSuccess] = useState('')

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
    setServerError('')
  }

  const validate = () => {
    const nextErrors = {}

    const emailErrors = validateField('email', form.email, ['required', 'email'])
    if (emailErrors.length) nextErrors.email = emailErrors[0]

    if (!form.password.trim()) {
      nextErrors.password = 'Password is required'
    }

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
        setServerError(result.error || 'Login failed. Please check your credentials.')
        return
      }

      // If email not verified, go to verification page
      if (result.requiresEmailVerification) {
        navigate('/verify-email')
        return
      }

      // Fetch user profile and update context
      const { getUserProfile } = await import('../../services/auth')
      const profileResult = await getUserProfile(result.user.uid)
      if (profileResult.success) {
        setUserProfile(profileResult.data)
      }

      // Navigate to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      setServerError('An unexpected error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!resetEmail.trim()) {
      setServerError('Please enter your email address')
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
        setServerError(result.error || 'Failed to send password reset email.')
      }
    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {showForgotPassword ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-primary-maroon mb-2">
              Reset Password
            </h3>
            <p className="text-gray-600 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <Input
              label="Email"
              required
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="you@example.com"
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
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                type="submit" 
                loading={submitting}
                className="w-full sm:w-auto"
              >
                Send Reset Link
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForgotPassword(false)
                  setResetEmail('')
                  setServerError('')
                  setResetSuccess('')
                }}
                className="w-full sm:w-auto"
              >
                Back to Login
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Email"
              required
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              error={errors.email}
              placeholder="you@example.com"
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
                className="text-sm text-primary-maroon hover:text-primary-gold mt-2 float-right"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {serverError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div className="space-y-4">
            <Button 
              type="submit" 
              loading={submitting}
              className="w-full"
              size="lg"
            >
              Login
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary-maroon hover:text-primary-gold font-semibold"
              >
                Create Account
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default LoginForm
