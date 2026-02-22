import React from 'react'

const FiltersSection = ({ search, onSearchChange, filters, onFilterChange }) => (
  <div className="mb-6 flex flex-wrap gap-3 items-end">
    <div className="flex-1 min-w-[200px]">
      <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
      <input
        type="text"
        placeholder="Search by name, email, or uid..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
      <select
        value={filters.gender || ''}
        onChange={(e) => onFilterChange('gender', e.target.value || undefined)}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Verified</label>
      <select
        value={filters.isVerified === true ? '1' : filters.isVerified === false ? '0' : ''}
        onChange={(e) => onFilterChange('isVerified', e.target.value === '' ? undefined : e.target.value === '1')}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All</option>
        <option value="1">Verified</option>
        <option value="0">Not Verified</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Premium</label>
      <select
        value={filters.isPremium === true ? '1' : filters.isPremium === false ? '0' : ''}
        onChange={(e) => onFilterChange('isPremium', e.target.value === '' ? undefined : e.target.value === '1')}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All</option>
        <option value="1">Premium</option>
        <option value="0">Free</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
      <select
        value={filters.isSuspended === true ? '1' : filters.isSuspended === false ? '0' : ''}
        onChange={(e) => onFilterChange('isSuspended', e.target.value === '' ? undefined : e.target.value === '1')}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All</option>
        <option value="0">Active</option>
        <option value="1">Suspended</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Status</label>
      <select
        value={filters.profileStatus || ''}
        onChange={(e) => onFilterChange('profileStatus', e.target.value || undefined)}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  </div>
)

export default FiltersSection
