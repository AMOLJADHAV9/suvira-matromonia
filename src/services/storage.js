import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

/**
 * Upload a file to Firebase Storage with progress tracking and fallback
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

    const readFileAsDataUrl = () => {
      return new Promise((res) => {
        const reader = new FileReader()
        reader.onload = (e) => res({ success: true, url: e.target.result, isBase64: true })
        reader.onerror = () => res({ success: false, error: 'Failed to read image file' })
        reader.readAsDataURL(file)
      })
    }

    try {
      const storageRef = ref(storage, path)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          if (onProgress) onProgress(Math.round(progress))
        },
        async (error) => {
          console.warn('Firebase Storage upload warning, using fallback:', error?.message || error)
          if (onProgress) onProgress(100)
          const fallback = await readFileAsDataUrl()
          resolve(fallback)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            resolve({ success: true, url: downloadURL })
          } catch (err) {
            console.warn('Error getting download URL, using fallback:', err)
            if (onProgress) onProgress(100)
            const fallback = await readFileAsDataUrl()
            resolve(fallback)
          }
        }
      )
    } catch (err) {
      console.warn('Storage ref error, using fallback:', err)
      readFileAsDataUrl().then(resolve)
    }
  })
}
