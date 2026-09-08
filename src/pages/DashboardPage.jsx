import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserProfile, logoutUser } from '../services/auth'
import { deleteUserAccount as deleteAccountFn } from '../services/deleteAccount'
import { getUserInterestStats, getIncomingInterests, getSentInterests, updateInterestStatus } from '../services/interests'
import { getProfilePhotoUrl } from '../services/profiles'
import DeleteAccountModal from '../components/ui/DeleteAccountModal'
import ProfileCompletionModal from '../components/profile/ProfileCompletionModal'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { 
  FaUser, 
  FaSearch, 
  FaHeart, 
  FaCrown, 
  FaEdit, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaEye, 
  FaComments,
  FaPaperPlane,
  FaUsers,
  FaStar,
  FaBan,
  FaCog,
  FaQuestionCircle,
  FaArrowRight,
  FaShieldAlt,
  FaTrashAlt,
  FaUserFriends
} from 'react-icons/fa'
import stylishCouple from '../assets/real-matech-story/stylish-indian-hindu-couple-posed-street_627829-12969.avif'
import { cornerFlowerImage } from '../assets/wedding'
import { PROFILE_STATUS } from '../utils/constants'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { userProfile, currentUser, isPremiumUser, getProfileCompletion, setUserProfile, getActivePackage, refreshUserProfile } = useAuth()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [liveStats, setLiveStats] = useState(null)
  const [incomingRequests, setIncomingRequests] = useState([])
  const [matchesList, setMatchesList] = useState([])
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  const loadDashboardData = async () => {
    if (!currentUser?.uid) return
    try {
      const [incRes, sntRes, stats] = await Promise.all([
        getIncomingInterests(currentUser.uid),
        getSentInterests(currentUser.uid),
        getUserInterestStats(currentUser.uid)
      ])

      setLiveStats(stats)
      refreshUserProfile?.()

      const incData = incRes.success ? incRes.data : []
      const sntData = sntRes.success ? sntRes.data : []

      const pendingIncoming = incData.filter(i => i.status === 'pending')

      const acceptedIncoming = incData.filter(i => i.status === 'accepted').map(i => ({ ...i, partnerId: i.senderId }))
      const acceptedSent = sntData.filter(i => i.status === 'accepted').map(i => ({ ...i, partnerId: i.receiverId }))
      const allAccepted = [...acceptedIncoming, ...acceptedSent]

      const profileIdsToFetch = new Set([
        ...pendingIncoming.map(i => i.senderId),
        ...allAccepted.map(i => i.partnerId)
      ])

      const profilesMap = {}
      await Promise.all(
        Array.from(profileIdsToFetch).map(async (id) => {
          const res = await getUserProfile(id)
          if (res.success) {
            profilesMap[id] = { id, ...res.data }
          }
        })
      )

      setIncomingRequests(
        pendingIncoming.map(item => ({
          ...item,
          profile: profilesMap[item.senderId] || null
        }))
      )

      setMatchesList(
        allAccepted.map(item => ({
          ...item,
          profile: profilesMap[item.partnerId] || null
        }))
      )
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [currentUser?.uid])

  const handleAcceptInterest = async (interestId) => {
    setActionLoadingId(interestId)
    const res = await updateInterestStatus(interestId, currentUser.uid, 'accepted')
    if (res.success) {
      await loadDashboardData()
    }
    setActionLoadingId(null)
  }

  const handleRejectInterest = async (interestId) => {
    setActionLoadingId(interestId)
    const res = await updateInterestStatus(interestId, currentUser.uid, 'rejected')
    if (res.success) {
      await loadDashboardData()
    }
    setActionLoadingId(null)
  }

  useEffect(() => {
    if (currentUser && userProfile) {
      const completion = getProfileCompletion()
      if (completion < 50) {
        setShowProfileModal(true)
      }
      setLoading(false)
    }
  }, [currentUser, userProfile, getProfileCompletion])

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await deleteAccountFn()
      await logoutUser()
      navigate('/')
    } catch (err) {
      console.error('Delete account error:', err)
      setDeleteError(err?.message || 'Failed to delete account. Please try again.')
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#801B2E]"></div>
      </div>
    )
  }

  const profileCompletion = getProfileCompletion()
  const userName = userProfile?.personal?.name || 'User'

  const sidebarNavItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <FaUser />, badge: null, path: '/dashboard' },
    { id: 'interests', name: 'Interests', icon: <FaHeart />, badge: null, path: '/interests' },
    { id: 'shortlisted', name: 'Shortlisted', icon: <FaStar />, badge: null, path: '/interests' },
    { id: 'settings', name: 'Account Settings', icon: <FaCog />, badge: null, path: '/my-profile' },
    { id: 'support', name: 'Help & Support', icon: <FaQuestionCircle />, badge: null, path: '/contact' }
  ]

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans antialiased text-gray-800 flex flex-col">
      {/* Top Header Navigation */}
      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* MOBILE NAVIGATION HORIZONTAL PILL SCROLL */}
          <div className="lg:hidden w-full flex items-center space-x-2 overflow-x-auto no-scrollbar bg-white p-2.5 rounded-2xl border border-rose-100/90 shadow-2xs">
            {sidebarNavItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab === 'dashboard')
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    if (item.path && item.path !== '/dashboard') navigate(item.path)
                  }}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    isActive
                      ? 'bg-[#801B2E] text-white shadow-xs'
                      : 'text-gray-700 bg-rose-50/50 hover:bg-rose-100'
                  }`}
                >
                  <span className={`text-xs ${isActive ? 'text-white' : 'text-[#801B2E]'}`}>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              )
            })}
          </div>

          {/* DESKTOP LEFT SIDEBAR NAVIGATION PANEL */}
          <aside className="hidden lg:block w-64 shrink-0 bg-white rounded-3xl border border-rose-100/90 shadow-sm p-4 space-y-6 sticky top-24">
            <nav className="space-y-1">
              {sidebarNavItems.map((item) => {
                const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab === 'dashboard')
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      if (item.path && item.path !== '/dashboard') {
                        navigate(item.path)
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-[#801B2E] text-white shadow-md' 
                        : 'text-gray-700 hover:bg-rose-50/70 hover:text-[#801B2E]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm ${isActive ? 'text-white' : 'text-[#801B2E]'}`}>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Watermark Accent */}
            <div className="pt-2 flex justify-center opacity-30 pointer-events-none">
              <img src={cornerFlowerImage} alt="" className="h-10 w-auto object-contain" />
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 w-full space-y-6">
            
            {/* HERO WELCOME BANNER */}
            <div className="bg-gradient-to-r from-[#FFF7F8] via-[#FFFDF5] to-[#FFF7F8] p-6 sm:p-8 rounded-3xl border border-rose-100/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 text-left z-10">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#801B2E] leading-tight">
                  Welcome back, {userName}! 👋
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  Manage your profile and find your perfect match
                </p>
                <div className="flex items-center space-x-2 pt-1">
                  <div className="h-[1px] w-8 bg-amber-300" />
                  <span className="text-[#C59B27] text-xs">🌸</span>
                  <div className="h-[1px] w-8 bg-amber-300" />
                </div>
              </div>

              {/* Profile Completion Circle Ring & Action */}
              <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-rose-100/80 shadow-xs shrink-0 z-10">
                <div className="relative w-16 h-16 rounded-full border-4 border-[#C59B27] flex items-center justify-center bg-amber-50/50 shrink-0">
                  <span className="text-xs font-serif font-bold text-[#801B2E]">{profileCompletion}%</span>
                  <span className="text-[8px] font-bold text-gray-500 block absolute bottom-2">Complete</span>
                </div>
                <div className="space-y-1.5 text-left">
                  <span className="text-xs font-bold text-[#801B2E] block">
                    {profileCompletion >= 100 ? "Your profile is fully complete!" : "Complete your profile to get matched!"}
                  </span>
                  <p className="text-[11px] text-gray-500">You're all set to find your perfect match.</p>
                  <button
                    onClick={() => navigate('/my-profile')}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-[#801B2E] text-[#801B2E] text-[11px] font-bold hover:bg-rose-50 transition-colors"
                  >
                    <FaEye className="text-[10px]" />
                    <span>View My Profile</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 STAT CARDS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Profile Views */}
              <div className="bg-white p-5 rounded-2xl border border-rose-100/90 shadow-2xs hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <span className="text-xs text-gray-500 font-semibold block">Profile Views</span>
                  <span className="text-2xl font-serif font-bold text-[#801B2E]">
                    {liveStats ? liveStats.profileViews : (userProfile?.stats?.profileViews || 0)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block">↑ 12% this week</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#801B2E] flex items-center justify-center text-base shrink-0">
                  <FaEye />
                </div>
              </div>

              {/* Interests Received */}
              <div className="bg-white p-5 rounded-2xl border border-rose-100/90 shadow-2xs hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <span className="text-xs text-gray-500 font-semibold block">Interests Received</span>
                  <span className="text-2xl font-serif font-bold text-[#801B2E]">
                    {liveStats ? liveStats.interestsReceived : (userProfile?.stats?.interestsReceived || 0)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block">↑ 20% this week</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#801B2E] flex items-center justify-center text-base shrink-0">
                  <FaHeart />
                </div>
              </div>

              {/* Interests Sent */}
              <div className="bg-white p-5 rounded-2xl border border-rose-100/90 shadow-2xs hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <span className="text-xs text-gray-500 font-semibold block">Interests Sent</span>
                  <span className="text-2xl font-serif font-bold text-[#801B2E]">
                    {liveStats ? liveStats.interestsSent : (userProfile?.stats?.interestsSent || 0)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block">↑ 10% this week</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#801B2E] flex items-center justify-center text-base shrink-0">
                  <FaPaperPlane />
                </div>
              </div>

              {/* Matches */}
              <div className="bg-white p-5 rounded-2xl border border-rose-100/90 shadow-2xs hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <span className="text-xs text-gray-500 font-semibold block">Matches</span>
                  <span className="text-2xl font-serif font-bold text-[#801B2E]">
                    {liveStats ? liveStats.matches : (userProfile?.stats?.matches || 0)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block">↑ 25% this week</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#801B2E] flex items-center justify-center text-base shrink-0">
                  <FaUserFriends />
                </div>
              </div>

            </div>

            {/* MIDDLE 3 CARDS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Find Your Perfect Match */}
              <div className="bg-white p-6 rounded-3xl border border-rose-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between text-left space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#801B2E] flex items-center justify-center text-xl">
                    <FaSearch />
                  </div>
                  <h3 className="text-base font-serif font-bold text-[#801B2E]">Find Your Perfect Match</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Search from thousands of verified profiles based on your preferences.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/search')}
                  className="w-full py-2.5 rounded-full bg-[#801B2E] hover:bg-[#681423] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center space-x-2"
                >
                  <span>Search Matches</span>
                  <FaArrowRight className="text-[10px]" />
                </button>
              </div>

              {/* My Interests */}
              <div className="bg-white p-6 rounded-3xl border border-rose-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between text-left space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#801B2E] flex items-center justify-center text-xl">
                    <FaHeart />
                  </div>
                  <h3 className="text-base font-serif font-bold text-[#801B2E]">My Interests</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    View and manage interests you've sent and received.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/interests')}
                  className="w-full py-2.5 rounded-full border border-[#801B2E] text-[#801B2E] hover:bg-rose-50 text-xs font-bold transition-all flex items-center justify-center space-x-2"
                >
                  <span>View Interests</span>
                  <FaArrowRight className="text-[10px]" />
                </button>
              </div>

              {/* Romantic Couple Banner Quote Card */}
              <div className="bg-gradient-to-r from-amber-50/80 via-rose-50/60 to-amber-50/80 p-5 rounded-3xl border border-amber-200/80 shadow-2xs relative overflow-hidden flex items-center justify-between">
                <div className="space-y-2 text-left max-w-[55%] z-10">
                  <span className="text-2xl font-serif text-[#C59B27] block">“</span>
                  <p className="text-xs font-serif font-bold text-[#801B2E] leading-snug">
                    Every connection begins with trust and understanding.
                  </p>
                  <div className="h-[2px] w-8 bg-[#C59B27] mt-1" />
                </div>

                <div className="w-32 h-36 rounded-2xl overflow-hidden shadow-xs shrink-0 relative">
                  <img src={stylishCouple} alt="" className="w-full h-full object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>

            </div>

            {/* INCOMING INTERESTS & MY MATCHES ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Incoming Interests (Span 7) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-rose-100/90 shadow-2xs space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-rose-500 text-sm">♥</span>
                    <h3 className="text-base font-serif font-bold text-[#801B2E]">Incoming Interests</h3>
                    <span className="bg-[#801B2E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {incomingRequests.length}
                    </span>
                  </div>
                  <button onClick={() => navigate('/interests')} className="text-xs text-rose-600 font-bold hover:underline">
                    View All
                  </button>
                </div>

                {incomingRequests.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 font-medium text-xs bg-rose-50/20 rounded-2xl border border-rose-100/80">
                    No pending incoming requests at the moment.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {incomingRequests.map((item) => {
                      const profile = item.profile
                      const photoUrl = getProfilePhotoUrl(profile)
                      const isActioning = actionLoadingId === item.id

                      return (
                        <div key={item.id} className="bg-rose-50/40 p-3 rounded-2xl border border-rose-100 flex flex-col justify-between space-y-2 text-center">
                          <div 
                            className="w-10 h-10 rounded-full bg-[#801B2E] text-white font-serif font-bold text-xs flex items-center justify-center mx-auto shadow-2xs cursor-pointer overflow-hidden"
                            onClick={() => profile?.id && navigate(`/profile/${profile.id}`)}
                          >
                            {photoUrl ? (
                              <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              profile?.personal?.name?.charAt(0) || 'P'
                            )}
                          </div>
                          <div>
                            <h4 
                              className="text-xs font-bold text-[#801B2E] truncate cursor-pointer hover:underline"
                              onClick={() => profile?.id && navigate(`/profile/${profile.id}`)}
                            >
                              {profile?.personal?.name || 'User Profile'}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-medium truncate">
                              {profile?.personal?.age ? `${profile.personal.age} yrs` : ''} 
                              {profile?.personal?.location ? ` • ${profile.personal.location}` : ''}
                            </p>
                          </div>
                          <div className="flex items-center justify-center space-x-2 pt-1">
                            <button
                              disabled={isActioning}
                              onClick={() => handleAcceptInterest(item.id)}
                              className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xs hover:bg-emerald-600 hover:text-white transition-colors"
                              title="Accept"
                            >
                              ✓
                            </button>
                            <button
                              disabled={isActioning}
                              onClick={() => handleRejectInterest(item.id)}
                              className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center text-xs hover:bg-rose-600 hover:text-white transition-colors"
                              title="Reject"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* My Matches (Span 5) */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-rose-100/90 shadow-2xs space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaCheckCircle className="text-emerald-600 text-sm" />
                    <h3 className="text-base font-serif font-bold text-[#801B2E]">My Matches</h3>
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {matchesList.length}
                    </span>
                  </div>
                  <button onClick={() => navigate('/search')} className="text-xs text-rose-600 font-bold hover:underline">
                    View All
                  </button>
                </div>

                {matchesList.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 font-medium text-xs bg-rose-50/20 rounded-2xl border border-rose-100/80 space-y-2">
                    <p>No accepted matches yet.</p>
                    <button
                      onClick={() => navigate('/search')}
                      className="px-4 py-1 rounded-full bg-[#801B2E] text-white text-[11px] font-bold"
                    >
                      Find Matches
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matchesList.map((item) => {
                      const profile = item.profile
                      const photoUrl = getProfilePhotoUrl(profile)

                      return (
                        <div key={item.id} className="bg-rose-50/40 p-4 rounded-2xl border border-rose-100 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-11 h-11 rounded-full bg-[#801B2E] text-white font-serif font-bold text-sm flex items-center justify-center shadow-2xs overflow-hidden cursor-pointer"
                              onClick={() => profile?.id && navigate(`/profile/${profile.id}`)}
                            >
                              {photoUrl ? (
                                <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                profile?.personal?.name?.charAt(0) || 'M'
                              )}
                            </div>
                            <div>
                              <h4 
                                className="text-xs font-bold text-[#801B2E] cursor-pointer hover:underline"
                                onClick={() => profile?.id && navigate(`/profile/${profile.id}`)}
                              >
                                {profile?.personal?.name || 'Matched Profile'}
                              </h4>
                              <p className="text-[10px] text-gray-400 font-medium">
                                {profile?.personal?.age ? `${profile.personal.age} yrs` : ''} 
                                {profile?.personal?.location ? ` • ${profile.personal.location}` : ''}
                              </p>
                              <span className="inline-block mt-0.5 text-[9px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-700">
                                Matched
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => profile?.id && navigate(`/profile/${profile.id}`)}
                              className="px-3.5 py-1.5 rounded-full border border-gray-300 text-gray-700 text-[11px] font-bold hover:bg-gray-50 transition-colors"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* PROFILE OVERVIEW & ACCOUNT STATUS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Profile Overview Card (Span 7) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-rose-100/90 shadow-2xs space-y-5 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-serif font-bold text-[#801B2E]">Profile Overview</h3>
                  {currentUser?.emailVerified && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                      <FaCheckCircle className="text-xs" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-[#801B2E] text-white text-2xl font-serif font-bold flex items-center justify-center shadow-md shrink-0 overflow-hidden">
                    {(userProfile?.profile?.lifestyleHabits?.profilePhotoUrl || userProfile?.profilePhotoUrl) ? (
                      <img
                        src={userProfile.profile?.lifestyleHabits?.profilePhotoUrl || userProfile.profilePhotoUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-serif font-bold text-[#801B2E]">{userName}</h4>
                    <p className="text-xs text-gray-500 font-medium">
                      {userProfile?.personal?.age ? `${userProfile.personal.age} yrs` : 'N/A'}
                      {userProfile?.personal?.height ? `, ${userProfile.personal.height}` : ''} • {userProfile?.personal?.city || userProfile?.personal?.location || 'India'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {userProfile?.personal?.religion || 'N/A'} • {userProfile?.personal?.caste || 'N/A'} • {userProfile?.personal?.maritalStatus || 'Never Married'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-rose-50/30 p-4 rounded-2xl border border-rose-100/60 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold">Education</span>
                    <span className="font-bold text-gray-800 truncate block">
                      {userProfile?.profile?.educationEmployment?.highestEducation || 
                       userProfile?.profile?.educationEmployment?.degree || 
                       userProfile?.education?.highestDegree || 
                       userProfile?.education?.degree || 
                       userProfile?.highestEducation || 
                       userProfile?.education || 
                       'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold">Profession</span>
                    <span className="font-bold text-gray-800 truncate block">
                      {userProfile?.profile?.educationEmployment?.jobTitle || 
                       userProfile?.profile?.educationEmployment?.occupation || 
                       userProfile?.education?.occupation || 
                       userProfile?.education?.employedIn || 
                       userProfile?.occupation || 
                       userProfile?.employedIn || 
                       'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold">Income</span>
                    <span className="font-bold text-gray-800 truncate block">
                      {userProfile?.profile?.educationEmployment?.annualIncome || 
                       userProfile?.profile?.educationEmployment?.incomeRange || 
                       userProfile?.education?.annualIncome || 
                       userProfile?.education?.incomeRange || 
                       userProfile?.annualIncome || 
                       userProfile?.incomeRange || 
                       'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold">Family Type</span>
                    <span className="font-bold text-gray-800 truncate block">
                      {userProfile?.profile?.familyDetails?.familyType || 
                       userProfile?.family?.familyType || 
                       userProfile?.familyType || 
                       'Nuclear'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="w-full sm:w-1/2 py-2.5 rounded-full bg-[#C59B27] hover:bg-[#b0881f] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center space-x-2"
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => navigate('/my-profile')}
                    className="w-full sm:w-1/2 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-all flex items-center justify-center space-x-2"
                  >
                    <FaEye />
                    <span>View Full Profile</span>
                  </button>
                </div>
              </div>

              {/* Account Status Card (Span 5) */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-rose-100/90 shadow-2xs space-y-4 text-left">
                <h3 className="text-base font-serif font-bold text-[#801B2E]">Account Status</h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium flex items-center space-x-2">
                      <FaCrown className="text-[#C59B27]" />
                      <span>Membership Plan</span>
                    </span>
                    <span className="font-bold text-[#C59B27]">
                      {getActivePackage()?.name || (isPremiumUser() ? 'Premium Plan' : 'Free User')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium flex items-center space-x-2">
                      <FaClock className="text-gray-400" />
                      <span>Member Since</span>
                    </span>
                    <span className="font-bold text-gray-800">
                      {userProfile?.createdAt ? (userProfile.createdAt.toDate ? userProfile.createdAt.toDate().toLocaleDateString() : new Date(userProfile.createdAt).toLocaleDateString()) : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium flex items-center space-x-2">
                      <FaShieldAlt className="text-emerald-500" />
                      <span>Profile Status</span>
                    </span>
                    <span className="font-bold text-emerald-600">
                      {userProfile?.profileStatus || 'Approved'}
                    </span>
                  </div>

                  <div className="space-y-1 pb-2 border-b border-gray-100">
                    <div className="flex items-center justify-between text-gray-500 font-medium">
                      <span>Profile Completion</span>
                      <span className="font-bold text-emerald-600">{profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium flex items-center space-x-2">
                      <FaClock className="text-gray-400" />
                      <span>Plan Valid Till</span>
                    </span>
                    <span className="font-bold text-gray-800">
                      {userProfile?.subscription?.expiryDate 
                        ? (userProfile.subscription.expiryDate.toDate 
                            ? userProfile.subscription.expiryDate.toDate().toLocaleDateString() 
                            : new Date(userProfile.subscription.expiryDate).toLocaleDateString()) 
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => { setDeleteError(null); setShowDeleteModal(true) }}
                    className="w-full py-2.5 rounded-full border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaTrashAlt className="text-xs" />
                    <span>Delete My Account</span>
                  </button>
                </div>
              </div>

            </div>

          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />

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

      {/* Delete Account Confirmation Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        loading={deleteLoading}
        error={deleteError}
      />
    </div>
  )
}

export default DashboardPage
