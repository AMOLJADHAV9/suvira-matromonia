import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChange, getUserProfile } from '../services/auth'
import { getPackageById } from '../utils/premiumPackages'

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

  // Check subscription status (not expired, has valid expiry)
  const hasActiveSubscription = () => {
    if (!userProfile?.subscription) return false
    const { isActive, expiryDate } = userProfile.subscription
    if (isActive === false) return false
    const exp = expiryDate?.toDate?.() || expiryDate
    return exp && new Date(exp) > new Date()
  }

  // Check if user has an active premium package (required for contact actions)
  const hasActivePackage = () => {
    if (isAdmin()) return true
    return hasActiveSubscription()
  }

  // Subscription has expired - had subscription but now past expiry
  const isSubscriptionExpired = () => {
    if (!userProfile?.subscription?.expiryDate) return false
    const exp = userProfile.subscription.expiryDate?.toDate?.() || userProfile.subscription.expiryDate
    return new Date(exp) <= new Date()
  }

  // Get active package config (for limits display)
  const getActivePackage = () => {
    const packageId = userProfile?.subscription?.packageId || userProfile?.subscription?.planType
    return packageId ? getPackageById(packageId) : null
  }

  // Can perform contact actions: view profile, send interest, view mobile
  const canPerformContactAction = () => {
    return hasActivePackage()
  }

  // Get subscription expiry date
  const getSubscriptionExpiry = () => {
    return userProfile?.subscription?.expiryDate || null
  }

  // Check if user can access premium features (chat, etc.) - requires active subscription
  const canAccessPremium = () => {
    return isAdmin() || hasActiveSubscription()
  }

  // Calculate profile completion
  const getProfileCompletion = () => {
    return userProfile?.profileCompletion || 0
  }

  // Update user profile in context (shallow merge; for nested use full objects)
  const updateProfile = (profileData) => {
    setUserProfile(prev => {
      const next = { ...prev, ...profileData }
      if (profileData.personal && prev?.personal) {
        next.personal = { ...prev.personal, ...profileData.personal }
      }
      if (profileData.profile && prev?.profile) {
        next.profile = { ...prev.profile, ...profileData.profile }
      }
      return next
    })
  }

  // Refetch user profile from Firestore to keep app state in sync
  const refreshUserProfile = async () => {
    if (!currentUser) return
    try {
      const profileResult = await getUserProfile(currentUser.uid)
      if (profileResult.success) {
        setUserProfile(profileResult.data)
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error)
    }
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
    hasActivePackage,
    isSubscriptionExpired,
    getActivePackage,
    canPerformContactAction,
    getSubscriptionExpiry,
    canAccessPremium,
    getProfileCompletion,
    updateProfile,
    refreshUserProfile,
    setCurrentUser,
    setUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}