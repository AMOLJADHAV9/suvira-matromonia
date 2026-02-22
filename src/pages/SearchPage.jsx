import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOppositeGenderProfiles } from '../hooks/useOppositeGenderProfiles'
import { getProfilePhotoUrl, getProfileEducation } from '../services/profiles'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import GlassCard from '../components/ui/GlassCard'
import ProfileCard from '../components/profile/ProfileCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { FaSearch, FaFilter, FaTimes, FaExclamationTriangle } from 'react-icons/fa'
import { RELIGIONS } from '../utils/profileConstants'

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name (A–Z)' },
  { value: 'name_desc', label: 'Name (Z–A)' },
  { value: 'age_asc', label: 'Age (Low to High)' },
  { value: 'age_desc', label: 'Age (High to Low)' },
  { value: 'education', label: 'Education' },
  { value: 'income', label: 'Income' }
]

const sortProfiles = (list, sortBy, getProfileEducation) => {
  if (!list.length || !sortBy) return list
  const copy = [...list]
  switch (sortBy) {
    case 'name_asc':
      return copy.sort((a, b) => (a.personal?.name || '').localeCompare(b.personal?.name || '', undefined, { sensitivity: 'base' }))
    case 'name_desc':
      return copy.sort((a, b) => (b.personal?.name || '').localeCompare(a.personal?.name || '', undefined, { sensitivity: 'base' }))
    case 'age_asc':
      return copy.sort((a, b) => (a.personal?.age ?? 999) - (b.personal?.age ?? 999))
    case 'age_desc':
      return copy.sort((a, b) => (b.personal?.age ?? 0) - (a.personal?.age ?? 0))
    case 'education': {
      const eduOrder = ['Doctorate / PhD', 'Masters', 'Bachelors', 'Diploma', 'Higher Secondary', 'Secondary', 'Other']
      const idx = (p) => {
        const e = getProfileEducation(p) || p?.profile?.educationEmployment?.highestEducation || ''
        const i = eduOrder.findIndex((x) => e.toLowerCase().includes(x.toLowerCase()))
        return i >= 0 ? i : eduOrder.length
      }
      return copy.sort((a, b) => idx(a) - idx(b))
    }
    case 'income': {
      const incOrder = ['Above ₹25 LPA', '₹20–25 LPA', '₹15–20 LPA', '₹10–15 LPA', '₹8–10 LPA', '₹6–8 LPA', '₹4–6 LPA', '₹2–4 LPA', 'Below ₹2 LPA']
      const idx = (p) => {
        const i = p?.profile?.educationEmployment?.incomeRange
        const pos = incOrder.findIndex((x) => i === x)
        return pos >= 0 ? pos : incOrder.length
      }
      return copy.sort((a, b) => idx(a) - idx(b))
    }
    default:
      return copy
  }
}

const SearchPage = () => {
  const navigate = useNavigate()
  const { userProfile, currentUser } = useAuth()
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('name_asc')
  const [filters, setFilters] = useState({
    ageMin: '',
    ageMax: '',
    religion: '',
    caste: '',
    location: '',
    education: '',
    search: ''
  })

  const { profiles: fetchedProfiles, loading, error } = useOppositeGenderProfiles({
    userId: currentUser?.uid,
    userGender: userProfile?.personal?.gender,
    limit: 100,
    fetchFromFirestore: true, // fetch gender from Firestore when not in context → male→female, female→male
    enabled: !!currentUser?.uid
  })

  const matchesFilters = (profile) => {
    const personal = profile.personal || {}
    const community = profile.profile?.communityBirthDetails || {}
    if (filters.ageMin && personal.age && personal.age < Number(filters.ageMin)) return false
    if (filters.ageMax && personal.age && personal.age > Number(filters.ageMax)) return false
    const religion = personal.religion || community.religion || ''
    if (filters.religion && religion &&
        !religion.toLowerCase().includes(filters.religion.toLowerCase())) return false
    const caste = personal.caste || community.caste || ''
    if (filters.caste && caste &&
        !caste.toLowerCase().includes(filters.caste.toLowerCase())) return false
    if (filters.location && personal.location &&
        !personal.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    const education = getProfileEducation(profile)
    if (filters.education && education &&
        !education.toString().toLowerCase().includes(filters.education.toLowerCase())) return false
    if (filters.search && personal.name &&
        !personal.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  }

  const profiles = useMemo(
    () => sortProfiles(
      fetchedProfiles.filter((p) => matchesFilters(p)),
      sortBy,
      getProfileEducation
    ),
    [fetchedProfiles, filters, sortBy]
  )

  const setFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))
  const clearFilters = () => setFilters({ ageMin: '', ageMax: '', religion: '', caste: '', location: '', education: '', search: '' })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white/80 to-purple-50/50 py-8">
        <Header />
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-14 h-14 rounded-full border-4 border-theme-pink/30 border-t-theme-purple animate-spin" />
          <p className="mt-4 text-gray-600">Loading matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white/80 to-purple-50/50">
      <Header />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-theme-pink to-theme-purple bg-clip-text text-transparent mb-2">
                  Find Your Perfect Match
                </h1>
                <p className="text-gray-600">
                  {userProfile?.personal?.gender === 'male'
                    ? 'Discover compatible brides'
                    : 'Discover compatible grooms'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-theme-pink focus:outline-none focus:ring-2 focus:ring-theme-pink/20 bg-white text-gray-700 font-medium"
                  >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                </div>
                <Button variant="outline-theme" onClick={() => setShowFilters(!showFilters)} icon={showFilters ? <FaTimes /> : <FaFilter />}>
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </div>
            </div>

            <div className="relative mb-6">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name..."
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                className="pl-12"
              />
            </div>

            {showFilters && (
              <GlassCard className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                    <div className="flex gap-2">
                      <Input type="number" placeholder="Min" value={filters.ageMin} onChange={(e) => setFilter('ageMin', e.target.value)} min={18} max={70} />
                      <Input type="number" placeholder="Max" value={filters.ageMax} onChange={(e) => setFilter('ageMax', e.target.value)} min={18} max={70} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                    <select
                      value={filters.religion}
                      onChange={(e) => setFilter('religion', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-theme-pink bg-white"
                    >
                      <option value="">Any religion</option>
                      {RELIGIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <Input label="Caste" value={filters.caste} onChange={(e) => setFilter('caste', e.target.value)} placeholder="Filter by caste" />
                  <Input label="Location" value={filters.location} onChange={(e) => setFilter('location', e.target.value)} placeholder="City or State" />
                  <Input label="Education" value={filters.education} onChange={(e) => setFilter('education', e.target.value)} placeholder="Education level" />
                  <div className="flex items-end">
                    <Button variant="ghost" onClick={clearFilters} className="w-full">Clear Filters</Button>
                  </div>
                </div>
              </GlassCard>
            )}

            <div className="text-gray-600 mb-4">
              Found <span className="font-semibold text-theme-purple">{profiles.length}</span> matching profiles
            </div>
          </div>

          {error && (
            <GlassCard className="mb-6 border-l-4 border-red-400 bg-red-50/50">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-red-500 text-xl flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            </GlassCard>
          )}

          {profiles.length === 0 ? (
            <GlassCard className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No profiles found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later for new profiles.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SearchPage
