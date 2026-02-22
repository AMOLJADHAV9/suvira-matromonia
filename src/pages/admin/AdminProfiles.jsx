import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchUsers, updateProfileStatus, suspendUser } from '../../services/admin'

const AdminProfiles = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  const load = async () => {
    if (!currentUser?.uid) return
    setLoading(true)
    const res = await fetchUsers(currentUser.uid, {
      pageSize: 100,
      filters: { profileStatus: 'pending' },
    })
    if (res.success) setUsers(res.data)
    else setError(res.error)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [currentUser?.uid])

  const handleStatus = async (userId, status, extra = {}) => {
    setActionLoading(userId)
    setError(null)
    let res
    if (status === 'approved') {
      res = await updateProfileStatus(currentUser.uid, userId, 'approved')
    } else if (status === 'rejected') {
      res = await updateProfileStatus(currentUser.uid, userId, 'rejected', extra.rejectionReason || '')
    } else if (status === 'disable') {
      res = await suspendUser(currentUser.uid, userId)
    }
    if (res?.success) load()
    else if (res) setError(res.error)
    setActionLoading(null)
  }

  const handleRejectWithReason = (userId) => {
    const reason = window.prompt('Rejection reason (required for audit):', '')
    if (reason !== null) handleStatus(userId, 'rejected', { rejectionReason: reason })
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-primary-maroon mb-6">Profile Approvals</h2>
      <p className="text-gray-600 mb-4">Only profiles with status &quot;pending&quot; are shown. Approve to make them visible in Search/Dashboard. Reject with a reason for audit.</p>

      {error && <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700">{error}</div>}

      <div className="space-y-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white rounded-xl p-4 border border-primary-gold/20 flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <p className="font-medium">{u.personal?.name || u.email}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
              <p className="text-xs text-gray-400 mt-1">ID: {u.id}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => navigate(`/profile/${u.id}`)}
                className="text-sm text-primary-maroon hover:underline"
              >
                View Profile
              </button>
              <button
                type="button"
                onClick={() => handleStatus(u.id, 'approved')}
                disabled={actionLoading === u.id}
                className="px-3 py-1 bg-green-100 rounded text-sm hover:bg-green-200"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => handleRejectWithReason(u.id)}
                disabled={actionLoading === u.id}
                className="px-3 py-1 bg-red-100 rounded text-sm hover:bg-red-200"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleStatus(u.id, 'disable')}
                disabled={actionLoading === u.id}
                className="px-3 py-1 bg-amber-100 rounded text-sm hover:bg-amber-200"
              >
                Disable (Suspend)
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <p className="text-gray-500">No pending profiles.</p>
      )}
      {loading && <p className="mt-4 text-gray-500">Loading...</p>}
    </div>
  )
}

export default AdminProfiles
