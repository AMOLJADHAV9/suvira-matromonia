import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileCompletionModal from '../components/profile/ProfileCompletionModal'

const PROFILE_COMPLETION_THRESHOLD = 50

const CompleteProfilePage = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile, getProfileCompletion } = useAuth()

  useEffect(() => {
    if (currentUser && userProfile != null) {
      const completion = getProfileCompletion()
      if (completion >= PROFILE_COMPLETION_THRESHOLD) {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [currentUser, userProfile, getProfileCompletion, navigate])

  const handleComplete = () => {
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-primary-cream flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl">
        <ProfileCompletionModal
          isOpen={true}
          onClose={handleComplete}
          onComplete={handleComplete}
          required={true}
        />
      </div>
    </div>
  )
}

export default CompleteProfilePage
