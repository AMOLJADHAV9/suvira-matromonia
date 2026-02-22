import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { registerAdminUser } from '../../services/auth'
import { validateField } from '../../utils/validation'

const AdminRegisterForm = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
    setServerError('')
  }

  const validate = () => {
    const nextErrors = {}
    const nameErrors = validateField('name', form.name, ['required'])
    if (nameErrors.length) nextErrors.name = nameErrors[0]
    const emailErrors = validateField('email', form.email, ['required', 'email'])
    if (emailErrors.length) nextErrors.email = emailErrors[0]
    const passwordErrors = validateField('password', form.password, ['required', 'password'])
    if (passwordErrors.length) nextErrors.password = passwordErrors[0]
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
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
      const result = await registerAdminUser(
        form.email.trim(),
        form.password,
        form.name.trim()
      )
      if (!result.success) {
        setServerError(result.error || 'Registration failed.')
        return
      }
      setSuccess(true)
      setTimeout(() => navigate('/admin', { replace: true }), 1500)
    } catch (error) {
      console.error('Admin register error:', error)
      setServerError('An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="rounded-xl bg-green-50 border border-green-200 px-6 py-8">
          <p className="text-green-700 font-semibold mb-2">Admin account created successfully!</p>
          <p className="text-green-600 text-sm">Redirecting to admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        required
        value={form.name}
        onChange={(e) => setField('name', e.target.value)}
        error={errors.name}
        placeholder="Admin name"
      />
      <Input
        label="Admin Email"
        required
        type="email"
        value={form.email}
        onChange={(e) => setField('email', e.target.value)}
        error={errors.email}
        placeholder="admin@suviramatrimony.com"
      />
      <Input
        label="Password"
        required
        type="password"
        value={form.password}
        onChange={(e) => setField('password', e.target.value)}
        error={errors.password}
        placeholder="Create a strong password"
      />
      <Input
        label="Confirm Password"
        required
        type="password"
        value={form.confirmPassword}
        onChange={(e) => setField('confirmPassword', e.target.value)}
        error={errors.confirmPassword}
        placeholder="Re-enter password"
      />
      {serverError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}
      <Button type="submit" loading={submitting} className="w-full" size="lg">
        Create Admin Account
      </Button>
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/admin/login" className="text-primary-maroon hover:text-primary-gold font-semibold">
            Admin Login
          </Link>
        </p>
        <p className="text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-maroon">← Back to site</Link>
        </p>
      </div>
    </form>
  )
}

export default AdminRegisterForm
