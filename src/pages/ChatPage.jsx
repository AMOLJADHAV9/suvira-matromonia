import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getUserProfile } from '../services/auth'
import { getProfilePhotoUrl } from '../services/profiles'
import {
  getChatId,
  getOrCreateChat,
  getUserChats,
  sendMessage,
  subscribeToMessages,
  isInterestAccepted,
} from '../services/chat'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { FaPaperPlane, FaComments, FaLock } from 'react-icons/fa'

const ChatPage = () => {
  const { partnerId } = useParams()
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()
  const [chats, setChats] = useState([])
  const [profiles, setProfiles] = useState({})
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [chatError, setChatError] = useState(null)
  const [chatUnlocked, setChatUnlocked] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const load = async () => {
      if (!currentUser?.uid) return
      setLoading(true)
      setChatError(null)
      const res = await getUserChats(currentUser.uid)
      if (res.success) {
        setChats(res.data)
        const ids = res.data.map((c) => c.participants.find((p) => p !== currentUser.uid)).filter(Boolean)
        const map = {}
        await Promise.all(
          ids.map(async (id) => {
            const p = await getUserProfile(id)
            if (p.success) map[id] = { id, ...p.data }
          })
        )
        setProfiles((prev) => ({ ...prev, ...map }))
      } else setChatError(res.error)
      setLoading(false)
    }
    load()
  }, [currentUser?.uid])

  useEffect(() => {
    if (partnerId && currentUser?.uid) {
      const loadChat = async () => {
        setChatError(null)
        const accepted = await isInterestAccepted(currentUser.uid, partnerId)
        setChatUnlocked(accepted)
        if (!accepted) return

        const res = await getOrCreateChat(currentUser.uid, partnerId)
        if (res.success) {
          setSelectedChat({ id: res.chatId, participants: [currentUser.uid, partnerId] })
          const pRes = await getUserProfile(partnerId)
          if (pRes.success) {
            setProfiles((prev) => ({ ...prev, [partnerId]: { id: partnerId, ...pRes.data } }))
          }
        } else setChatError(res.error)
      }
      loadChat()
    } else {
      setSelectedChat(null)
    }
  }, [partnerId, currentUser?.uid])

  useEffect(() => {
    if (!selectedChat?.id || !currentUser?.uid) return
    const unsub = subscribeToMessages(selectedChat.id, setMessages)
    return unsub
  }, [selectedChat?.id, currentUser?.uid])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input?.trim() || !selectedChat?.id || !chatUnlocked || sending) return
    setSending(true)
    const res = await sendMessage(selectedChat.id, currentUser.uid, input.trim())
    if (res.success) setInput('')
    else setChatError(res.error)
    setSending(false)
  }

  const otherId = selectedChat?.participants?.find((p) => p !== currentUser?.uid)
  const otherProfile = profiles[otherId]
  const isList = !partnerId

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-cream to-white flex flex-col">
      <Header />
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col px-4 py-6">
        <h1 className="text-2xl font-serif font-bold text-primary-maroon mb-4">
          Messages
        </h1>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary-gold/30 border-t-primary-gold animate-spin" />
          </div>
        ) : isList ? (
          <div className="space-y-3">
            {chatError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {chatError}
              </div>
            )}
            {chats.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-primary-gold/20">
                <FaComments className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">No conversations yet</p>
                <p className="text-sm text-gray-500">Chat unlocks when someone accepts your interest</p>
              </div>
            ) : (
              chats.map((chat) => {
                const uid = chat.participants.find((p) => p !== currentUser.uid)
                const prof = profiles[uid]
                return (
                  <motion.button
                    key={chat.id}
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => navigate(`/chat/${uid}`)}
                    className="w-full bg-white rounded-xl p-4 border border-primary-gold/20 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-maroon/20 to-primary-gold/20 flex-shrink-0">
                      {prof && getProfilePhotoUrl(prof) ? (
                        <img src={getProfilePhotoUrl(prof)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-lg font-serif text-primary-maroon">
                          {prof?.personal?.name?.charAt(0) || '?'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary-maroon truncate">
                        {prof?.personal?.name || 'Profile'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessagePreview || 'No messages yet'}
                      </p>
                    </div>
                  </motion.button>
                )
              })
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-primary-gold/20 shadow-sm overflow-hidden min-h-0">
            {otherProfile && (
              <div className="p-4 border-b border-primary-gold/20 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/chat')}
                  className="text-gray-500 hover:text-primary-maroon"
                >
                  ←
                </button>
                <div
                  className="w-10 h-10 rounded-full overflow-hidden bg-primary-cream flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/profile/${otherId}`)}
                  role="button"
                >
                  {getProfilePhotoUrl(otherProfile) ? (
                    <img src={getProfilePhotoUrl(otherProfile)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-primary-maroon font-serif">
                      {otherProfile?.personal?.name?.charAt(0) || '?'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-primary-maroon">{otherProfile?.personal?.name || 'Profile'}</p>
                  <p className="text-xs text-gray-500">{otherProfile?.personal?.age && `${otherProfile.personal.age} yrs`}</p>
                </div>
              </div>
            )}

            {!chatUnlocked ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <FaLock className="text-4xl text-primary-gold mb-4" />
                <p className="text-primary-maroon font-semibold mb-1">Chat available after interest acceptance</p>
                <p className="text-gray-600 text-sm">When they accept your interest, you can start messaging here</p>
                <button
                  type="button"
                  onClick={() => navigate('/interests')}
                  className="mt-4 text-primary-maroon font-medium hover:underline"
                >
                  Check My Interests
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatError && (
                    <div className="p-2 rounded-lg bg-red-50 text-red-600 text-sm">{chatError}</div>
                  )}
                  {messages.length === 0 && !chatError && (
                    <p className="text-center text-gray-500 text-sm">No messages yet. Say hello!</p>
                  )}
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                          m.senderId === currentUser.uid
                            ? 'bg-gradient-to-r from-primary-maroon to-primary-gold text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-800 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-4 border-t border-primary-gold/20">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-maroon focus:ring-2 focus:ring-primary-gold/30 focus:outline-none"
                      disabled={!chatUnlocked || sending}
                    />
                    <button
                      type="submit"
                      disabled={!input?.trim() || sending}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary-maroon to-primary-gold text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                    >
                      <FaPaperPlane /> Send
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default ChatPage
