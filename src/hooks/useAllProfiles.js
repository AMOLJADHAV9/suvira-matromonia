import { useState, useEffect, useCallback } from 'react'
import { getAllApprovedProfiles } from '../services/profiles'

/**
 * Hook to fetch all approved profiles (both genders) for landing page.
 * Works for both logged-in and guest users.
 *
 * @param {object} options
 * @param {number} options.limit - Max profiles (default 24)
 * @param {boolean} options.enabled - If false, skip fetch (default true)
 * @returns {{ profiles: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export const useAllProfiles = ({ limit = 24, enabled = true } = {}) => {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProfiles = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      setProfiles([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await getAllApprovedProfiles(limit)
      if (result.success) {
        setProfiles(result.data)
        setError(null)
      } else {
        setProfiles([])
        setError(result.error || 'Failed to load profiles')
      }
    } catch (err) {
      setProfiles([])
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [limit, enabled])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  return { profiles, loading, error, refetch: fetchProfiles }
}
