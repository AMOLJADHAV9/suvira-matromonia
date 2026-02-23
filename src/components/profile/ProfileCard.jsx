import React from 'react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../ui/GlassCard'
import Button from '../ui/Button'
import { getProfilePhotoUrl, getProfileEducation, getProfileOccupation, isProfileVerified } from '../../services/profiles'
import { FaHeart, FaEye } from 'react-icons/fa'

/**
 * Reusable profile card with glassmorphism, Verified badge, maroon-gold theme
 */
const ProfileCard = ({ profile, compact = false, showActions = true }) => {
  const navigate = useNavigate()
  const photoUrl = getProfilePhotoUrl(profile)
  const verified = isProfileVerified(profile)

  const imageSection = (
    <div className="relative w-full h-64 bg-gradient-to-br from-primary-maroon to-primary-gold flex items-center justify-center overflow-hidden rounded-t-2xl">
      {photoUrl ? (
        <img src={photoUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="text-white text-6xl font-serif">
          {profile.personal?.name?.charAt(0) || '?'}
        </span>
      )}
      {verified && (
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-primary-maroon px-2.5 py-1 rounded-full text-xs font-semibold shadow-soft flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Verified
        </div>
      )}
    </div>
  )

  const infoSection = (
    <div className={compact ? 'p-3' : 'p-4'}>
      <h3 className="text-lg font-semibold text-primary-maroon">
        {profile.personal?.name || 'Profile'}
      </h3>
      <p className="text-gray-600 text-sm mt-1">
        {profile.personal?.age && `${profile.personal.age} yrs`}
        {profile.personal?.location && ` • ${profile.personal.location}`}
      </p>
      {!compact && (
        <div className="space-y-1 mt-3 text-sm text-gray-600">
          {profile.personal?.religion && (
            <div>Religion: <span className="font-medium">{profile.personal.religion}</span></div>
          )}
          {profile.personal?.caste && (
            <div>Caste: <span className="font-medium">{profile.personal.caste}</span></div>
          )}
          {getProfileEducation(profile) && (
            <div>Education: <span className="font-medium">{getProfileEducation(profile)}</span></div>
          )}
          {getProfileOccupation(profile) && (
            <div>Occupation: <span className="font-medium">{getProfileOccupation(profile)}</span></div>
          )}
        </div>
      )}
      {showActions && (
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => { e.stopPropagation(); navigate(`/profile/${profile.id}`) }}
            icon={<FaEye />}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={(e) => { e.stopPropagation(); navigate(`/profile/${profile.id}`) }}
            icon={<FaHeart />}
          >
            Interest
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <GlassCard
      padding="p-0"
      className={`overflow-hidden ${showActions ? '' : 'cursor-pointer'}`}
      onClick={!showActions ? () => navigate(`/profile/${profile.id}`) : undefined}
    >
      {imageSection}
      {infoSection}
    </GlassCard>
  )
}

export default ProfileCard
