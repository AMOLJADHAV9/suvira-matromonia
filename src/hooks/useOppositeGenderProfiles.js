import { useState, useEffect, useCallback } from 'react'
import { getAllProfilesByOppositeGender, fetchUserGenderFromFirestore } from '../services/profiles'

/**
 * Hook for gender-based profile fetching.
 * Fetches all opposite gender profiles (Male→Female, Female→Male) – approved, pending, etc.
 * Excludes suspended users. Used by Dashboard and Find Matches.
 *
 * @param {object} options
 * @param {string} options.userId - Logged-in user's UID
 * @param {string} options.userGender - personal.gender from user profile (optional if fetchFromFirestore=true)
 * @param {number} options.limit - Max profiles (default 50)
 * @param {boolean} options.fetchFromFirestore - If true, fetch gender from Firestore when not in context
 * @param {boolean} options.enabled - If false, skip fetch (default true when userId present)
 * @returns {{ profiles: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export const useOppositeGenderProfiles = ({
  userId,
  userGender,
  limit = 50,
  fetchFromFirestore = false,
  enabled = true
}) => {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProfiles = useCallback(async () => {
    if (!userId || !enabled) {
      setLoading(false)
      setProfiles([])
      return
    }

    let gender = userGender

    if (!gender && fetchFromFirestore) {
      setLoading(true)
      setError(null)
      const genderResult = await fetchUserGenderFromFirestore(userId)
      if (!genderResult.success) {
        setError(genderResult.error || 'Could not load profile')
        setProfiles([])
        setLoading(false)
        return
      }
      gender = genderResult.gender
    }

    if (!gender) {
      setError('Please complete your profile with gender to view matches.')
      setProfiles([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await getAllProfilesByOppositeGender(userId, gender, limit)
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
  }, [userId, userGender, limit, fetchFromFirestore, enabled])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  return { profiles, loading, error, refetch: fetchProfiles }
}
