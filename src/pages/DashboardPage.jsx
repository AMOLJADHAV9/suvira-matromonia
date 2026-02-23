import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserProfile } from '../services/auth'
import { useOppositeGenderProfiles } from '../hooks/useOppositeGenderProfiles'
import ProfileCompletionModal from '../components/profile/ProfileCompletionModal'
import ProfileCard from '../components/profile/ProfileCard'
import Header from '../components/layout/Header'
import Button from '../components/ui/Button'
import GlassCard from '../components/ui/GlassCard'
import { FaUser, FaSearch, FaHeart, FaCrown, FaEdit, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa'
import { PROFILE_STATUS } from '../utils/constants'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { userProfile, currentUser, isPremiumUser, getProfileCompletion, setUserProfile } = useAuth()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const { profiles: suggestedMatches, loading: profilesLoading } = useOppositeGenderProfiles({
    userId: currentUser?.uid,
    userGender: userProfile?.personal?.gender,
    limit: 6,
    enabled: !!currentUser?.uid && !!userProfile?.personal?.gender
  })

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (currentUser && userProfile) {
        const completion = getProfileCompletion()
        // Show profile completion modal if completion is less than 50%
        if (completion < 50) {
          setShowProfileModal(true)
        }
        setLoading(false)
      }
    }

    checkProfileCompletion()
  }, [currentUser, userProfile, getProfileCompletion])

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-gold"></div>
      </div>
    )
  }

  const profileCompletion = getProfileCompletion()
  const isProfilePending = userProfile?.profileStatus === PROFILE_STATUS.PENDING
  const isProfileApproved = userProfile?.profileStatus === PROFILE_STATUS.APPROVED
  const isProfileRejected = userProfile?.profileStatus === PROFILE_STATUS.REJECTED

  const getStatusBadge = () => {
    if (isProfileApproved) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
          <FaCheckCircle /> Approved
        </span>
      )
    }
    if (isProfilePending) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
          <FaClock /> Pending Review
        </span>
      )
    }
    if (isProfileRejected) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
          <FaTimesCircle /> Rejected
        </span>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-cream to-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary-maroon mb-2">
                Welcome back, {userProfile?.personal?.name || 'User'}!
              </h1>
              <p className="text-gray-600">Manage your profile and find your perfect match</p>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        {profileCompletion < 100 && (
          <GlassCard className="mb-6 bg-primary-cream/50 border border-primary-gold/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary-maroon mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-gray-600 mb-3">
                  Your profile is {profileCompletion}% complete. Complete your profile to get better matches!
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-primary-maroon to-primary-gold h-3 rounded-full transition-all duration-300"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
              </div>
              <Button onClick={() => setShowProfileModal(true)}>
                <FaEdit className="mr-2" />
                Complete Profile
              </Button>
            </div>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Profile Views</p>
                <p className="text-2xl font-bold text-primary-maroon">
                  {userProfile?.stats?.profileViews || 0}
                </p>
              </div>
              <div className="p-3 bg-primary-maroon/10 rounded-full">
                <FaUser className="text-primary-maroon text-xl" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Interests Received</p>
                <p className="text-2xl font-bold text-primary-maroon">
                  {userProfile?.stats?.interestsReceived || 0}
                </p>
              </div>
              <div className="p-3 bg-primary-maroon/10 rounded-full">
                <FaHeart className="text-primary-maroon text-xl" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Interests Sent</p>
                <p className="text-2xl font-bold text-primary-maroon">
                  {userProfile?.stats?.interestsSent || 0}
                </p>
              </div>
              <div className="p-3 bg-primary-gold/20 rounded-full">
                <FaHeart className="text-primary-gold text-xl" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Matches</p>
                <p className="text-2xl font-bold text-primary-maroon">
                  {userProfile?.stats?.matches || 0}
                </p>
              </div>
              <div className="p-3 bg-primary-gold/20 rounded-full">
                <FaCheckCircle className="text-primary-maroon text-xl" />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard className="cursor-pointer" onClick={() => navigate('/search')}>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary-maroon/10 rounded-xl">
                <FaSearch className="text-primary-maroon text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Search Matches</h3>
                <p className="text-sm text-gray-600">Find your perfect match</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="cursor-pointer" onClick={() => navigate('/interests')}>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary-maroon/10 rounded-xl">
                <FaHeart className="text-primary-maroon text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">My Interests</h3>
                <p className="text-sm text-gray-600">View sent and received interests</p>
              </div>
            </div>
          </GlassCard>

          {!isPremiumUser() && (
            <GlassCard className="cursor-pointer" onClick={() => navigate('/subscription')}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary-gold/20 rounded-xl">
                  <FaCrown className="text-primary-gold text-2xl" />
                </div>
                <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Go Premium</h3>
                <p className="text-sm text-gray-600">Unlock premium features</p>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Profile Overview</h3>
              {currentUser?.emailVerified && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Verified
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary-maroon to-primary-gold flex items-center justify-center">
                {(userProfile?.profile?.lifestyleHabits?.profilePhotoUrl || userProfile?.profilePhotoUrl) ? (
                  <img
                    src={userProfile.profile?.lifestyleHabits?.profilePhotoUrl || userProfile.profilePhotoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-white">{userProfile?.personal?.name?.charAt(0) || '?'}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-800">
                  {userProfile?.personal?.name || 'User'}
                </p>
                <p className="text-sm text-gray-600">{userProfile?.personal?.location || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{userProfile?.personal?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{userProfile?.personal?.age || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{userProfile?.personal?.location || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Religion:</span>
                <span className="font-medium">{userProfile?.personal?.religion || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Caste:</span>
                <span className="font-medium">{userProfile?.personal?.caste || 'N/A'}</span>
              </div>
              {userProfile?.education?.degree && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Education:</span>
                  <span className="font-medium">{userProfile.education.degree}</span>
                </div>
              )}
              {userProfile?.education?.occupation && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Occupation:</span>
                  <span className="font-medium">{userProfile.education.occupation}</span>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setShowProfileModal(true)}>
              <FaEdit className="mr-2" />
              Edit Profile
            </Button>
          </GlassCard>

          <GlassCard>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Type:</span>
                <span className="font-medium capitalize">
                  {isPremiumUser() ? (
                    <span className="text-primary-gold">Premium User</span>
                  ) : (
                    'Free User'
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profile Status:</span>
                <span className="font-medium">
                  {getStatusBadge()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profile Completion:</span>
                <span className="font-medium">{profileCompletion}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-medium">
                  {userProfile?.createdAt
                    ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
            {!isPremiumUser() && (
              <Button variant="primary" className="w-full mt-4" onClick={() => navigate('/subscription')}>
                <FaCrown className="mr-2" />
                Upgrade to Premium
              </Button>
            )}
          </GlassCard>
        </div>

        {/* Suggested Matches - opposite gender profiles, after Profile Overview & Account Status */}
        {suggestedMatches.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-primary-maroon">
                Suggested Matches
              </h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/search')}>
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {suggestedMatches.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} compact showActions={false} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onComplete={() => {
          setShowProfileModal(false)
          if (currentUser) {
            getUserProfile(currentUser.uid).then(result => {
              if (result.success) setUserProfile(result.data)
            })
          }
        }}
      />
    </div>
  )
}

export default DashboardPage
