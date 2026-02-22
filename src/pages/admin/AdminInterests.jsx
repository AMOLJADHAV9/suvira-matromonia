import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUserProfile } from '../../services/auth'
import { fetchInterests, deleteInterest, suspendInterestSender, getInterestCounts } from '../../services/admin'

const AdminInterests = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [interests, setInterests] = useState([])
  const [counts, setCounts] = useState(null)
  const [profiles, setProfiles] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  const load = async () => {
    if (!currentUser?.uid) return
    setLoading(true)
    const [res, countsRes] = await Promise.all([
      fetchInterests(currentUser.uid, { statusFilter: statusFilter || null, limitCount: 100 }),
      getInterestCounts(currentUser.uid),
    ])
    if (res.success) {
      setInterests(res.data)
      const ids = new Set([...res.data.map((i) => i.senderId), ...res.data.map((i) => i.receiverId)])
      const map = {}
      for (const id of ids) {
        const p = await getUserProfile(id)
        if (p.success) map[id] = { id, ...p.data }
      }
      setProfiles(map)
    } else setError(res.error)
    if (countsRes.success) setCounts(countsRes.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [currentUser?.uid, statusFilter])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interest?')) return
    setActionLoading(id)
    setError(null)
    const res = await deleteInterest(currentUser.uid, id)
    if (res.success) load()
    else setError(res.error)
    setActionLoading(null)
  }

  const handleSuspendSender = async (senderId) => {
    if (!window.confirm('Suspend this user?')) return
    setActionLoading(`suspend-${senderId}`)
    setError(null)
    const res = await suspendInterestSender(currentUser.uid, senderId)
    if (res.success) load()
    else setError(res.error)
    setActionLoading(null)
  }

  const formatDate = (d) => {
    if (!d) return 'N/A'
    const t = d?.toDate ? d.toDate() : d
    return new Date(t).toLocaleString()
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-primary-maroon mb-6">Interest Monitoring</h2>

      {counts && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-primary-gold/20">
            <p className="text-2xl font-bold text-primary-maroon">{counts.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-amber-200">
            <p className="text-2xl font-bold text-amber-700">{counts.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <p className="text-2xl font-bold text-green-700">{counts.accepted}</p>
            <p className="text-sm text-gray-600">Accepted</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-2xl font-bold text-gray-700">{counts.rejected}</p>
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-xl"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700">{error}</div>}

      <div className="space-y-4">
        {interests.map((i) => (
          <div
            key={i.id}
            className={`bg-white rounded-xl p-4 border flex flex-wrap items-center gap-4 ${
              profiles[i.senderId]?.spamFlag ? 'border-red-300 bg-red-50/30' : 'border-primary-gold/20'
            }`}
          >
            {profiles[i.senderId]?.spamFlag && (
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Spam Flagged</span>
            )}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <span className="font-medium">{profiles[i.senderId]?.personal?.name || i.senderId}</span>
              <span className="text-gray-400">→</span>
              <span className="font-medium">{profiles[i.receiverId]?.personal?.name || i.receiverId}</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${
              i.status === 'accepted' ? 'bg-green-100 text-green-700' : i.status === 'rejected' ? 'bg-gray-100' : 'bg-amber-100'
            }`}>
              {i.status}
            </span>
            <span className="text-sm text-gray-500">{formatDate(i.createdAt)}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate(`/profile/${i.senderId}`)}
                className="text-sm text-primary-maroon hover:underline"
              >
                View Sender
              </button>
              <button
                type="button"
                onClick={() => navigate(`/profile/${i.receiverId}`)}
                className="text-sm text-primary-maroon hover:underline"
              >
                View Receiver
              </button>
              <button
                type="button"
                onClick={() => handleSuspendSender(i.senderId)}
                disabled={actionLoading === `suspend-${i.senderId}`}
                className="text-sm px-2 py-1 bg-amber-100 rounded hover:bg-amber-200"
              >
                Suspend Sender
              </button>
              <button
                type="button"
                onClick={() => handleDelete(i.id)}
                disabled={actionLoading === i.id}
                className="text-sm px-2 py-1 bg-red-100 text-red-700 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="mt-4 text-gray-500">Loading...</p>}
      {interests.length === 0 && !loading && <p className="mt-4 text-gray-500">No interests found.</p>}
    </div>
  )
}

export default AdminInterests
