import React from 'react'

const PaginationControls = ({ hasMore, loading, onLoadMore }) => {
  if (!hasMore) return null

  return (
    <div className="mt-6 flex justify-center">
      <button
        type="button"
        onClick={onLoadMore}
        disabled={loading}
        className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  )
}

export default PaginationControls
