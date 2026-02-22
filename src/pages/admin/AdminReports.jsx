import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUserProfile } from '../../services/auth'
import {
  fetchReports,
  resolveReport,
  suspendReportedUser,
  warnUser,
  deleteReportedUser,
  getHighSeverityReportCount,
} from '../../services/admin'
import { REPORT_SEVERITY, HIGH_SEVERITY_REVIEW_THRESHOLD } from '../../utils/adminConstants'

const AdminReports = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [profiles, setProfiles] = useState({})
  const [highSeverityCounts, setHighSeverityCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  const load = async () => {
    if (!currentUser?.uid) return
    setLoading(true)
    const res = await fetchReports(currentUser.uid, {
      statusFilter: statusFilter || null,
      limitCount: 100,
    })
    if (res.success) {
      setReports(res.data)
      const ids = new Set([...res.data.map((r) => r.reportedUserId), ...res.data.map((r) => r.reportedBy)])
      const map = {}
      const highCounts = {}
      for (const id of ids) {
        const p = await getUserProfile(id)
        if (p.success) map[id] = { id, ...p.data }
        const count = await getHighSeverityReportCount(id)
        if (count >= HIGH_SEVERITY_REVIEW_THRESHOLD) highCounts[id] = count
      }
      setProfiles(map)
      setHighSeverityCounts(highCounts)
    } else setError(res.error)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [currentUser?.uid, statusFilter])

  const handleResolve = async (id) => {
    setActionLoading(id)
    setError(null)
    const res = await resolveReport(currentUser.uid, id)
    if (res.success) load()
    else setError(res.error)
    setActionLoading(null)
  }

  const handleSuspend = async (userId) => {
    setActionLoading(userId)
    setError(null)
    const res = await suspendReportedUser(currentUser.uid, userId)
    if (res.success) load()
    else setError(res.error)
    setActionLoading(null)
  }

  const handleWarn = async (userId) => {
    setActionLoading(`warn-${userId}`)
    setError(null)
    const res = await warnUser(currentUser.uid, userId)
    if (res.success) load()
    else setError(res.error)
    setActionLoading(null)
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Permanently delete this user and all their data?')) return
    setActionLoading(`del-${userId}`)
    setError(null)
    const res = await deleteReportedUser(currentUser.uid, userId)
    if (res.success) load()
    else setError(res.error)
    setActionLoading(null)
  }

  const severityBadge = (s) => {
    const cls = s === REPORT_SEVERITY.HIGH ? 'bg-red-100 text-red-700' : s === REPORT_SEVERITY.MEDIUM ? 'bg-amber-100 text-amber-800' : 'bg-gray-100'
    return <span className={`px-2 py-0.5 rounded text-xs ${cls}`}>{s || 'medium'}</span>
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-primary-maroon mb-6">Reports & Complaints</h2>
      <p className="text-gray-600 mb-4">Users with 3+ high-severity reports are flagged for review.</p>

      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-xl"
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {error && <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700">{error}</div>}

      <div className="space-y-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className={`bg-white rounded-xl p-4 border ${
              highSeverityCounts[r.reportedUserId] ? 'border-red-300 bg-red-50/30' : 'border-primary-gold/20'
            }`}
          >
            {highSeverityCounts[r.reportedUserId] && (
              <div className="mb-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">
                ⚠ Flagged for review: {highSeverityCounts[r.reportedUserId]} high-severity reports
              </div>
            )}
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p>
                  <strong>Reported:</strong>{' '}
                  <button
                    type="button"
                    onClick={() => navigate(`/profile/${r.reportedUserId}`)}
                    className="text-primary-maroon hover:underline"
                  >
                    {profiles[r.reportedUserId]?.personal?.name || r.reportedUserId}
                  </button>
                </p>
                <p><strong>By:</strong> {profiles[r.reportedBy]?.personal?.name || r.reportedBy}</p>
                <p><strong>Reason:</strong> {r.reason}</p>
                {r.description && <p className="text-gray-600 mt-1">{r.description}</p>}
                <div className="flex gap-2 mt-2 items-center">
                  {severityBadge(r.severity)}
                  <span className={`px-2 py-1 rounded text-xs ${r.status === 'open' ? 'bg-amber-100' : 'bg-green-100'}`}>
                    {r.status}
                  </span>
                </div>
              </div>
              {r.status === 'open' && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/profile/${r.reportedUserId}`)}
                    className="px-3 py-1 bg-primary-maroon text-white rounded text-sm"
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSuspend(r.reportedUserId)}
                    disabled={actionLoading === r.reportedUserId}
                    className="px-3 py-1 bg-amber-100 rounded text-sm"
                  >
                    Suspend User
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWarn(r.reportedUserId)}
                    disabled={actionLoading === `warn-${r.reportedUserId}`}
                    className="px-3 py-1 bg-yellow-100 rounded text-sm"
                  >
                    Warn User
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(r.reportedUserId)}
                    disabled={actionLoading === `del-${r.reportedUserId}`}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
                  >
                    Delete Account
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolve(r.id)}
                    disabled={actionLoading === r.id}
                    className="px-3 py-1 bg-green-100 rounded text-sm"
                  >
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="mt-4 text-gray-500">Loading...</p>}
      {reports.length === 0 && !loading && <p className="mt-4 text-gray-500">No reports found.</p>}
    </div>
  )
}

export default AdminReports
