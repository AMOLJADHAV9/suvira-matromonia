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
    <div
      className={`relative w-full overflow-hidden rounded-t-2xl bg-gray-100 ${
        compact ? 'h-72' : 'aspect-[4/5]'
      }`}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={profile.personal?.name || 'Profile photo'}
          className="w-full h-full object-cover object-top"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-maroon to-primary-gold">
          <span className="text-white text-6xl font-serif">
            {profile.personal?.name?.charAt(0) || '?'}
          </span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
      {verified && (
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-primary-maroon px-2.5 py-1 rounded-full text-xs font-semibold shadow-soft flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Verified
        </div>
      )}
    </div>
  )

  const infoSection = (
    <div
      className={`profile-content flex-1 flex flex-col ${
        compact ? 'px-4 py-3' : 'p-4 md:p-5'
      }`}
    >
      <h3
        className={`profile-name font-semibold text-primary-maroon ${
          compact ? 'text-base' : 'text-lg'
        }`}
      >
        {profile.personal?.name || 'Profile'}
      </h3>
      <p
        className={`profile-meta text-gray-600 mt-1 ${
          compact ? 'text-[13px]' : 'text-sm'
        }`}
      >
        {profile.personal?.age ? `${profile.personal.age} yrs` : 'N/A'}
        {' • '}
        {profile.personal?.location || 'N/A'}
      </p>
      {!compact && (
        <div className="space-y-1 mt-3 text-sm text-gray-600">
          <div>Religion: <span className="font-medium">{profile.personal?.religion || 'N/A'}</span></div>
          <div>Caste: <span className="font-medium">{profile.personal?.caste || 'N/A'}</span></div>
          <div>Education: <span className="font-medium">{getProfileEducation(profile) || 'N/A'}</span></div>
          <div>Occupation: <span className="font-medium">{getProfileOccupation(profile) || 'N/A'}</span></div>
        </div>
      )}
      {showActions && (
        <div className="profile-actions flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 ${compact ? 'py-2 px-3 text-[13px]' : ''}`}
            onClick={(e) => { e.stopPropagation(); navigate(`/profile/${profile.id}`) }}
            icon={<FaEye />}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className={`flex-1 ${compact ? 'py-2 px-3 text-[13px]' : ''}`}
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
      className={`overflow-hidden group h-full ${showActions ? '' : 'cursor-pointer'}`}
      onClick={!showActions ? () => navigate(`/profile/${profile.id}`) : undefined}
    >
      <div className="flex flex-col h-full bg-white">
        {imageSection}
        {infoSection}
      </div>
    </GlassCard>
  )
}

export default ProfileCard
