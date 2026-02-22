import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getUserProfile } from '../services/auth'
import { getProfileById } from '../services/profiles'
import {
  getProfilePhotoUrl,
  getProfileEducation,
  getProfileOccupation,
  getProfileHeight,
  getProfileMotherTongue,
  getProfilePhotos,
  isProfileVerified,
} from '../services/profiles'
import { sendInterest, getInterestBetween } from '../services/interests'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import {
  FaArrowLeft,
  FaHandshake,
  FaEnvelope,
  FaUser,
  FaGraduationCap,
  FaUsers,
  FaBirthdayCake,
  FaLeaf,
  FaSearch,
  FaCheckCircle,
  FaImage,
} from 'react-icons/fa'
import ReportButton from '../components/profile/ReportButton'

/** Premium white content card with soft glow border */
const SectionCard = ({ icon: Icon, title, children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
    className={`
      bg-white rounded-2xl p-6 lg:p-8
      border border-primary-gold/20
      shadow-[0_4px_24px_rgba(128,0,32,0.06),0_0_0_1px_rgba(212,175,55,0.08)]
      hover:shadow-[0_8px_32px_rgba(128,0,32,0.08),0_0_0_1px_rgba(212,175,55,0.15)]
      transition-all duration-300 ease-out
      ${className}
    `}
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-xl bg-primary-cream flex items-center justify-center text-primary-maroon border border-primary-gold/30">
        <Icon className="text-xl" />
      </div>
      <h3 className="text-xl font-serif font-semibold text-primary-maroon tracking-tight">
        {title}
      </h3>
    </div>
    <div className="space-y-4 text-gray-600">{children}</div>
  </motion.div>
)

/** Convert profile values (objects, arrays, primitives) to display strings */
const formatDisplayValue = (value) => {
  if (value == null || value === '') return null
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.filter(Boolean).join(', ')
  if (typeof value === 'object') {
    if ('min' in value && 'max' in value) return `${value.min} – ${value.max}`
    if ('city' in value || 'state' in value || 'country' in value) {
      const parts = [value.city, value.state, value.country].filter(Boolean)
      return parts.join(', ')
    }
    return Object.values(value).filter(Boolean).join(', ')
  }
  return String(value)
}

const InfoRow = ({ label, value }) => {
  const displayValue = formatDisplayValue(value)
  return displayValue ? (
    <div className="flex flex-wrap gap-2 py-1 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 font-medium min-w-[120px] text-sm">{label}</span>
      <span className="text-gray-800 font-medium">{displayValue}</span>
    </div>
  ) : null
}

const stagger = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const ProfileViewPage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { currentUser, userProfile, isPremiumUser, isAdmin } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [interest, setInterest] = useState(null)
  const [interestLoading, setInterestLoading] = useState(false)
  const [interestError, setInterestError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !currentUser) return
      setLoading(true)
      setError(null)
      if (isAdmin()) {
        const result = await getUserProfile(userId)
        if (result.success) {
          setProfile({ id: userId, ...result.data })
        } else {
          setError(result.error || 'Failed to load profile')
        }
      } else {
        const result = await getProfileById(
          userId,
          currentUser.uid,
          userProfile?.personal?.gender
        )
        if (result.success) {
          setProfile(result.data)
        } else {
          setError(result.error || 'Failed to load profile')
        }
      }
      setLoading(false)
    }
    fetchProfile()
  }, [userId, currentUser?.uid, userProfile?.personal?.gender, isAdmin])

  useEffect(() => {
    const fetchInterest = async () => {
      if (!userId || !currentUser?.uid) return
      const sent = await getInterestBetween(currentUser.uid, userId)
      const received = await getInterestBetween(userId, currentUser.uid)
      if (sent.success && sent.data) setInterest({ ...sent.data, direction: 'sent' })
      else if (received.success && received.data) setInterest({ ...received.data, direction: 'received' })
    }
    if (profile) fetchInterest()
  }, [profile, userId, currentUser?.uid])

  const handleSendInterest = async () => {
    if (!currentUser?.uid || !profile?.id || interestLoading || interest) return
    setInterestLoading(true)
    setInterestError(null)
    const res = await sendInterest(
      currentUser.uid,
      profile.id,
      userProfile?.personal?.gender,
      profile.personal?.gender
    )
    if (res.success) {
      setInterest({ status: 'pending', senderId: currentUser.uid, receiverId: profile.id })
    } else {
      setInterestError(res.error)
    }
    setInterestLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-cream/50">
        <Header />
        <div className="pt-32 pb-16 bg-gradient-to-b from-primary-maroon/95 via-primary-maroon/90 to-primary-maroon/80" />
        <div className="max-w-6xl mx-auto px-4 -mt-24 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-14 h-14 rounded-full border-4 border-primary-gold/30 border-t-primary-gold animate-spin" />
          <p className="mt-5 text-gray-600 font-serif text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-primary-cream/50">
        <Header />
        <div className="pt-24 pb-12 bg-gradient-to-b from-primary-maroon/95 via-primary-maroon/90 to-primary-maroon/80" />
        <div className="max-w-2xl mx-auto px-4 -mt-16">
          <div className="bg-white rounded-2xl p-12 text-center shadow-[0_8px_32px_rgba(128,0,32,0.1)] border border-primary-gold/20">
            <div className="text-5xl mb-4 text-primary-maroon/40">●</div>
            <h2 className="text-2xl font-serif font-semibold text-primary-maroon mb-2">
              {error || 'Profile not found'}
            </h2>
            <p className="text-gray-600 mb-8 font-medium">
              This profile may be private or the link might be incorrect.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              icon={<FaArrowLeft />}
              className="transition-all duration-300 hover:bg-primary-cream"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const photos = getProfilePhotos(profile)
  const photoUrl = getProfilePhotoUrl(profile)
  const verified = isProfileVerified(profile)
  const personal = profile.personal || {}
  const community = profile.profile?.communityBirthDetails || {}
  const education = profile.profile?.educationEmployment || {}
  const family = profile.profile?.familyDetails || {}
  const lifestyle = profile.profile?.finalLifestyle || profile.profile?.lifestyleHabits || {}
  const partnerPrefs = profile.profile?.partnerPreferences || {}

  const formatHeight = (val) => {
    if (!val) return null
    const cm = typeof val === 'number' ? val : parseFloat(val)
    if (isNaN(cm)) return val
    return `${Math.floor(cm / 30.48)}'${Math.round((cm % 30.48) / 2.54)}"`
  }
  const rawHeight = getProfileHeight(profile) ?? personal.height
  const heightStr = rawHeight ? (typeof rawHeight === 'number' || !isNaN(parseFloat(rawHeight)) ? formatHeight(rawHeight) : rawHeight) : null

  return (
    <div className="min-h-screen bg-primary-cream/40">
      <Header />
      {/* Gradient header band */}
      <div
        className="h-40 lg:h-48 bg-gradient-to-br from-primary-maroon via-[#5d0018] to-primary-maroon
          shadow-[0_4px_30px_rgba(128,0,32,0.25)]"
        aria-hidden
      />

      <div className="max-w-6xl mx-auto px-4 -mt-28 lg:-mt-36 pb-16 relative">
        {/* Back button - positioned in gradient area */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => (isAdmin() ? navigate('/admin/users') : navigate(-1))}
          className="flex items-center gap-2 text-white/90 hover:text-white font-medium mb-4 transition-all duration-300 hover:gap-3"
        >
          <FaArrowLeft className="text-sm" /> {isAdmin() ? 'Back to Users' : 'Back'}
        </motion.button>

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="space-y-10"
        >
          {/* Hero Card - Photo + Quick Info */}
          <motion.section variants={itemVariants}>
            <div
              className="bg-white rounded-2xl overflow-hidden
                border border-primary-gold/25
                shadow-[0_8px_40px_rgba(128,0,32,0.1),0_0_0_1px_rgba(212,175,55,0.1)]
                hover:shadow-[0_12px_48px_rgba(128,0,32,0.12),0_0_0_1px_rgba(212,175,55,0.15)]
                transition-shadow duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Photo area */}
                <div
                  className="relative lg:col-span-1 h-80 lg:h-full min-h-[340px] bg-primary-maroon/5 cursor-pointer overflow-hidden group"
                  onClick={() => photos.length > 1 && setShowGallery(true)}
                >
                  <div className="absolute inset-0 border-r border-primary-gold/10" />
                  {photoUrl ? (
                    <img
                      src={photos[photoIndex] || photoUrl}
                      alt={personal.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-maroon/10 to-primary-cream/50">
                      <span className="text-primary-maroon/40 text-8xl font-serif">
                        {personal.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  {verified && (
                    <div className="absolute top-5 right-5 bg-white px-4 py-2 rounded-lg text-primary-maroon text-sm font-semibold shadow-lg flex items-center gap-2 border border-primary-gold/30">
                      <FaCheckCircle className="text-green-600" /> Verified
                    </div>
                  )}
                  {photos.length > 1 && (
                    <>
                      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                        {photos.slice(0, 5).map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); setPhotoIndex(i) }}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              i === photoIndex
                                ? 'bg-primary-gold scale-125'
                                : 'bg-white/70 hover:bg-white'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="absolute bottom-5 right-5 bg-primary-maroon/80 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5">
                        <FaImage /> {photos.length} photos
                      </div>
                    </>
                  )}
                </div>

                {/* Quick info */}
                <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center">
                  <h1 className="text-3xl lg:text-4xl font-serif font-semibold text-primary-maroon tracking-tight mb-3">
                    {personal.name || 'Profile'}
                  </h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600 mb-5 font-medium">
                    {personal.age && <span>{personal.age} years</span>}
                    {formatDisplayValue(personal.location) && (
                      <span>{formatDisplayValue(personal.location)}</span>
                    )}
                    {getProfileEducation(profile) && (
                      <span>{getProfileEducation(profile)}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-gray-600 mb-8">
                    {personal.religion && (
                      <span><span className="text-gray-500">Religion</span> {personal.religion}</span>
                    )}
                    {personal.caste && (
                      <span><span className="text-gray-500">Caste</span> {personal.caste}</span>
                    )}
                    {heightStr && (
                      <span><span className="text-gray-500">Height</span> {heightStr}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 items-center">
                    {isAdmin() && (
                      <span className="text-sm text-gray-500 font-medium">Admin view — read only</span>
                    )}
                    {!isAdmin() && interest?.direction === 'received' && interest?.status === 'pending' && (
                      <span className="text-sm text-primary-maroon font-medium">
                        They sent you interest — respond in <button type="button" onClick={() => navigate('/interests')} className="underline hover:no-underline">My Interests</button>
                      </span>
                    )}
                    {!isAdmin() && !interest && (
                      <Button
                        variant="theme"
                        size="lg"
                        icon={<FaHandshake />}
                        onClick={handleSendInterest}
                        loading={interestLoading}
                        disabled={interestLoading}
                        className="bg-gradient-to-r from-[#ff2f92] to-[#8a2be2] text-white border-0 hover:opacity-90 transition-all duration-300 disabled:opacity-70"
                      >
                        Send Interest
                      </Button>
                    )}
                    {!isAdmin() && interest?.direction === 'sent' && interest?.status === 'pending' && (
                      <span className="px-6 py-3 rounded-xl border-2 border-primary-gold/40 bg-primary-cream/50 text-primary-maroon font-semibold">
                        Interest Sent
                      </span>
                    )}
                    {!isAdmin() && interest?.direction === 'sent' && interest?.status === 'rejected' && (
                      <span className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold">
                        Declined
                      </span>
                    )}
                    {!isAdmin() && interest?.direction === 'sent' && interest?.status === 'accepted' && isPremiumUser() && (
                      <Button
                        variant="primary"
                        size="lg"
                        icon={<FaEnvelope />}
                        onClick={() => navigate(`/chat/${profile.id}`)}
                        className="transition-all duration-300"
                      >
                        Message
                      </Button>
                    )}
                    {!isAdmin() && interest?.direction === 'sent' && interest?.status === 'accepted' && !isPremiumUser() && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate('/subscription')}
                        className="border-primary-maroon text-primary-maroon"
                      >
                        Upgrade to Message
                      </Button>
                    )}
                    {interestError && <span className="text-sm text-red-600">{interestError}</span>}
                    {!isAdmin() && (
                      <div className="w-full mt-4">
                        <ReportButton
                          reportedUserId={profile.id}
                          reportedByName={personal.name || 'Profile'}
                          currentUserId={currentUser?.uid}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Grid Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About Me */}
            <motion.div variants={itemVariants}>
              <SectionCard icon={FaUser} title="About Me">
                <InfoRow label="Age" value={personal.age ? `${personal.age} years` : null} />
                <InfoRow label="Religion" value={personal.religion || community.religion} />
                <InfoRow label="Caste" value={personal.caste || community.caste} />
                <InfoRow label="Sub-caste" value={community.subCaste} />
                <InfoRow label="Mother Tongue" value={getProfileMotherTongue(profile) || personal.motherTongue} />
                <InfoRow label="Height" value={heightStr} />
                <InfoRow label="Marital Status" value={personal.maritalStatus} />
              </SectionCard>
            </motion.div>

            {/* Education & Career */}
            <motion.div variants={itemVariants}>
              <SectionCard icon={FaGraduationCap} title="Education & Career">
                <InfoRow label="Education" value={getProfileEducation(profile) || education.highestEducation} />
                <InfoRow label="Degree" value={education.degree} />
                <InfoRow label="College" value={education.college} />
                <InfoRow label="Occupation" value={getProfileOccupation(profile) || education.jobTitle} />
                <InfoRow label="Employer" value={education.companyName} />
                <InfoRow label="Employment" value={education.employmentType} />
                <InfoRow label="Income" value={education.incomeRange} />
                <InfoRow label="Work Location" value={education.workLocation || (education.workCity || education.workCountry ? [education.workCity, education.workCountry].filter(Boolean).join(', ') : null)} />
              </SectionCard>
            </motion.div>

            {/* Family Details */}
            <motion.div variants={itemVariants}>
              <SectionCard icon={FaUsers} title="Family Details">
                <InfoRow label="Father's Name" value={family.fatherName} />
                <InfoRow label="Mother's Name" value={family.motherName} />
                <InfoRow label="Siblings" value={family.siblings} />
                <InfoRow label="Family Type" value={family.familyType} />
              </SectionCard>
            </motion.div>

            {/* Community & Birth */}
            <motion.div variants={itemVariants}>
              <SectionCard icon={FaBirthdayCake} title="Community & Birth">
                <InfoRow label="Gotra" value={community.gotra} />
                <InfoRow label="Rashi" value={community.rashi} />
                <InfoRow label="Nakshatra" value={community.nakshatra} />
                <InfoRow label="Manglik" value={community.manglik} />
                <InfoRow label="Place of Birth" value={community.placeOfBirth} />
              </SectionCard>
            </motion.div>

            {/* Lifestyle */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <SectionCard icon={FaLeaf} title="Lifestyle & Habits">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoRow label="Diet" value={lifestyle.diet} />
                  <InfoRow label="Smoking" value={lifestyle.smoking} />
                  <InfoRow label="Drinking" value={lifestyle.drinking} />
                  <InfoRow label="Hobbies" value={lifestyle.hobbies} />
                  <InfoRow label="Languages" value={lifestyle.languagesKnown} />
                  <InfoRow label="Fitness" value={lifestyle.fitnessHabits} />
                </div>
              </SectionCard>
            </motion.div>

            {/* Partner Preferences */}
            {(partnerPrefs.preferredAgeRange || partnerPrefs.preferredReligion || partnerPrefs.preferredLocation || partnerPrefs.additionalExpectations) && (
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <SectionCard icon={FaSearch} title="Partner Preferences">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoRow label="Age Range" value={partnerPrefs.preferredAgeRange} />
                    <InfoRow label="Height Range" value={partnerPrefs.preferredHeightRange} />
                    <InfoRow label="Religion" value={partnerPrefs.preferredReligion} />
                    <InfoRow label="Caste" value={partnerPrefs.preferredCaste} />
                    <InfoRow label="Education" value={partnerPrefs.preferredEducation} />
                    <InfoRow label="Occupation" value={partnerPrefs.preferredOccupation} />
                    <InfoRow label="Location" value={partnerPrefs.preferredLocation} />
                  </div>
                  {partnerPrefs.additionalExpectations && (
                    <div className="mt-6 pt-6 border-t border-primary-gold/20">
                      <span className="text-gray-500 font-medium block mb-2 text-sm">Additional expectations</span>
                      <p className="text-gray-800 leading-relaxed">{partnerPrefs.additionalExpectations}</p>
                    </div>
                  )}
                </SectionCard>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />

      {/* Photo Gallery Modal */}
      <AnimatePresence>
        {showGallery && photos.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-primary-maroon/90 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowGallery(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[photoIndex]}
                alt=""
                className="w-full max-h-[80vh] object-contain rounded-xl border-2 border-primary-gold/30 shadow-2xl"
              />
              <div className="flex justify-between items-center mt-6 gap-4">
                <button
                  onClick={() => setPhotoIndex((i) => (i === 0 ? photos.length - 1 : i - 1))}
                  className="px-5 py-2.5 bg-white rounded-xl text-primary-maroon font-semibold border border-primary-gold/30 hover:bg-primary-cream transition-all duration-300"
                >
                  Previous
                </button>
                <span className="text-white/90 font-serif text-lg">
                  {photoIndex + 1} / {photos.length}
                </span>
                <button
                  onClick={() => setPhotoIndex((i) => (i === photos.length - 1 ? 0 : i + 1))}
                  className="px-5 py-2.5 bg-white rounded-xl text-primary-maroon font-semibold border border-primary-gold/30 hover:bg-primary-cream transition-all duration-300"
                >
                  Next
                </button>
              </div>
              <button
                onClick={() => setShowGallery(false)}
                className="absolute -top-14 right-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-300 text-xl"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileViewPage
