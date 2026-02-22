import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchPremiumUsers, activatePremium, extendPremium, cancelPremium } from '../../services/admin'

const AdminPremium = () => {
  const { currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [extendMonths, setExtendMonths] = useState(1)
  const [activateUserId, setActivateUserId] = useState('')

  const load = async () => {
    if (!currentUser?.uid) return
    setLoading(true)
    const res = await fetchUsers(currentUser.uid, {
      pageSize: 100,
      filters: { isPremium: true },
    })
    if (res.success) setUsers(res.data)
    else setError(res.error)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [currentUser?.uid])

  const handleActivate = async (userId) => {
    setActionLoading(userId)
    const res = await activatePremium(currentUser.uid, userId, 'manual', 1)
    if (res.success) load()
    else setError(res.error)
    setActionLoading(null)
  }

  const handleExtend = async (userId) => {
    setActionLoading(userId)
    const res = await extendPremium(currentUser.uid, userId, extendMonths)
    if (res.success) load()
    else setError(res.error)
    setActionLoading(null)
  }

  const handleActivateById = async () => {
    if (!activateUserId.trim()) return
    setActionLoading('activate')
    const res = await activatePremium(currentUser.uid, activateUserId.trim(), 'manual', 1)
    if (res.success) {
      setActivateUserId('')
      load()
    } else setError(res.error)
    setActionLoading(null)
  }

  const handleCancel = async (userId) => {
    if (!window.confirm('Cancel premium for this user?')) return
    setActionLoading(userId)
    const res = await cancelPremium(currentUser.uid, userId)
    if (res.success) load()
    else setError(res.error)
    setActionLoading(null)
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-primary-maroon mb-6">Premium Management</h2>

      {error && <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700">{error}</div>}

      <div className="mb-6 p-4 bg-white rounded-xl border border-primary-gold/20">
        <p className="text-sm font-medium text-gray-700 mb-2">Activate Premium (manual)</p>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="User ID"
            value={activateUserId}
            onChange={(e) => setActivateUserId(e.target.value)}
            className="px-4 py-2 border rounded-xl flex-1 min-w-[200px]"
          />
          <button
            type="button"
            onClick={handleActivateById}
            disabled={actionLoading === 'activate' || !activateUserId.trim()}
            className="px-4 py-2 bg-primary-gold text-white rounded-xl font-medium"
          >
            Activate 1 Month
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="mr-2">Extend by (months):</label>
        <input
          type="number"
          min={1}
          value={extendMonths}
          onChange={(e) => setExtendMonths(Number(e.target.value) || 1)}
          className="w-20 px-2 py-1 border rounded"
        />
      </div>

      <div className="space-y-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white rounded-xl p-4 border border-primary-gold/20 flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <p className="font-medium">{u.personal?.name || u.email}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
              {u.subscription?.expiryDate && (
                <p className="text-xs text-gray-400">
                  Expires: {u.subscription?.expiryDate?.toDate ? u.subscription.expiryDate.toDate().toLocaleDateString() : 'N/A'}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleExtend(u.id)}
                disabled={actionLoading === u.id}
                className="px-3 py-1 bg-primary-gold/20 rounded text-sm"
              >
                Extend
              </button>
              <button
                type="button"
                onClick={() => handleCancel(u.id)}
                disabled={actionLoading === u.id}
                className="px-3 py-1 bg-red-100 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <p className="text-gray-500">No premium users.</p>
      )}
      {loading && <p className="mt-4 text-gray-500">Loading...</p>}
    </div>
  )
}

export default AdminPremium
