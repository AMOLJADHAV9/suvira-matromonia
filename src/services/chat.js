import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { getInterestBetween } from './interests'

const CHATS_COLLECTION = 'chats'
const MESSAGES_SUB = 'messages'

/**
 * Generate deterministic chat ID from two user IDs
 */
export const getChatId = (uid1, uid2) => {
  if (!uid1 || !uid2) return null
  return [uid1, uid2].sort().join('_')
}

/**
 * Check if interest is accepted between two users (either direction)
 */
export const isInterestAccepted = async (userId1, userId2) => {
  const r1 = await getInterestBetween(userId1, userId2)
  const r2 = await getInterestBetween(userId2, userId1)
  return (r1.success && r1.data?.status === 'accepted') ||
    (r2.success && r2.data?.status === 'accepted')
}

/**
 * Get or create chat between two users. Only creates if interest is accepted.
 */
export const getOrCreateChat = async (userId1, userId2) => {
  const chatId = getChatId(userId1, userId2)
  if (!chatId) return { success: false, error: 'Invalid user IDs' }

  const accepted = await isInterestAccepted(userId1, userId2)
  if (!accepted) {
    return { success: false, error: 'Chat available after interest acceptance', chatId: null }
  }

  try {
    const chatRef = doc(db, CHATS_COLLECTION, chatId)
    const chatSnap = await getDoc(chatRef)

    if (chatSnap.exists()) {
      return { success: true, data: { id: chatSnap.id, ...chatSnap.data() }, chatId }
    }

    const participants = [userId1, userId2].sort()
    await setDoc(chatRef, {
      chatId,
      participants,
      createdAt: serverTimestamp(),
      lastMessageAt: serverTimestamp(),
    })
    return { success: true, data: { id: chatId, chatId, participants, createdAt: new Date() }, chatId }
  } catch (err) {
    console.error('[Chat] getOrCreateChat error:', err)
    return { success: false, error: err?.message || 'Failed to create chat', chatId: null }
  }
}

/**
 * Get all chats for a user (where user is participant)
 */
export const getUserChats = async (userId) => {
  if (!userId) return { success: false, data: [], error: 'Missing user ID' }

  try {
    const q = query(
      collection(db, CHATS_COLLECTION),
      where('participants', 'array-contains', userId)
    )
    const snapshot = await getDocs(q)
    const chats = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))

    const withAccepted = await Promise.all(
      chats.map(async (chat) => {
        const otherId = chat.participants.find((p) => p !== userId)
        const accepted = await isInterestAccepted(userId, otherId)
        return { ...chat, interestAccepted: accepted }
      })
    )
    const valid = withAccepted.filter((c) => c.interestAccepted)
    valid.sort((a, b) => (b.lastMessageAt?.seconds || 0) - (a.lastMessageAt?.seconds || 0))

    return { success: true, data: valid }
  } catch (err) {
    console.error('[Chat] getUserChats error:', err)
    return { success: false, data: [], error: err?.message }
  }
}

/**
 * Send a message. Verifies interest is accepted before allowing.
 */
export const sendMessage = async (chatId, senderId, text) => {
  if (!chatId || !senderId || !text?.trim()) {
    return { success: false, error: 'Missing chat, sender, or message' }
  }

  const chatRef = doc(db, CHATS_COLLECTION, chatId)
  const chatSnap = await getDoc(chatRef)
  if (!chatSnap.exists()) return { success: false, error: 'Chat not found' }

  const chat = chatSnap.data()
  if (!chat.participants?.includes(senderId)) {
    return { success: false, error: 'You are not a participant in this chat' }
  }

  const otherId = chat.participants.find((p) => p !== senderId)
  const accepted = await isInterestAccepted(senderId, otherId)
  if (!accepted) {
    return { success: false, error: 'Chat available after interest acceptance' }
  }

  try {
    const messagesRef = collection(db, CHATS_COLLECTION, chatId, MESSAGES_SUB)
    const messageData = {
      senderId,
      text: text.trim(),
      timestamp: serverTimestamp(),
    }
    await addDoc(messagesRef, messageData)
    await updateDoc(chatRef, { lastMessageAt: serverTimestamp(), lastMessagePreview: text.trim().slice(0, 50) })
    return { success: true }
  } catch (err) {
    console.error('[Chat] sendMessage error:', err)
    return { success: false, error: err?.message || 'Failed to send message' }
  }
}

/**
 * Subscribe to messages in a chat (real-time)
 */
export const subscribeToMessages = (chatId, callback) => {
  if (!chatId || !callback) return () => {}

  const messagesRef = collection(db, CHATS_COLLECTION, chatId, MESSAGES_SUB)
  const q = query(messagesRef, orderBy('timestamp', 'asc'))

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        timestamp: d.data().timestamp?.toDate?.() || d.data().timestamp,
      }))
      callback(messages)
    },
    (err) => {
      console.error('[Chat] subscribeToMessages error:', err)
      callback([])
    }
  )
}
