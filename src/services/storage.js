import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

/**
 * Upload a file to Firebase Storage with progress tracking
 * @param {File} file - The file object to upload
 * @param {string} path - The storage path (e.g., 'profiles/userId/photo.jpg')
 * @param {Function} onProgress - Callback for upload progress (0-100)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadFile = (file, path, onProgress) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve({ success: false, error: 'No file provided' })
      return
    }

    const storageRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (onProgress) onProgress(Math.round(progress))
      },
      (error) => {
        console.error('Upload error:', error)
        resolve({ success: false, error: error.message })
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          resolve({ success: true, url: downloadURL })
        } catch (err) {
          console.error('Error getting download URL:', err)
          resolve({ success: false, error: 'Failed to get download URL' })
        }
      }
    )
  })
}
