import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOppositeGenderProfiles } from '../hooks/useOppositeGenderProfiles'
import { getProfilePhotoUrl, getProfileEducation } from '../services/profiles'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaHeart, 
  FaUser, 
  FaCrown, 
  FaCheckCircle, 
  FaEye, 
  FaComments, 
  FaStar, 
  FaBan, 
  FaCog, 
  FaQuestionCircle, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaGraduationCap, 
  FaBriefcase, 
  FaRulerVertical, 
  FaChevronLeft, 
  FaChevronRight,
  FaCamera
} from 'react-icons/fa'
import { RELIGIONS, CASTES, MAHARASHTRA_CITIES, HIGHEST_EDUCATION } from '../utils/profileConstants'
import { cornerFlowerImage } from '../assets/wedding'

// Sample demo profiles if Firestore has few profiles
import couple1 from '../assets/real-matech-story/9da33655fe580abfc72c0b483b715a30.jpg'
import couple2 from '../assets/real-matech-story/b2f4bc0bbba5e4bfb172aecb168cfc56.jpg'
import couple3 from '../assets/real-matech-story/b797f6384f89b1ade60e0a1f57b0c352.jpg'
import couple4 from '../assets/real-matech-story/f2b3666b5c0db1dc5d9def42435b5dbb.jpg'
import stylishCouple from '../assets/real-matech-story/stylish-indian-hindu-couple-posed-street_627829-12969.avif'

const DEMO_PROFILES = [
  {
    id: 'demo-1',
    personal: {
      name: 'Dipali Kailas Muthe',
      age: 27,
      location: 'Pune, Maharashtra',
      height: "5'4\"",
      religion: 'Hindu',
      caste: 'Maratha'
    },
    education: {
      degree: 'B.Tech',
      occupation: 'Software Engineer'
    },
    photoUrl: stylishCouple,
    photoCount: 5,
    isVerified: true
  },
  {
    id: 'demo-2',
    personal: {
      name: 'Kalyani Tapkire',
      age: 26,
      location: 'Beed, Maharashtra',
      height: "5'3\"",
      religion: 'Hindu',
      caste: 'Kunbi'
    },
    education: {
      degree: 'B.E',
      occupation: 'Teacher'
    },
    photoUrl: couple1,
    photoCount: 6,
    isVerified: true
  },
  {
    id: 'demo-3',
    personal: {
      name: 'Nisha Jagtap',
      age: 25,
      location: 'Nagpur, Maharashtra',
      height: "5'5\"",
      religion: 'Hindu',
      caste: 'Maratha'
    },
    education: {
      degree: 'B.Com',
      occupation: 'Accountant'
    },
    photoUrl: couple2,
    photoCount: 4,
    isVerified: true
  },
  {
    id: 'demo-4',
    personal: {
      name: 'Pooja Deshmukh',
      age: 24,
      location: 'Pune, Maharashtra',
      height: "5'2\"",
      religion: 'Hindu',
      caste: 'Deshastha'
    },
    education: {
      degree: 'MBA',
      occupation: 'HR Executive'
    },
    photoUrl: couple3,
    photoCount: 5,
    isVerified: true
  }
]

const SORT_OPTIONS = [
  { value: 'recently_joined', label: 'Recently Joined' },
  { value: 'name_asc', label: 'Name (A–Z)' },
  { value: 'age_asc', label: 'Age (Low to High)' },
  { value: 'age_desc', label: 'Age (High to Low)' }
]

