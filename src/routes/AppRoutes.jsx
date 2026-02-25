import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import SearchPage from '../pages/SearchPage'
import ProfileViewPage from '../pages/ProfileViewPage'
import InterestPage from '../pages/InterestPage'
import ChatPage from '../pages/ChatPage'
import SubscriptionPage from '../pages/SubscriptionPage'
import AdminPanelPage from '../pages/AdminPanelPage'
import AdminLoginPage from '../pages/AdminLoginPage'
import AdminRegisterPage from '../pages/AdminRegisterPage'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import PrivacyPage from '../pages/PrivacyPage'
import TermsPage from '../pages/TermsPage'
import FAQPage from '../pages/FAQPage'
import EmailVerificationPage from '../pages/EmailVerificationPage'
import CompleteProfilePage from '../pages/CompleteProfilePage'

const PROFILE_COMPLETION_THRESHOLD = 50

// Premium Route (requires active subscription or admin - for Chat)
const PremiumRoute = ({ children }) => {
  const { canAccessPremium, currentUser, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-gold"></div>
      </div>
    )
  }
  if (!currentUser) return <Navigate to="/login" replace />
  if (!canAccessPremium()) return <Navigate to="/subscription" replace state={{ message: 'Active subscription required' }} />
  return children
}

// Protected Route Component (requires auth + email verified)
const ProtectedRoute = ({ children, requiredRole = null, requireProfileComplete = false, allowUnverified = false }) => {
  const { isAuthenticated, isRole, currentUser, loading, getProfileCompletion } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-gold"></div>
      </div>
    )
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (!allowUnverified && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (requireProfileComplete && getProfileCompletion() < PROFILE_COMPLETION_THRESHOLD) {
    return <Navigate to="/complete-profile" replace />
  }
  
  if (requiredRole && !isRole(requiredRole)) {
    if (requiredRole === 'admin') {
      return <Navigate to="/admin/login" replace state={{ message: 'Admin access required' }} />
    }
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Admin route: redirect to /admin/login when not authenticated (instead of /login)
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isRole, currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-gold"></div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />
  }

  if (!currentUser.emailVerified && !isRole('admin')) {
    return <Navigate to="/verify-email" replace />
  }

  if (!isRole('admin')) {
    return <Navigate to="/admin/login" replace state={{ message: 'Admin access required' }} />
  }

  return children
}

// Admin auth pages: show login/register, redirect to /admin if already admin
const AdminAuthRoute = ({ children }) => {
  const { isAuthenticated, isRole, currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-maroon">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-gold"></div>
      </div>
    )
  }

  if (currentUser && isRole('admin')) {
    return <Navigate to="/admin" replace />
  }

  return children
}

// Public Route Component (redirects authenticated users)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, currentUser, loading, getProfileCompletion } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-gold"></div>
      </div>
    )
  }
  
  // Logged in but email not verified -> verify-email page
  if (currentUser && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />
  }
  
  if (isAuthenticated()) {
    const completion = getProfileCompletion()
    if (completion < PROFILE_COMPLETION_THRESHOLD) {
      return <Navigate to="/complete-profile" replace />
    }
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

const AppRoutes = () => {
  const location = useLocation()
  const state = location.state && location.state.backgroundLocation

  return (
    <>
      {/* Base routes (background) */}
      <Routes location={state || location}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/verify-email" 
          element={<EmailVerificationPage />} 
        />
        <Route 
          path="/complete-profile" 
          element={
            <ProtectedRoute>
              <CompleteProfilePage />
            </ProtectedRoute>
          }
        />
        
        {/* Protected User Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requireProfileComplete>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/search" 
          element={
            <ProtectedRoute requireProfileComplete>
              <SearchPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/:userId" 
          element={
            <ProtectedRoute requireProfileComplete>
              <ProfileViewPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/interests" 
          element={
            <ProtectedRoute requireProfileComplete>
              <InterestPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute requireProfileComplete>
              <PremiumRoute>
                <ChatPage />
              </PremiumRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat/:partnerId" 
          element={
            <ProtectedRoute requireProfileComplete>
              <PremiumRoute>
                <ChatPage />
              </PremiumRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/subscription" 
          element={
            <ProtectedRoute requireProfileComplete>
              <SubscriptionPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Auth (Login / Register) */}
        <Route
          path="/admin/login"
          element={
            <AdminAuthRoute>
              <AdminLoginPage />
            </AdminAuthRoute>
          }
        />
        <Route
          path="/admin/register"
          element={
            <AdminAuthRoute>
              <AdminRegisterPage />
            </AdminAuthRoute>
          }
        />
        {/* Admin Panel */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanelPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminPanelPage />
            </AdminRoute>
          }
        />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Modal routes (login/register) rendered on top when backgroundLocation is set */}
      {state && (
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />
        </Routes>
      )}
    </>
  )
}

export default AppRoutes