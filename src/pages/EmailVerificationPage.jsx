import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Button from '../components/ui/Button'
import { FaEnvelope } from 'react-icons/fa'

const EmailVerificationPage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (!u) {
        navigate('/login')
        return
      }
      if (u.emailVerified) {
        navigate('/complete-profile', { replace: true })
        return
      }
    })
    return unsubscribe
  }, [navigate])

  // Poll for verification when user returns after clicking the link in their email
  useEffect(() => {
    if (!user || user.emailVerified) return
    const interval = setInterval(async () => {
      try {
        await user.reload()
        const u = auth.currentUser
        if (u?.emailVerified) {
          navigate('/complete-profile', { replace: true })
        }
      } catch (err) {
        console.error('Poll check failed:', err)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [user?.uid, user?.emailVerified, navigate])

  const handleResendVerification = async () => {
    if (!user) return
    setResending(true)
    setError('')
    setResent(false)
    try {
      // Reload user in case they already verified in another tab
      await user.reload()
      const freshUser = auth.currentUser
      if (freshUser?.emailVerified) {
        navigate('/complete-profile', { replace: true })
        return
      }
      const { sendEmailVerification } = await import('firebase/auth')
      await sendEmailVerification(freshUser)
      setResent(true)
    } catch (err) {
      const msg = err.message || 'Failed to send verification email'
      if (msg.includes('too-many-requests') || msg.includes('TOO_MANY_ATTEMPTS')) {
        setError('Too many attempts. Please wait a few minutes before trying again.')
      } else if (msg.includes('already') || msg.includes('verified')) {
        navigate('/complete-profile', { replace: true })
      } else {
        setError(msg)
      }
    } finally {
      setResending(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-primary-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-gold"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-cream flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-gold/20 flex items-center justify-center">
          <FaEnvelope className="text-4xl text-primary-gold" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-primary-maroon mb-4">
          Verify Your Email
        </h1>
        <p className="text-gray-600 mb-6">
          A verification link has been sent to <strong>{user.email}</strong>. 
          Please check your inbox, click the link to verify your email, then complete your profile to access your dashboard.
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {resent && (
          <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            Verification email sent! Check your inbox.
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Didn't receive the email?
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResendVerification}
            loading={resending}
            disabled={resending}
          >
            Resend Verification Email
          </Button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-4 text-sm text-primary-maroon hover:text-primary-gold"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default EmailVerificationPage
