import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getUserProfile } from '../services/auth'
import { getProfilePhotoUrl } from '../services/profiles'
import {
  getIncomingInterests,
  getSentInterests,
  updateInterestStatus,
} from '../services/interests'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import { FaHeart, FaUser, FaCheck, FaTimes, FaInbox, FaPaperPlane } from 'react-icons/fa'

const STATUS_BADGE = {
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  accepted: { label: 'Accepted', className: 'bg-green-100 text-green-800 border-green-200' },
  rejected: { label: 'Rejected', className: 'bg-gray-100 text-gray-600 border-gray-200' },
}

const InterestCard = ({ interest, profile, type, onAccept, onReject, loading }) => {
  const navigate = useNavigate()
  const photoUrl = getProfilePhotoUrl(profile)
  const statusBadge = STATUS_BADGE[interest.status] || STATUS_BADGE.pending

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-5 border border-primary-gold/30 shadow-premium hover:shadow-glow transition-shadow flex flex-col sm:flex-row gap-4 items-center"
    >
      <div
        className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary-maroon/20 to-primary-gold/20 flex-shrink-0 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/profile/${profile?.id}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate(`/profile/${profile?.id}`)}
      >
        {photoUrl ? (
          <img src={photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-serif text-primary-maroon">
            {profile?.personal?.name?.charAt(0) || '?'}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-serif font-semibold text-primary-maroon text-lg">
            {profile?.personal?.name || 'Profile'}
          </h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusBadge.className}`}>
            {statusBadge.label}
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          {profile?.personal?.age && `${profile.personal.age} yrs`}
          {profile?.personal?.location && ` • ${profile.personal.location}`}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/profile/${profile?.id}`)}
        >
          View Profile
        </Button>
        {type === 'incoming' && interest.status === 'pending' && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAccept(interest.id)}
              loading={loading}
              disabled={loading}
              icon={<FaCheck />}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(interest.id)}
              disabled={loading}
              icon={<FaTimes />}
            >
              Reject
            </Button>
          </>
        )}
        {type === 'sent' && interest.status === 'accepted' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/chat/${profile?.id}`)}
            icon={<FaHeart />}
          >
            Message
          </Button>
        )}
      </div>
    </motion.div>
  )
}

const InterestPage = () => {
  const { currentUser, isPremiumUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('incoming')
  const [incoming, setIncoming] = useState([])
  const [sent, setSent] = useState([])
  const [profiles, setProfiles] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchProfiles = async (ids) => {
    const map = {}
    await Promise.all(
      ids.map(async (id) => {
        const res = await getUserProfile(id)
        if (res.success) map[id] = { id, ...res.data }
      })
    )
    setProfiles((prev) => ({ ...prev, ...map }))
  }

  const loadInterests = async () => {
    if (!currentUser?.uid) return
    setLoading(true)
    setError(null)
    try {
      const [inc, snt] = await Promise.all([
        getIncomingInterests(currentUser.uid),
        getSentInterests(currentUser.uid),
      ])
      if (inc.success) setIncoming(inc.data)
      else setError(inc.error)
      if (snt.success) setSent(snt.data)
      else if (!error) setError(snt.error)

      const ids = new Set([
        ...inc.data?.map((i) => i.senderId) || [],
        ...snt.data?.map((i) => i.receiverId) || [],
      ])
      await fetchProfiles([...ids])
    } catch (err) {
      setError(err?.message || 'Failed to load interests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInterests()
  }, [currentUser?.uid])

  const handleAccept = async (interestId) => {
    setActionLoading(interestId)
    const res = await updateInterestStatus(interestId, currentUser.uid, 'accepted')
    if (res.success) await loadInterests()
    setActionLoading(null)
  }

  const handleReject = async (interestId) => {
    setActionLoading(interestId)
    const res = await updateInterestStatus(interestId, currentUser.uid, 'rejected')
    if (res.success) await loadInterests()
    setActionLoading(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-cream to-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-serif font-bold text-primary-maroon mb-2">
          My Interests
        </h1>
        <p className="text-gray-600 mb-8">
          Manage incoming and sent interests
        </p>

        <div className="flex gap-2 mb-6 border-b border-primary-gold/20">
          <button
            type="button"
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activeTab === 'incoming'
                ? 'bg-white border border-primary-gold/20 border-b-0 text-primary-maroon'
                : 'text-gray-600 hover:text-primary-maroon'
            }`}
          >
            <FaInbox className="inline mr-2" /> Incoming ({incoming.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activeTab === 'sent'
                ? 'bg-white border border-primary-gold/20 border-b-0 text-primary-maroon'
                : 'text-gray-600 hover:text-primary-maroon'
            }`}
          >
            <FaPaperPlane className="inline mr-2" /> Sent ({sent.length})
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-full border-4 border-primary-gold/30 border-t-primary-gold animate-spin" />
            <p className="mt-4 text-gray-600">Loading interests...</p>
          </div>
        ) : activeTab === 'incoming' ? (
          <div className="space-y-4">
            {incoming.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-primary-gold/20">
                <FaInbox className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No incoming interests yet</p>
              </div>
            ) : (
              incoming.map((i) => (
                <InterestCard
                  key={i.id}
                  interest={i}
                  profile={profiles[i.senderId]}
                  type="incoming"
                  onAccept={handleAccept}
                  onReject={handleReject}
                  loading={actionLoading === i.id}
                />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sent.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-primary-gold/20">
                <FaPaperPlane className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No sent interests yet</p>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => navigate('/search')}
                >
                  Find Matches
                </Button>
              </div>
            ) : (
              sent.map((i) => (
                <InterestCard
                  key={i.id}
                  interest={i}
                  profile={profiles[i.receiverId]}
                  type="sent"
                  loading={false}
                />
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default InterestPage
