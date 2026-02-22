import React, { useMemo, useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { registerUser } from '../../services/auth'
import { validateField } from '../../utils/validation'

const initialForm = {
  name: '',
  age: '',
  gender: '',
  religion: '',
  caste: '',
  location: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const SelectField = ({ label, required, value, onChange, error, options }) => {
  const baseClasses =
    'w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white'
  const normalClasses = 'border-gray-200 focus:border-primary-gold focus:ring-2 focus:ring-primary-gold/20'
  const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        className={`${baseClasses} ${error ? errorClasses : normalClasses}`}
        value={value}
        onChange={onChange}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

const RegisterForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [serverSuccess, setServerSuccess] = useState('')

  const genderOptions = useMemo(
    () => [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ],
    []
  )

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
    setServerError('')
  }

  const validate = () => {
    const nextErrors = {}

    const nameErrors = validateField('name', form.name, ['required', 'name'])
    if (nameErrors.length) nextErrors.name = nameErrors[0]

    const ageErrors = validateField('age', String(form.age), ['required'])
    if (ageErrors.length) {
      nextErrors.age = ageErrors[0]
    } else {
      const ageNum = Number(form.age)
      if (!Number.isFinite(ageNum) || ageNum < 18 || ageNum > 70) nextErrors.age = 'Age must be between 18 and 70'
    }

    if (!form.gender) nextErrors.gender = 'This field is required'
    if (!form.religion.trim()) nextErrors.religion = 'This field is required'
    if (!form.caste.trim()) nextErrors.caste = 'This field is required'
    if (!form.location.trim()) nextErrors.location = 'This field is required'

    const emailErrors = validateField('email', form.email, ['required', 'email'])
    if (emailErrors.length) nextErrors.email = emailErrors[0]

    const passwordErrors = validateField('password', form.password, ['required', 'password'])
    if (passwordErrors.length) nextErrors.password = passwordErrors[0]

    const confirmErrors = validateField('confirmPassword', form.confirmPassword, ['required'])
    if (confirmErrors.length) nextErrors.confirmPassword = confirmErrors[0]
    if (!nextErrors.confirmPassword && form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setServerSuccess('')

    if (!validate()) return

    setSubmitting(true)
    try {
      const userData = {
        name: form.name.trim(),
        age: Number(form.age),
        gender: form.gender,
        religion: form.religion.trim(),
        caste: form.caste.trim(),
        location: form.location.trim(),
        personal: {
          name: form.name.trim(),
          age: Number(form.age),
          gender: form.gender,
          religion: form.religion.trim(),
          caste: form.caste.trim(),
          location: form.location.trim()
        }
      }

      const result = await registerUser(form.email.trim(), form.password, userData)
      if (!result.success) {
        setServerError(result.error || 'Registration failed. Please try again.')
        return
      }

      setServerSuccess(result.message || 'Registration successful.')
      onSuccess?.(result)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full name"
          required
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          error={errors.name}
          placeholder="Enter your name"
        />
        <Input
          label="Age"
          required
          type="number"
          value={form.age}
          onChange={(e) => setField('age', e.target.value)}
          error={errors.age}
          placeholder="18"
          min={18}
          max={70}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Gender"
          required
          value={form.gender}
          onChange={(e) => setField('gender', e.target.value)}
          error={errors.gender}
          options={genderOptions}
        />
        <Input
          label="Location"
          required
          value={form.location}
          onChange={(e) => setField('location', e.target.value)}
          error={errors.location}
          placeholder="City, State"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Religion"
          required
          value={form.religion}
          onChange={(e) => setField('religion', e.target.value)}
          error={errors.religion}
          placeholder="e.g. Hindu"
        />
        <Input
          label="Caste"
          required
          value={form.caste}
          onChange={(e) => setField('caste', e.target.value)}
          error={errors.caste}
          placeholder="e.g. Brahmin"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email"
          required
          type="email"
          value={form.email}
          onChange={(e) => setField('email', e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          label="Confirm password"
          required
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setField('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          placeholder="Re-enter password"
        />
      </div>

      {serverError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {serverSuccess && (
        <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {serverSuccess}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
        <Button type="submit" loading={submitting} className="w-full sm:w-auto">
          Create account
        </Button>
      </div>
    </form>
  )
}

export default RegisterForm

