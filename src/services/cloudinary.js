/**
 * Cloudinary service for profile photo uploads.
 * Uses unsigned upload preset - configure preset "SUVIRA" as Unsigned in Cloudinary dashboard.
 * API Secret must NEVER be exposed on the client - only used server-side if needed.
 */

/**
 * Upload profile photo to Cloudinary
 * @param {File} file - Image file to upload
 * @param {string} userId - User ID for folder organization
 * @param {(progress: number) => void} onProgress - Optional progress callback 0-100
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadProfilePhoto = async (file, userId, onProgress) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY

  if (!cloudName || !uploadPreset || !apiKey) {
    return { success: false, error: 'Cloudinary is not configured. Add VITE_CLOUDINARY_* to .env' }
  }

  if (!file || !file.type.startsWith('image/')) {
    return { success: false, error: 'Please select a valid image file.' }
  }
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'Image size must be less than 5MB.' }
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('api_key', apiKey)
    if (userId) formData.append('folder', `suvira/profile-photos/${userId}`)

    if (onProgress) onProgress(10)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (onProgress) onProgress(100)

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errData.error?.message || `Upload failed (${response.status})`
      }
    }

    const data = await response.json()
    return { success: true, url: data.secure_url }
  } catch (error) {
    return { success: false, error: error.message || 'Upload failed.' }
  }
}
