import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChange, getUserProfile } from '../services/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user)
      
      if (user) {
        // Fetch user profile
        try {
          const profileResult = await getUserProfile(user.uid)
          if (profileResult.success) {
            setUserProfile(profileResult.data)
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Check if user is authenticated
  const isAuthenticated = () => {
    return currentUser !== null && userProfile !== null
  }

  // Check user role
  const isRole = (role) => {
    return userProfile?.role === role
  }

  const isAdmin = () => {
    return isRole('admin')
  }

  const isPremiumUser = () => {
    return isRole('premium_user')
  }

  const isFreeUser = () => {
    return isRole('free_user')
  }

  // Check profile status
  const isProfileApproved = () => {
    return userProfile?.profileStatus === 'approved'
  }

  const isProfilePending = () => {
    return userProfile?.profileStatus === 'pending'
  }

  const isProfileRejected = () => {
    return userProfile?.profileStatus === 'rejected'
  }

  // Check subscription status
  const hasActiveSubscription = () => {
    if (!userProfile?.subscription) return false
    
    const { expiryDate } = userProfile.subscription
    return expiryDate && new Date(expiryDate) > new Date()
  }

  // Get subscription expiry date
  const getSubscriptionExpiry = () => {
    return userProfile?.subscription?.expiryDate || null
  }

  // Check if user can access premium features
  const canAccessPremium = () => {
    return isPremiumUser() || hasActiveSubscription()
  }

  // Calculate profile completion
  const getProfileCompletion = () => {
    return userProfile?.profileCompletion || 0
  }

  // Update user profile in context
  const updateProfile = (profileData) => {
    setUserProfile(prev => ({
      ...prev,
      ...profileData
    }))
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    authLoading,
    setAuthLoading,
    isAuthenticated,
    isRole,
    isAdmin,
    isPremiumUser,
    isFreeUser,
    isProfileApproved,
    isProfilePending,
    isProfileRejected,
    hasActiveSubscription,
    getSubscriptionExpiry,
    canAccessPremium,
    getProfileCompletion,
    updateProfile,
    setCurrentUser,
    setUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}