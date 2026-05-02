import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTrashAlt, FaExclamationTriangle, FaTimes } from 'react-icons/fa'

/**
 * Confirmation modal shown before permanently deleting a user account.
 *
 * Props:
 *  isOpen      – bool
 *  onClose     – fn  (Cancel / close)
 *  onConfirm   – async fn (Delete confirmed)
 *  loading     – bool
 *  error       – string | null
 */
const DeleteAccountModal = ({ isOpen, onClose, onConfirm, loading = false, error = null }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="delete-modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={(e) => { if (!loading) onClose() }}
                >
                    <motion.div
                        key="delete-modal-box"
                        initial={{ scale: 0.92, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 20 }}
                        transition={{ duration: 0.25, type: 'spring', stiffness: 320, damping: 28 }}
                        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden
              border border-red-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Red header band */}
                        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 pt-6 pb-8">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                  rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors duration-200
                  disabled:opacity-50"
                                aria-label="Close"
                            >
                                <FaTimes />
                            </button>

                            {/* Warning icon circle */}
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center
                  border-2 border-white/30 shadow-lg">
                                    <FaExclamationTriangle className="text-white text-2xl" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-white text-center tracking-tight">
                                Delete Your Account?
                            </h2>
                        </div>

                        {/* Body */}
                        <div className="px-6 pt-6 pb-7">
                            {/* Permanent warning */}
                            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
                                <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-red-700 font-medium leading-snug">
                                    This action is <strong>permanent and cannot be undone.</strong> All your data
                                    will be erased immediately.
                                </p>
                            </div>

                            {/* What gets deleted */}
                            <ul className="text-sm text-gray-600 space-y-2 mb-6 pl-1">
                                {[
                                    'Your profile and personal information',
                                    'All interests you sent and received',
                                    'All your chat conversations',
                                    'Your subscription and payment records',
                                    'Your login access (Firebase Auth)',
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {/* Inline error */}
                            {error && (
                                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-700
                    font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700
                    text-white font-semibold flex items-center justify-center gap-2
                    hover:from-red-700 hover:to-red-800 active:scale-[0.98]
                    transition-all duration-200 shadow-md shadow-red-200
                    disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Deleting…
                                        </>
                                    ) : (
                                        <>
                                            <FaTrashAlt />
                                            Delete My Account
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default DeleteAccountModal
