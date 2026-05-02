import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
    getProfilePhotoUrl,
    getProfileEducation,
    getProfileOccupation,
    getProfileHeight,
    getProfileMotherTongue,
    getProfilePhotos,
    isProfileVerified,
} from '../services/profiles'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import {
    FaArrowLeft,
    FaEdit,
    FaUser,
    FaGraduationCap,
    FaUsers,
    FaBirthdayCake,
    FaLeaf,
    FaSearch,
    FaCheckCircle,
    FaImage,
    FaPhone,
    FaCrown,
    FaClock,
    FaTimesCircle,
} from 'react-icons/fa'

// ─── Reusable primitives (same premium aesthetic as ProfileViewPage) ──────────

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
        <div className="flex flex-wrap gap-2 py-2 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-medium min-w-[140px] text-sm">{label}</span>
            <span className="text-gray-800 font-medium">{displayValue}</span>
        </div>
    ) : null
}

const stagger = {
    animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}
const itemVariants = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const MyProfilePage = () => {
    const navigate = useNavigate()
    const { userProfile, currentUser, getProfileCompletion } = useAuth()
    const [photoIndex, setPhotoIndex] = useState(0)
    const [showGallery, setShowGallery] = useState(false)

    if (!userProfile) {
        return (
            <div className="min-h-screen bg-primary-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-gold" />
            </div>
        )
    }

    // Build a profile-shaped object from userProfile so we can reuse helpers
    const profile = { id: currentUser?.uid, ...userProfile }

    const photos = getProfilePhotos(profile)
    const photoUrl = getProfilePhotoUrl(profile)
    const verified = isProfileVerified(profile)
    const personal = profile.personal || {}
    const community = profile.profile?.communityBirthDetails || {}
    const education = profile.profile?.educationEmployment || {}
    const family = profile.profile?.familyDetails || {}
    const lifestyle = profile.profile?.finalLifestyle || profile.profile?.lifestyleHabits || {}
    const partnerPrefs = profile.profile?.partnerPreferences || {}
    const completion = getProfileCompletion()

    const formatHeight = (val) => {
        if (!val) return null
        const cm = typeof val === 'number' ? val : parseFloat(val)
        if (isNaN(cm)) return val
        return `${Math.floor(cm / 30.48)}'${Math.round((cm % 30.48) / 2.54)}"`
    }
    const rawHeight = getProfileHeight(profile) ?? personal.height
    const heightStr = rawHeight
        ? (typeof rawHeight === 'number' || !isNaN(parseFloat(rawHeight))
            ? formatHeight(rawHeight)
            : rawHeight)
        : null

    // Status badge
    const StatusBadge = () => {
        const status = profile.profileStatus
        if (status === 'approved')
            return (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                    <FaCheckCircle /> Approved
                </span>
            )
        if (status === 'pending')
            return (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
                    <FaClock /> Pending Review
                </span>
            )
        if (status === 'rejected')
            return (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-semibold">
                    <FaTimesCircle /> Rejected
                </span>
            )
        return null
    }

    return (
        <div className="min-h-screen bg-primary-cream/40">
            <Header />

            {/* Gradient band */}
            <div
                className="h-40 lg:h-48 bg-gradient-to-br from-primary-maroon via-[#5d0018] to-primary-maroon
          shadow-[0_4px_30px_rgba(128,0,32,0.25)]"
                aria-hidden
            />

            <div className="max-w-6xl mx-auto px-4 -mt-28 lg:-mt-36 pb-16 relative">

                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-white/90 hover:text-white font-medium mb-4 transition-all duration-300 hover:gap-3"
                >
                    <FaArrowLeft className="text-sm" /> Back to Dashboard
                </motion.button>

                <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-10">

                    {/* ── Hero Card ── */}
                    <motion.section variants={itemVariants}>
                        <div
                            className="bg-white rounded-2xl overflow-hidden
                border border-primary-gold/25
                shadow-[0_8px_40px_rgba(128,0,32,0.1),0_0_0_1px_rgba(212,175,55,0.1)]
                hover:shadow-[0_12px_48px_rgba(128,0,32,0.12),0_0_0_1px_rgba(212,175,55,0.15)]
                transition-shadow duration-300"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">

                                {/* Photo */}
                                <div
                                    className="relative lg:col-span-1 h-80 lg:h-full min-h-[340px] bg-primary-maroon/5
                    cursor-pointer overflow-hidden group"
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

                                    {/* Verified badge */}
                                    {verified && (
                                        <div className="absolute top-5 right-5 bg-white px-4 py-2 rounded-lg text-primary-maroon text-sm font-semibold shadow-lg flex items-center gap-2 border border-primary-gold/30">
                                            <FaCheckCircle className="text-green-600" /> Verified
                                        </div>
                                    )}

                                    {/* Photo dots + count */}
                                    {photos.length > 1 && (
                                        <>
                                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                                                {photos.slice(0, 5).map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={(e) => { e.stopPropagation(); setPhotoIndex(i) }}
                                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === photoIndex
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

                                {/* Quick info + actions */}
                                <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-between">
                                    <div>
                                        {/* "My Profile" label */}
                                        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-primary-cream text-primary-maroon text-xs font-bold uppercase tracking-widest border border-primary-gold/30">
                                            My Profile
                                        </span>

                                        <h1 className="text-3xl lg:text-4xl font-serif font-semibold text-primary-maroon tracking-tight mb-3">
                                            {personal.name || 'My Profile'}
                                        </h1>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600 mb-3 font-medium">
                                            {personal.age && <span>{personal.age} years</span>}
                                            {formatDisplayValue(personal.location) && (
                                                <span>{formatDisplayValue(personal.location)}</span>
                                            )}
                                            {getProfileEducation(profile) && (
                                                <span>{getProfileEducation(profile)}</span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-gray-600 mb-4">
                                            {personal.religion && (
                                                <span><span className="text-gray-500">Religion </span>{personal.religion}</span>
                                            )}
                                            {personal.caste && (
                                                <span><span className="text-gray-500">Caste </span>{personal.caste}</span>
                                            )}
                                            {heightStr && (
                                                <span><span className="text-gray-500">Height </span>{heightStr}</span>
                                            )}
                                        </div>

                                        {/* Status badges row */}
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <StatusBadge />
                                            {profile.isPremium && (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold border border-amber-200">
                                                    <FaCrown className="text-primary-gold" /> Premium
                                                </span>
                                            )}
                                            {currentUser?.emailVerified && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                                                    Email Verified
                                                </span>
                                            )}
                                        </div>

                                        {/* Profile completion bar */}
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-sm text-gray-500 font-medium">Profile Completion</span>
                                                <span className="text-sm font-bold text-primary-maroon">{completion}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                <div
                                                    className="bg-gradient-to-r from-primary-maroon to-primary-gold h-2.5 rounded-full transition-all duration-500"
                                                    style={{ width: `${completion}%` }}
                                                />
                                            </div>
                                            {completion < 100 && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Complete your profile to get better matches!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            icon={<FaEdit />}
                                            onClick={() => navigate('/complete-profile')}
                                            className="bg-gradient-to-r from-primary-maroon to-primary-gold text-white border-0 hover:opacity-90 transition-all duration-300"
                                        >
                                            Edit Profile
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={() => navigate('/subscription')}
                                            icon={<FaCrown />}
                                            className="border-primary-gold/40 text-primary-maroon hover:bg-primary-cream"
                                        >
                                            Subscription
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* ── Detail Grid ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* About Me */}
                        <motion.div variants={itemVariants}>
                            <SectionCard icon={FaUser} title="About Me">
                                <InfoRow label="Age" value={personal.age ? `${personal.age} years` : null} />
                                <InfoRow label="Gender" value={personal.gender} />
                                <InfoRow label="Marital Status" value={personal.maritalStatus} />
                                <InfoRow label="Religion" value={personal.religion || community.religion} />
                                <InfoRow label="Caste" value={personal.caste || community.caste} />
                                <InfoRow label="Sub-caste" value={community.subCaste} />
                                <InfoRow label="Mother Tongue" value={getProfileMotherTongue(profile) || personal.motherTongue} />
                                <InfoRow label="Height" value={heightStr} />
                                <InfoRow label="Location" value={formatDisplayValue(personal.location)} />
                                {(personal.mobile || personal.phone) && (
                                    <InfoRow label="Mobile" value={personal.mobile || personal.phone} />
                                )}
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
                                <InfoRow label="Employment Type" value={education.employmentType} />
                                <InfoRow label="Annual Income" value={education.incomeRange} />
                                <InfoRow
                                    label="Work Location"
                                    value={
                                        education.workLocation ||
                                        (education.workCity || education.workCountry
                                            ? [education.workCity, education.workCountry].filter(Boolean).join(', ')
                                            : null)
                                    }
                                />
                            </SectionCard>
                        </motion.div>

                        {/* Family Details */}
                        <motion.div variants={itemVariants}>
                            <SectionCard icon={FaUsers} title="Family Details">
                                <InfoRow label="Father's Name" value={family.fatherName} />
                                <InfoRow label="Mother's Name" value={family.motherName} />
                                <InfoRow label="Father's Occupation" value={family.fatherOccupation} />
                                <InfoRow label="Mother's Occupation" value={family.motherOccupation} />
                                <InfoRow label="Siblings" value={family.siblings} />
                                <InfoRow label="Family Type" value={family.familyType} />
                                <InfoRow label="Family Status" value={family.familyStatus} />
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
                                <InfoRow label="Date of Birth" value={community.dateOfBirth} />
                                <InfoRow label="Time of Birth" value={community.timeOfBirth} />
                            </SectionCard>
                        </motion.div>

                        {/* Lifestyle – full width */}
                        <motion.div variants={itemVariants} className="lg:col-span-2">
                            <SectionCard icon={FaLeaf} title="Lifestyle & Habits">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <InfoRow label="Diet" value={lifestyle.diet} />
                                    <InfoRow label="Smoking" value={lifestyle.smoking} />
                                    <InfoRow label="Drinking" value={lifestyle.drinking} />
                                    <InfoRow label="Hobbies" value={lifestyle.hobbies} />
                                    <InfoRow label="Languages Known" value={lifestyle.languagesKnown} />
                                    <InfoRow label="Fitness Habits" value={lifestyle.fitnessHabits} />
                                </div>
                            </SectionCard>
                        </motion.div>

                        {/* Partner Preferences – full width (only if any data) */}
                        {(partnerPrefs.preferredAgeRange ||
                            partnerPrefs.preferredReligion ||
                            partnerPrefs.preferredLocation ||
                            partnerPrefs.additionalExpectations) && (
                                <motion.div variants={itemVariants} className="lg:col-span-2">
                                    <SectionCard icon={FaSearch} title="Partner Preferences">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <InfoRow label="Preferred Age" value={partnerPrefs.preferredAgeRange} />
                                            <InfoRow label="Preferred Height" value={partnerPrefs.preferredHeightRange} />
                                            <InfoRow label="Preferred Religion" value={partnerPrefs.preferredReligion} />
                                            <InfoRow label="Preferred Caste" value={partnerPrefs.preferredCaste} />
                                            <InfoRow label="Preferred Education" value={partnerPrefs.preferredEducation} />
                                            <InfoRow label="Preferred Occupation" value={partnerPrefs.preferredOccupation} />
                                            <InfoRow label="Preferred Location" value={partnerPrefs.preferredLocation} />
                                        </div>
                                        {partnerPrefs.additionalExpectations && (
                                            <div className="mt-6 pt-6 border-t border-primary-gold/20">
                                                <span className="text-gray-500 font-medium block mb-2 text-sm">
                                                    Additional expectations
                                                </span>
                                                <p className="text-gray-800 leading-relaxed">
                                                    {partnerPrefs.additionalExpectations}
                                                </p>
                                            </div>
                                        )}
                                    </SectionCard>
                                </motion.div>
                            )}
                    </div>
                </motion.div>
            </div>

            <Footer />

            {/* ── Photo Gallery Modal ── */}
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

export default MyProfilePage
