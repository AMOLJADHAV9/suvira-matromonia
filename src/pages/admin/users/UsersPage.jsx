import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import {
  fetchUsers,
  suspendUser,
  activateUser,
  deleteUser,
  verifyUser,
} from '../../../services/admin'
import FiltersSection from './FiltersSection'
import UsersTable from './UsersTable'
import PaginationControls from './PaginationControls'
import Toast from '../../../components/ui/Toast'

const PAGE_SIZE = 10

const UsersPage = () => {
  const navigate = useNavigate()
  const { currentUser, isRole, loading: authLoading } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})
  const [lastDoc, setLastDoc] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [toast, setToast] = useState(null)

  const isAdmin = isRole?.('admin') ?? false

  useEffect(() => {
    if (!authLoading && currentUser && !isAdmin) {
      navigate('/', { replace: true })
    }
  }, [authLoading, currentUser, isAdmin, navigate])

  const loadUsers = async (append = false) => {
    if (!currentUser?.uid) return
    setLoading(true)
    setError(null)
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    )
    const res = await fetchUsers(currentUser.uid, {
      pageSize: PAGE_SIZE,
      startAfterDoc: append ? lastDoc : null,
      search: search || undefined,
      filters: Object.keys(cleanFilters).length ? cleanFilters : undefined,
    })
    if (res.success) {
      setUsers(append ? (prev) => [...prev, ...res.data] : res.data)
      setLastDoc(res.lastDoc)
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (currentUser?.uid && isAdmin) {
      loadUsers()
    }
  }, [currentUser?.uid, isAdmin, search, JSON.stringify(filters)])

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  const handleAction = async (action, userId) => {
    if (!currentUser?.uid) return
    setActionLoading(userId)
    setError(null)
    let res
    switch (action) {
      case 'view':
        navigate(`/profile/${userId}`)
        setActionLoading(null)
        return
      case 'interests':
        navigate('/admin/interests')
        setActionLoading(null)
        return
      case 'reports':
        navigate('/admin/reports')
        setActionLoading(null)
        return
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
      default:
        setActionLoading(null)
        return
    }
    if (res?.success) {
      loadUsers()
      setToast({ message: 'Action completed successfully', type: 'success' })
    } else if (res?.error) {
      setError(res.error)
      setToast({ message: res.error, type: 'error' })
    }
    setActionLoading(null)
  }

  const formatDate = (d) => {
    if (!d) return '—'
    const t = d?.toDate ? d.toDate() : d
    return new Date(t).toLocaleDateString()
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== '')
  const showLoadMore = users.length >= PAGE_SIZE && lastDoc && !hasActiveFilters && !search?.trim()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentUser || !isAdmin) {
    return null
  }

  return (
    <div>
        <h1 className="text-xl font-semibold text-gray-800 mb-1">Users</h1>
        <p className="text-sm text-gray-500 mb-6">Manage registered users</p>

        <FiltersSection
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && users.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-500">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-500">No users found.</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search.</p>
          </div>
        ) : (
          <>
            <UsersTable
              users={users}
              currentUserId={currentUser.uid}
              onAction={handleAction}
              actionLoading={actionLoading}
              formatDate={formatDate}
            />
            <PaginationControls hasMore={showLoadMore} loading={loading} onLoadMore={() => loadUsers(true)} />
          </>
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
    </div>
  )
}

export default UsersPage
