import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEllipsisV } from 'react-icons/fa'

const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    success: 'bg-green-50 text-green-700 border-green-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-red-50 text-red-700 border-red-100',
    default: 'bg-gray-50 text-gray-700 border-gray-200',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded border ${styles[variant]}`}>
      {children}
    </span>
  )
}

const ActionsDropdown = ({ user, currentUserId, onAction, actionLoading }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  const isSelf = user.id === currentUserId
  const isVerified = user.emailVerified || user.isVerified
  const isSuspended = user.isSuspended
  const profileStatus = user.profileStatus || 'pending'

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
      >
        <FaEllipsisV className="text-sm" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20">
          <button
            type="button"
            onClick={() => { onAction('view', user.id); setOpen(false) }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            View Profile
          </button>
          {!isVerified && (
            <button
              type="button"
              onClick={() => { onAction('verify', user.id); setOpen(false) }}
              disabled={actionLoading === user.id}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Mark Verified
            </button>
          )}
          {isSuspended ? (
            <button
              type="button"
              onClick={() => { onAction('activate', user.id); setOpen(false) }}
              disabled={actionLoading === user.id}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Activate User
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { onAction('suspend', user.id); setOpen(false) }}
              disabled={actionLoading === user.id || isSelf}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Suspend User
            </button>
          )}
          <button
            type="button"
            onClick={() => { onAction('interests', user.id); setOpen(false) }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            View Interests
          </button>
          <button
            type="button"
            onClick={() => { onAction('reports', user.id); setOpen(false) }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            View Reports
          </button>
          <button
            type="button"
            onClick={() => { onAction('delete', user.id); setOpen(false) }}
            disabled={actionLoading === user.id || isSelf}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete User
          </button>
        </div>
      )}
    </div>
  )
}

const UsersTable = ({ users, currentUserId, onAction, actionLoading, formatDate }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono text-gray-500">{u.id?.slice(0, 8)}...</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/profile/${u.id}`)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    {u.personal?.name || u.email || '—'}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 capitalize">{(u.personal?.gender || '—').toLowerCase()}</td>
                <td className="px-4 py-3">
                  <Badge variant={u.emailVerified || u.isVerified ? 'success' : 'default'}>
                    {u.emailVerified || u.isVerified ? 'Yes' : 'No'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={u.role === 'premium_user' || u.isPremium ? 'warning' : 'default'}>
                    {u.role === 'premium_user' || u.isPremium ? 'Yes' : 'No'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={u.isSuspended ? 'danger' : 'success'}>
                    {u.isSuspended ? 'Suspended' : 'Active'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={
                    (u.profileStatus || 'pending') === 'approved' ? 'success' :
                    (u.profileStatus || 'pending') === 'rejected' ? 'default' : 'warning'
                  }>
                    {u.profileStatus || 'pending'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <ActionsDropdown user={u} currentUserId={currentUserId} onAction={onAction} actionLoading={actionLoading} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsersTable
