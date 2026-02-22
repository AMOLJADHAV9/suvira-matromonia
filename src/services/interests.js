import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  getDoc,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const COLLECTION = 'interests'

const normalizeGender = (g) => {
  if (!g || typeof g !== 'string') return null
  const n = g.trim().toLowerCase()
  return n === 'male' || n === 'female' ? n : null
}

/**
 * Validate opposite gender: Male→Female, Female→Male only
 */
const validateOppositeGender = (senderGender, receiverGender) => {
  const s = normalizeGender(senderGender)
  const r = normalizeGender(receiverGender)
  if (!s || !r) return false
  return (s === 'male' && r === 'female') || (s === 'female' && r === 'male')
}

/**
 * Send interest. Enforces gender restriction and prevents duplicates.
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const sendInterest = async (senderId, receiverId, senderGender, receiverGender) => {
  if (!senderId || !receiverId) {
    return { success: false, error: 'Missing sender or receiver' }
  }
  if (senderId === receiverId) {
    return { success: false, error: 'Cannot send interest to yourself' }
  }
  if (!validateOppositeGender(senderGender, receiverGender)) {
    return { success: false, error: 'Interest can only be sent to opposite gender profiles' }
  }

  try {
    const existingQuery = query(
      collection(db, COLLECTION),
      where('senderId', '==', senderId),
      where('receiverId', '==', receiverId)
    )
    const existing = await getDocs(existingQuery)
    if (!existing.empty) {
      const status = existing.docs[0].data().status
      return {
        success: false,
        error: status === 'pending' ? 'Interest already sent' : `Interest was ${status}`,
        existingStatus: status,
      }
    }

    const interestData = {
      senderId,
      receiverId,
      status: 'pending',
      createdAt: serverTimestamp(),
    }
    const ref = await addDoc(collection(db, COLLECTION), interestData)

    const { checkSpamAndFlag } = await import('./admin/adminInterests')
    const spam = await checkSpamAndFlag(senderId)
    if (spam.flagged) {
      console.warn('[Interests] Spam flag set for user:', senderId, 'count:', spam.count)
    }

    return {
      success: true,
      data: { id: ref.id, ...interestData, status: 'pending' },
    }
  } catch (err) {
    console.error('[Interests] sendInterest error:', err)
    return { success: false, error: err?.message || 'Failed to send interest' }
  }
}

/**
 * Get interest between two users (from sender's perspective)
 */
export const getInterestBetween = async (senderId, receiverId) => {
  if (!senderId || !receiverId) return { success: false, data: null }

  try {
    const q = query(
      collection(db, COLLECTION),
      where('senderId', '==', senderId),
      where('receiverId', '==', receiverId)
    )
    const snapshot = await getDocs(q)
    if (snapshot.empty) return { success: true, data: null }
    const doc = snapshot.docs[0]
    return { success: true, data: { id: doc.id, ...doc.data() } }
  } catch (err) {
    console.error('[Interests] getInterestBetween error:', err)
    return { success: false, data: null, error: err?.message }
  }
}

/**
 * Accept or reject interest. Only receiver can do this.
 */
export const updateInterestStatus = async (interestId, receiverId, status) => {
  if (!interestId || !receiverId || !['accepted', 'rejected'].includes(status)) {
    return { success: false, error: 'Invalid parameters' }
  }

  try {
    const ref = doc(db, COLLECTION, interestId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return { success: false, error: 'Interest not found' }

    const data = snap.data()
    if (data.receiverId !== receiverId) {
      return { success: false, error: 'Only the receiver can accept or reject' }
    }
    if (data.status !== 'pending') {
      return { success: false, error: `Interest was already ${data.status}` }
    }

    await updateDoc(ref, {
      status,
      updatedAt: serverTimestamp(),
    })

    if (status === 'accepted') {
      const { getChatId } = await import('./chat')
      const chatId = getChatId(data.senderId, data.receiverId)
      if (chatId) {
        const chatRef = doc(db, 'chats', chatId)
        const chatSnap = await getDoc(chatRef)
        if (!chatSnap.exists()) {
          const participants = [data.senderId, data.receiverId].sort()
          await setDoc(chatRef, {
            chatId,
            participants,
            createdAt: serverTimestamp(),
            lastMessageAt: serverTimestamp(),
          })
        }
      }
    }
    return { success: true, data: { id: snap.id, ...data, status } }
  } catch (err) {
    console.error('[Interests] updateInterestStatus error:', err)
    return { success: false, error: err?.message || 'Failed to update interest' }
  }
}

/**
 * Get interests received by userId (incoming)
 */
export const getIncomingInterests = async (userId) => {
  if (!userId) return { success: false, data: [], error: 'Missing user ID' }

  try {
    const q = query(
      collection(db, COLLECTION),
      where('receiverId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    return { success: true, data: list }
  } catch (err) {
    console.error('[Interests] getIncomingInterests error:', err)
    return { success: false, data: [], error: err?.message }
  }
}

/**
 * Get interests sent by userId (outgoing)
 */
export const getSentInterests = async (userId) => {
  if (!userId) return { success: false, data: [], error: 'Missing user ID' }

  try {
    const q = query(
      collection(db, COLLECTION),
      where('senderId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    return { success: true, data: list }
  } catch (err) {
    console.error('[Interests] getSentInterests error:', err)
    return { success: false, data: [], error: err?.message }
  }
}