const SearchPage = () => {
  const navigate = useNavigate()
  const { userProfile, currentUser } = useAuth()
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('recently_joined')
  const [interestedIds, setInterestedIds] = useState(new Set())
  const [shortlistedIds, setShortlistedIds] = useState(new Set())

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  const [filters, setFilters] = useState({
    ageRange: '',
    ageMin: '',
    ageMax: '',
    religion: '',
    caste: '',
    location: '',
    education: '',
    height: '',
    search: ''
  })

  const { profiles: fetchedProfiles, loading } = useOppositeGenderProfiles({
    userId: currentUser?.uid,
    userGender: userProfile?.personal?.gender,
    limit: 100,
    fetchFromFirestore: true,
    enabled: !!currentUser?.uid
  })

  const matchesFilters = (profile) => {
    const personal = profile.personal || {}
    const education = profile.education || {}
    const community = profile.profile?.communityBirthDetails || {}
    
    // Search query match
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const name = (personal.name || '').toLowerCase()
      const loc = (personal.location || personal.city || '').toLowerCase()
      const deg = (education.degree || education.highestDegree || '').toLowerCase()
      const occ = (education.occupation || education.employedIn || '').toLowerCase()
      if (!name.includes(q) && !loc.includes(q) && !deg.includes(q) && !occ.includes(q)) {
        return false
      }
    }

    // Age Range filter
    if (filters.ageRange) {
      const age = personal.age
      if (age) {
        if (filters.ageRange === '18-25' && (age < 18 || age > 25)) return false
        if (filters.ageRange === '21-30' && (age < 21 || age > 30)) return false
        if (filters.ageRange === '26-35' && (age < 26 || age > 35)) return false
        if (filters.ageRange === '36+' && age < 36) return false
      }
    } else {
      if (filters.ageMin && personal.age && personal.age < Number(filters.ageMin)) return false
      if (filters.ageMax && personal.age && personal.age > Number(filters.ageMax)) return false
    }

    // Location filter
    if (filters.location) {
      const loc = (personal.location || personal.city || '').toLowerCase()
      if (!loc.includes(filters.location.toLowerCase())) return false
    }

    // Religion filter
    if (filters.religion) {
      const rel = (personal.religion || community.religion || '').toLowerCase()
      if (!rel.includes(filters.religion.toLowerCase())) return false
    }

    // Caste filter
    if (filters.caste) {
      const cst = (personal.caste || community.caste || '').toLowerCase()
      if (!cst.includes(filters.caste.toLowerCase())) return false
    }

    // Education filter
    if (filters.education) {
      const edu = (education.degree || education.highestDegree || getProfileEducation(profile) || '').toLowerCase()
      if (!edu.includes(filters.education.toLowerCase())) return false
    }

    return true
  }

  // Combine fetched profiles with demo profiles if list is small, and filter/sort dynamically
  const displayProfilesList = useMemo(() => {
    const rawList = fetchedProfiles.length > 0 ? fetchedProfiles : DEMO_PROFILES
    const filtered = rawList.filter((profile) => matchesFilters(profile))

    const copy = [...filtered]
    if (sortBy === 'name_asc') {
      return copy.sort((a, b) => (a.personal?.name || '').localeCompare(b.personal?.name || ''))
    } else if (sortBy === 'age_asc') {
      return copy.sort((a, b) => (a.personal?.age || 0) - (b.personal?.age || 0))
    } else if (sortBy === 'age_desc') {
      return copy.sort((a, b) => (b.personal?.age || 0) - (a.personal?.age || 0))
    }
    return copy
  }, [fetchedProfiles, filters, sortBy])

  // Reset page when filters or sorting change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortBy])

  // Dynamic Pagination Calculations
  const totalMatches = displayProfilesList.length
  const totalPages = Math.max(1, Math.ceil(totalMatches / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = totalMatches === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalMatches)
  const paginatedProfiles = displayProfilesList.slice(startIndex, endIndex)

  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (safeCurrentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (safeCurrentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  const setFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))
  const clearFilters = () => setFilters({ ageRange: '', ageMin: '', ageMax: '', religion: '', caste: '', location: '', education: '', height: '', search: '' })

  const toggleInterest = (id) => {
    setInterestedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleShortlist = (id) => {
    setShortlistedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const sidebarNavItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <FaUser />, badge: null, path: '/dashboard' },
    { id: 'interests', name: 'Interests', icon: <FaHeart />, badge: null, path: '/interests' },
    { id: 'findMatches', name: 'Find Matches', icon: <FaSearch />, badge: null, path: '/search' },
    { id: 'shortlisted', name: 'Shortlisted', icon: <FaStar />, badge: null, path: '/interests' },
    { id: 'settings', name: 'Account Settings', icon: <FaCog />, badge: null, path: '/my-profile' },
    { id: 'support', name: 'Help & Support', icon: <FaQuestionCircle />, badge: null, path: '/contact' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#801B2E]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans antialiased text-gray-800 flex flex-col">
      {/* Top Navigation Bar */}
      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* MOBILE NAVIGATION HORIZONTAL PILL SCROLL */}
          <div className="lg:hidden w-full flex items-center space-x-2 overflow-x-auto no-scrollbar bg-white p-2.5 rounded-2xl border border-rose-100/90 shadow-2xs">
            {sidebarNavItems.map((item) => {
              const isActive = item.id === 'findMatches'
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
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

          {/* DESKTOP LEFT SIDEBAR PANEL */}
          <aside className="hidden lg:block w-64 shrink-0 bg-white rounded-3xl border border-rose-100/90 shadow-sm p-4 space-y-6 sticky top-24">
            <nav className="space-y-1">
              {sidebarNavItems.map((item) => {
                const isActive = item.id === 'findMatches'
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
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

            {/* Corner Flower Accent */}
            <div className="pt-2 flex justify-center opacity-30 pointer-events-none">
              <img src={cornerFlowerImage} alt="" className="h-10 w-auto object-contain" />
            </div>
          </aside>

          {/* MAIN SEARCH AREA */}
          <main className="flex-1 w-full space-y-6">
            
            {/* SEARCH PAGE TITLE & TOP ACTIONS */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-left space-y-1">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#801B2E] flex items-center space-x-2">
                  <span>Find Your Perfect Match</span>
                  <span className="text-[#C59B27] text-xl">🪷</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Discover compatible profiles tailored for you
                </p>
              </div>

              {/* Right Sort & Filter Dropdowns */}
              <div className="flex items-center space-x-3 shrink-0">
                <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-2xs text-xs">
                  <span className="text-gray-500 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent font-bold text-gray-800 outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#FFFDF5] border border-[#C59B27]/40 text-[#9E7618] text-xs font-bold hover:bg-[#FFF7E0] transition-colors shadow-2xs"
                >
                  <FaFilter />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* MAIN SEARCH INPUT */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name, location, profession..."
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#801B2E]/20 focus:border-[#801B2E] shadow-2xs"
              />
            </div>

            {/* FILTER PILL BADGES ROW */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Age Pill Filter */}
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-rose-200 bg-white text-gray-700 font-medium shadow-2xs">
                  <span>📅 Age:</span>
                  <select
                    value={filters.ageRange}
                    onChange={(e) => setFilter('ageRange', e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#801B2E] outline-none cursor-pointer"
                  >
                    <option value="">All Ages</option>
                    <option value="18-25">18 - 25 yrs</option>
                    <option value="21-30">21 - 30 yrs</option>
                    <option value="26-35">26 - 35 yrs</option>
                    <option value="36+">36+ yrs</option>
                  </select>
                </div>

                {/* Height Pill Filter */}
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-rose-200 bg-white text-gray-700 font-medium shadow-2xs">
                  <span>📏 Height:</span>
                  <select
                    value={filters.height}
                    onChange={(e) => setFilter('height', e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#801B2E] outline-none cursor-pointer"
                  >
                    <option value="">All Heights</option>
                    <option value="4'6-5'2">4'6" - 5'2"</option>
                    <option value="5'0-6'0">5'0" - 6'0"</option>
                    <option value="5'8+">5'8"+</option>
                  </select>
                </div>

                {/* Location Pill Filter */}
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-rose-200 bg-white text-gray-700 font-medium shadow-2xs">
                  <span>📍 Location:</span>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilter('location', e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#801B2E] outline-none cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    {MAHARASHTRA_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Religion Pill Filter */}
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-rose-200 bg-white text-gray-700 font-medium shadow-2xs">
                  <span>🛕 Religion:</span>
                  <select
                    value={filters.religion}
                    onChange={(e) => setFilter('religion', e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#801B2E] outline-none cursor-pointer"
                  >
                    <option value="">All Religions</option>
                    {RELIGIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Education Pill Filter */}
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-rose-200 bg-white text-gray-700 font-medium shadow-2xs">
                  <span>🎓 Education:</span>
                  <select
                    value={filters.education}
                    onChange={(e) => setFilter('education', e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#801B2E] outline-none cursor-pointer"
                  >
                    <option value="">All Education</option>
                    {HIGHEST_EDUCATION.map(edu => (
                      <option key={edu} value={edu}>{edu}</option>
                    ))}
                  </select>
                </div>

              </div>

              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 font-bold hover:underline shrink-0"
              >
                Clear All
              </button>
            </div>

            {/* EXPANDABLE EXTENDED FILTERS CARD */}
            {showFilters && (
              <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-md space-y-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Age Range</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min (18)" value={filters.ageMin} onChange={(e) => setFilter('ageMin', e.target.value)} className="w-1/2 p-2 border rounded-xl" />
                      <input type="number" placeholder="Max (70)" value={filters.ageMax} onChange={(e) => setFilter('ageMax', e.target.value)} className="w-1/2 p-2 border rounded-xl" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Religion</label>
                    <select value={filters.religion} onChange={(e) => setFilter('religion', e.target.value)} className="w-full p-2 border rounded-xl bg-white">
                      <option value="">Any religion</option>
                      {RELIGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Caste</label>
                    <select value={filters.caste} onChange={(e) => setFilter('caste', e.target.value)} className="w-full p-2 border rounded-xl bg-white">
                      <option value="">Any caste</option>
                      {CASTES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STATS BAR CARD */}
            <div className="bg-white rounded-3xl border border-rose-100/90 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Left Stats Grid */}
              <div className="grid grid-cols-2 gap-6 text-center sm:text-left divide-x-0 sm:divide-x divide-gray-100 w-full sm:w-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-rose-50 text-[#801B2E] flex items-center justify-center text-sm shrink-0">
                    <FaUsers />
                  </div>
                  <div>
                    <span className="text-lg font-serif font-bold text-[#801B2E] block leading-none">{totalMatches}</span>
                    <span className="text-[10px] text-gray-500 font-semibold">Matches Found</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:pl-4">
                  <div className="w-9 h-9 rounded-full bg-rose-50 text-[#801B2E] flex items-center justify-center text-sm shrink-0">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <span className="text-lg font-serif font-bold text-[#801B2E] block leading-none">100%</span>
                    <span className="text-[10px] text-gray-500 font-semibold">Verified Profiles</span>
                  </div>
                </div>
              </div>

              {/* Right Premium Callout Box */}
              <div className="bg-rose-50/70 border border-rose-200/80 px-4 py-2.5 rounded-2xl flex items-center space-x-3 text-left shrink-0">
                <div className="text-xs">
                  <span className="font-bold text-[#801B2E] block flex items-center space-x-1">
                    <span>🌟 Premium Members</span>
                  </span>
                  <span className="text-[10px] text-gray-500">Connect with highly compatible matches</span>
                </div>
                <div className="text-2xl">👑</div>
              </div>

            </div>

            {/* 4-COLUMN PROFILE CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {paginatedProfiles.map((profile, idx) => {
                const name = profile.personal?.name || 'Dipali Kailas Muthe'
                const age = profile.personal?.age || 26
                const location = profile.personal?.location || profile.personal?.city || 'Pune, Maharashtra'
                const height = profile.personal?.height || "5'4\""
                const religion = profile.personal?.religion || 'Hindu'
                const caste = profile.personal?.caste || 'Maratha'
                const degree = profile.profile?.educationEmployment?.highestEducation || profile.profile?.educationEmployment?.degree || profile.education?.highestDegree || profile.education?.degree || profile.highestEducation || profile.education || 'B.Tech'
                const occupation = profile.profile?.educationEmployment?.jobTitle || profile.profile?.educationEmployment?.occupation || profile.education?.occupation || profile.education?.employedIn || profile.occupation || profile.employedIn || 'Software Engineer'
                const photo = getProfilePhotoUrl(profile) || (profile.id?.startsWith('demo') ? profile.photoUrl : null)
                const isLiked = interestedIds.has(profile.id)
                const isShortlisted = shortlistedIds.has(profile.id)

                return (
                  <div
                    key={profile.id || idx}
                    className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group text-left"
                  >
                    <div>
                      {/* Photo Header */}
                      <div className="h-60 w-full relative overflow-hidden bg-gray-100">
                        {photo ? (
                          <img
                            src={photo}
                            alt={name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#801B2E] via-[#681423] to-[#4A0E1A] flex flex-col items-center justify-center text-white p-4">
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xs border border-[#C59B27]/40 flex items-center justify-center font-serif text-2xl font-bold text-[#E5C158] shadow-inner mb-1">
                              {name.charAt(0) || 'U'}
                            </div>
                            <span className="text-[10px] text-rose-200/80 font-medium">No Photo Uploaded</span>
                          </div>
                        )}
                        
                        {/* Verified Pill Top Left */}
                        <div className="absolute top-3 left-3 inline-flex items-center space-x-1 bg-white/95 backdrop-blur-xs text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs">
                          <FaCheckCircle className="text-emerald-500 text-[10px]" />
                          <span>Verified</span>
                        </div>

                        {/* Favorite Heart Top Right */}
                        <button
                          onClick={() => toggleShortlist(profile.id)}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition shadow-xs ${
                            isShortlisted ? 'bg-rose-600 text-white' : 'bg-white/90 text-rose-500 hover:bg-white'
                          }`}
                        >
                          <FaHeart className="text-xs" />
                        </button>

                        {/* Photo Count Badge Bottom Left */}
                        <div className="absolute bottom-3 left-3 inline-flex items-center space-x-1 bg-black/60 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-xs">
                          <FaCamera className="text-[9px]" />
                          <span>{profile.photoCount || 5}</span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-3">
                        {/* Name with Active Green Dot */}
                        <div className="flex items-center justify-between">
                          <h3 
                            onClick={() => profile.id && !profile.id.startsWith('demo') && navigate(`/profile/${profile.id}`)}
                            className="font-serif font-bold text-[#801B2E] text-sm truncate hover:underline cursor-pointer"
                          >
                            {name}
                          </h3>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active now" />
                        </div>

                        {/* Age & Location */}
                        <p className="text-xs text-gray-500 font-medium truncate">
                          {age} yrs • {location}
                        </p>

                        {/* Detail Icons Grid */}
                        <div className="grid grid-cols-2 gap-y-1.5 text-[11px] text-gray-600 pt-1 border-t border-gray-100">
                          <div className="flex items-center space-x-1.5 truncate">
                            <FaRulerVertical className="text-rose-400 text-[10px] shrink-0" />
                            <span className="truncate">{height}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 truncate">
                            <FaGraduationCap className="text-rose-400 text-[10px] shrink-0" />
                            <span className="truncate">{degree}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 col-span-2 truncate">
                            <FaBriefcase className="text-rose-400 text-[10px] shrink-0" />
                            <span className="truncate">{occupation}</span>
                          </div>
                        </div>

                        {/* Religion & Caste */}
                        <p className="text-[11px] text-gray-500 font-medium pt-1">
                          🛕 {religion} • {caste}
                        </p>
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => profile.id && !profile.id.startsWith('demo') ? navigate(`/profile/${profile.id}`) : navigate('/my-profile')}
                        className="py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-[11px] font-bold transition-all flex items-center justify-center space-x-1"
                      >
                        <FaEye className="text-[10px]" />
                        <span>View Profile</span>
                      </button>

                      <button
                        onClick={() => toggleInterest(profile.id)}
                        className={`py-2 rounded-full text-[11px] font-bold transition-all flex items-center justify-center space-x-1 ${
                          isLiked
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#801B2E] hover:bg-[#681423] text-white shadow-xs'
                        }`}
                      >
                        <FaHeart className="text-[10px]" />
                        <span>{isLiked ? 'Interested' : 'Interested'}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* BOTTOM PAGINATION BAR */}
            <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
              <span>
                {totalMatches === 0 
                  ? 'Showing 0 matches' 
                  : `Showing ${startIndex + 1} to ${endIndex} of ${totalMatches} matches`}
              </span>

              <div className="flex items-center space-x-1">
                {/* Prev Button */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                    safeCurrentPage === 1
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-200 text-gray-600 hover:bg-rose-50 hover:border-rose-200'
                  }`}
                  title="Previous page"
                >
                  <FaChevronLeft className="text-[10px]" />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((pg, idx) => {
                  if (pg === '...') {
                    return (
                      <span key={`dots-${idx}`} className="px-1 text-gray-400 font-semibold select-none">
                        ...
                      </span>
                    )
                  }
                  const isCurrent = pg === safeCurrentPage
                  return (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#801B2E] text-white shadow-2xs'
                          : 'border border-gray-200 text-gray-600 hover:bg-rose-50 hover:border-rose-200'
                      }`}
                    >
                      {pg}
                    </button>
                  )
                })}

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                    safeCurrentPage === totalPages
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-200 text-gray-600 hover:bg-rose-50 hover:border-rose-200'
                  }`}
                  title="Next page"
                >
                  <FaChevronRight className="text-[10px]" />
                </button>
              </div>

              {/* Items Per Page Selector */}
              <div className="flex items-center space-x-2">
                <span>Show per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none font-bold text-gray-800 focus:ring-1 focus:ring-[#801B2E]"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>
            </div>

          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default SearchPage
