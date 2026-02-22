import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  fetchUsers,
  getUserDetailsForAdmin,
  suspendUser,
  activateUser,
  deleteUser,
  verifyUser,
  updateProfileStatus,
} from '../../services/admin'

const AdminUsers = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})
  const [lastDoc, setLastDoc] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [viewUser, setViewUser] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)

  const loadUsers = async (append = false) => {
    if (!currentUser?.uid) return
    setLoading(true)
    setError(null)
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    )
    const res = await fetchUsers(currentUser.uid, {
      pageSize: 20,
      startAfterDoc: append ? lastDoc : null,
      search: search || undefined,
      filters: Object.keys(cleanFilters).length ? cleanFilters : undefined,
    })
    if (res.success) {
      setUsers(append ? (prev) => [...prev, ...res.data] : res.data)
      setLastDoc(res.lastDoc)
    } else setError(res.error)
    setLoading(false)
  }

  useEffect(() => {
    loadUsers()
  }, [currentUser?.uid, search, JSON.stringify(filters)])

  const handleViewProfile = async (userId) => {
    setViewLoading(true)
    setViewUser(null)
    const res = await getUserDetailsForAdmin(currentUser.uid, userId)
    setViewLoading(false)
    if (res.success) setViewUser(res.data)
    else setError(res.error)
  }

  const handleAction = async (action, userId, extra = {}) => {
    setActionLoading(userId)
    setError(null)
    let res
    switch (action) {
      case 'suspend':
        res = await suspendUser(currentUser.uid, userId)
        break
      case 'activate':
        res = await activateUser(currentUser.uid, userId)
        break
      case 'delete':
        if (!window.confirm('Permanently delete this user and all their data?')) {
          setActionLoading(null)
          return
        }
        res = await deleteUser(currentUser.uid, userId)
        break
      case 'verify':
        res = await verifyUser(currentUser.uid, userId)
        break
      case 'approve':
        res = await updateProfileStatus(currentUser.uid, userId, 'approved')
        break
      case 'reject':
        res = await updateProfileStatus(currentUser.uid, userId, 'rejected', extra.rejectionReason || '')
        break
      default:
        setActionLoading(null)
        return
    }
    if (res.success) {
      loadUsers()
      if (viewUser?.id === userId) setViewUser(null)
    } else setError(res.error)
    setActionLoading(null)
  }

  const formatDate = (d) => {
    if (!d) return 'N/A'
    const t = d?.toDate ? d.toDate() : d
    return new Date(t).toLocaleDateString()
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-primary-maroon mb-6">User Management</h2>
      <p className="text-gray-600 mb-4">
        Total users in table: <strong>{users.length}</strong>
        {lastDoc && ' (showing current page)'}
      </p>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, Profile ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-xl flex-1 min-w-[200px]"
        />
        <select
          value={filters.profileStatus || ''}
          onChange={(e) => setFilters((f) => ({ ...f, profileStatus: e.target.value || undefined }))}
          className="px-4 py-2 border rounded-xl"
        >
          <option value="">All Profile Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={filters.gender || ''}
          onChange={(e) => setFilters((f) => ({ ...f, gender: e.target.value || undefined }))}
          className="px-4 py-2 border rounded-xl"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select
          value={filters.isVerified === true ? '1' : filters.isVerified === false ? '0' : ''}
          onChange={(e) => {
            const v = e.target.value
            setFilters((f) => ({ ...f, isVerified: v === '' ? undefined : v === '1' }))
          }}
          className="px-4 py-2 border rounded-xl"
        >
          <option value="">All Verified</option>
          <option value="1">Verified</option>
          <option value="0">Not Verified</option>
        </select>
        <select
          value={filters.isPremium === true ? '1' : filters.isPremium === false ? '0' : ''}
          onChange={(e) => {
            const v = e.target.value
            setFilters((f) => ({ ...f, isPremium: v === '' ? undefined : v === '1' }))
          }}
          className="px-4 py-2 border rounded-xl"
        >
          <option value="">All Premium</option>
          <option value="1">Premium</option>
          <option value="0">Free</option>
        </select>
        <select
          value={filters.isSuspended === true ? '1' : filters.isSuspended === false ? '0' : ''}
          onChange={(e) => {
            const v = e.target.value
            setFilters((f) => ({ ...f, isSuspended: v === '' ? undefined : v === '1' }))
          }}
          className="px-4 py-2 border rounded-xl"
        >
          <option value="">All Status</option>
          <option value="0">Active</option>
          <option value="1">Suspended</option>
        </select>
      </div>

      {error && <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-primary-gold/20 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary-gold/20 bg-gray-50">
              <th className="text-left p-4">Profile ID</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Gender</th>
              <th className="text-left p-4">Verified</th>
              <th className="text-left p-4">Premium</th>
              <th className="text-left p-4">Account</th>
              <th className="text-left p-4">Profile Status</th>
              <th className="text-left p-4">Created</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-mono text-sm">{u.id?.slice(0, 8)}...</td>
                <td className="p-4">{u.personal?.name || u.email || '—'}</td>
                <td className="p-4 capitalize">{(u.personal?.gender || '—').toLowerCase()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${u.emailVerified || u.isVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {u.emailVerified || u.isVerified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${u.role === 'premium_user' || u.isPremium ? 'bg-amber-100 text-amber-800' : 'bg-gray-100'}`}>
                    {u.role === 'premium_user' || u.isPremium ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${u.isSuspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {u.isSuspended ? 'Suspended' : 'Active'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    (u.profileStatus || 'pending') === 'approved' ? 'bg-green-100 text-green-700' :
                    (u.profileStatus || 'pending') === 'rejected' ? 'bg-gray-100' : 'bg-amber-100'
                  }`}>
                    {u.profileStatus || 'pending'}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600">{formatDate(u.createdAt)}</td>
                <td className="p-4 flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => handleViewProfile(u.id)}
                    className="text-sm text-primary-maroon hover:underline"
                  >
                    View
                  </button>
                  {u.isSuspended ? (
                    <button
                      type="button"
                      onClick={() => handleAction('activate', u.id)}
                      disabled={actionLoading === u.id}
                      className="text-sm px-2 py-1 bg-green-100 rounded hover:bg-green-200"
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAction('suspend', u.id)}
                      disabled={actionLoading === u.id || u.id === currentUser.uid}
                      className="text-sm px-2 py-1 bg-amber-100 rounded hover:bg-amber-200"
                    >
                      Suspend
                    </button>
                  )}
                  {(u.profileStatus || 'pending') === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAction('approve', u.id)}
                        disabled={actionLoading === u.id}
                        className="text-sm px-2 py-1 bg-green-100 rounded"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const reason = window.prompt('Rejection reason (optional):')
                          handleAction('reject', u.id, { rejectionReason: reason || '' })
                        }}
                        disabled={actionLoading === u.id}
                        className="text-sm px-2 py-1 bg-gray-100 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {!u.emailVerified && !u.isVerified && (
                    <button
                      type="button"
                      onClick={() => handleAction('verify', u.id)}
                      disabled={actionLoading === u.id}
                      className="text-sm px-2 py-1 bg-blue-100 rounded"
                    >
                      Verify
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleAction('delete', u.id)}
                    disabled={actionLoading === u.id || u.id === currentUser.uid}
                    className="text-sm px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length >= 20 && lastDoc && !Object.values(filters).some((v) => v !== undefined && v !== '') && (
        <button
          type="button"
          onClick={() => loadUsers(true)}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-primary-maroon text-white rounded-xl hover:bg-primary-maroon/90"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}

      {users.length === 0 && !loading && <p className="mt-4 text-gray-500">No users found.</p>}
      {loading && users.length === 0 && <p className="mt-4 text-gray-500">Loading...</p>}

      {/* View Profile Modal */}
      {viewLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="animate-spin w-12 h-12 border-2 border-primary-gold border-t-transparent rounded-full mx-auto" />
            <p className="text-center mt-4">Loading user details...</p>
          </div>
        </div>
      )}

      {viewUser && !viewLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewUser(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-primary-maroon">User Details</h3>
              <button type="button" onClick={() => setViewUser(null)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <p><strong>Profile ID:</strong> {viewUser.id}</p>
              <p><strong>Name:</strong> {viewUser.personal?.name || '—'}</p>
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>Gender:</strong> {viewUser.personal?.gender || '—'}</p>
              <p><strong>Interest Count:</strong> {viewUser.interestCount ?? '—'}</p>
              <p><strong>Reports Count:</strong> {viewUser.reportsCount ?? '—'}</p>
              <p><strong>Last Active:</strong> {viewUser.lastActive ? formatDate(viewUser.lastActive) : 'N/A'}</p>
              <p><strong>Profile Status:</strong> {viewUser.profileStatus || 'pending'}</p>
              <p><strong>Account:</strong> {viewUser.isSuspended ? 'Suspended' : 'Active'}</p>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => navigate(`/profile/${viewUser.id}`)}
                className="px-4 py-2 bg-primary-maroon text-white rounded-xl"
              >
                View Full Profile
              </button>
              <button type="button" onClick={() => setViewUser(null)} className="px-4 py-2 border rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
