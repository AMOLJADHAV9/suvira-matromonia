import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../services/firebase'
import { uploadFile } from '../../services/storage'
import { doc, updateDoc } from 'firebase/firestore'
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { 
  FaUser, 
  FaLock, 
  FaSlidersH, 
  FaCamera, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaShieldAlt,
  FaBell,
  FaSave,
  FaUpload,
  FaSpinner
} from 'react-icons/fa'

const AdminSettings = () => {
  const { currentUser, userProfile } = useAuth()
  const fileInputRef = useRef(null)

  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'security' | 'platform'
  
  // Admin Profile State
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [adminRoleTitle, setAdminRoleTitle] = useState('Super Admin')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Password State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  // Platform Preferences State
  const [platformName, setPlatformName] = useState('Suvira Matrimony')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [autoApproveProfiles, setAutoApproveProfiles] = useState(false)
  const [emailAlerts, setEmailAlerts] = useState({
    newUser: true,
    newPayment: true,
    flaggedReport: true
  })

  // Feedback State
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (userProfile) {
      setName(userProfile?.personal?.name || 'admin')
      setPhone(userProfile?.personal?.phone || '')
      setAvatarUrl(
        userProfile?.personal?.avatar || 
        userProfile?.photoURL || 
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
      )
      if (userProfile?.adminRoleTitle) {
        setAdminRoleTitle(userProfile.adminRoleTitle)
      }
    }
  }, [userProfile])

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg)
      setSuccessMsg('')
    } else {
      setSuccessMsg(msg)
      setErrorMsg('')
    }
    setTimeout(() => {
      setSuccessMsg('')
      setErrorMsg('')
    }, 4000)
  }

  // Handle local system image selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    try {
      const path = `admin/avatars/${currentUser?.uid || 'admin'}_${Date.now()}.jpg`
      const res = await uploadFile(file, path, (progress) => {
        setUploadProgress(progress)
      })

      if (res.success && res.url) {
        setAvatarUrl(res.url)
        showNotification('Profile photo uploaded to server successfully!')
      } else {
        // Fallback to FileReader Base64 data URL
        const reader = new FileReader()
        reader.onloadend = () => {
          setAvatarUrl(reader.result)
          showNotification('Profile photo loaded from device!')
        }
        reader.readAsDataURL(file)
      }
    } catch (err) {
      console.error('File upload error:', err)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarUrl(reader.result)
        showNotification('Profile photo loaded from device!')
      }
      reader.readAsDataURL(file)
    } finally {
      setUploadingPhoto(false)
      setUploadProgress(0)
    }
  }

  // Save Profile Settings
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!currentUser?.uid) return

    setSaving(true)
    try {
      const userRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userRef, {
        'personal.name': name,
        'personal.phone': phone,
        'personal.avatar': avatarUrl,
        adminRoleTitle: adminRoleTitle,
        updatedAt: new Date()
      })

      showNotification('Admin Profile settings updated successfully!')
    } catch (err) {
      console.error('Error updating admin profile:', err)
      showNotification('Failed to update admin profile settings.', true)
    } finally {
      setSaving(false)
    }
  }

  // Update Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (!newPassword || !currentPassword) {
      showNotification('Please fill in current and new passwords.', true)
      return
    }
    if (newPassword !== confirmPassword) {
      showNotification('New passwords do not match.', true)
      return
    }
    if (newPassword.length < 6) {
      showNotification('Password must be at least 6 characters.', true)
      return
    }

    setSaving(true)
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
      await reauthenticateWithCredential(currentUser, credential)
      await updatePassword(currentUser, newPassword)

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      showNotification('Password changed successfully!')
    } catch (err) {
      console.error('Password update error:', err)
      showNotification(err.message || 'Failed to update password. Verify current password.', true)
    } finally {
      setSaving(false)
    }
  }

  // Save Platform Settings
  const handleSavePlatform = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const userRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userRef, {
        platformPreferences: {
          platformName,
          maintenanceMode,
          autoApproveProfiles,
          emailAlerts
        },
        updatedAt: new Date()
      })
      showNotification('Platform preferences saved successfully!')
    } catch (err) {
      console.error('Platform save error:', err)
      showNotification('Failed to save platform preferences.', true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Hidden System File Picker Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Page Title Header */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-gray-900">Admin Settings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage admin profile picture, credentials, security, and system preferences.
        </p>
      </div>

      {/* Alert Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 text-sm font-medium animate-fade-in">
          <FaCheckCircle className="text-emerald-600 text-lg flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-3 text-sm font-medium animate-fade-in">
          <FaExclamationCircle className="text-rose-600 text-lg flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs Navigation Bar */}
      <div className="flex border-b border-gray-200 space-x-8">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className="pb-4 px-2 text-sm font-bold flex items-center space-x-2 border-b-2 border-[#801B2E] text-[#801B2E]"
        >
          <FaUser className="text-xs" />
          <span>Admin Profile</span>
        </button>
      </div>

      {/* Tab 1: Admin Profile Settings */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-100">
            {/* Avatar Preview & Upload Trigger */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
              title="Click to select image from your computer"
            >
              <img
                src={avatarUrl}
                alt="Admin Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-rose-100 shadow-md group-hover:opacity-90 transition-all"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
                }}
              />
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploadingPhoto ? (
                  <FaSpinner className="text-white text-xl animate-spin" />
                ) : (
                  <FaCamera className="text-white text-xl" />
                )}
              </div>
            </div>

            <div className="text-center sm:text-left space-y-2">
              <h3 className="text-base font-bold text-gray-900">Profile Picture</h3>
              <p className="text-xs text-gray-500">Upload a picture directly from your computer or enter an image URL.</p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-50 border border-rose-200 text-[#801B2E] text-xs font-bold rounded-xl hover:bg-rose-100 transition-all cursor-pointer shadow-sm"
                >
                  {uploadingPhoto ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      <span>Uploading ({uploadProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload className="text-xs" />
                      <span>Upload Photo from Computer</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Or enter image URL</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full sm:w-80 px-3.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#801B2E]/20 focus:border-[#801B2E] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Admin Display Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Admin Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#801B2E]/20 focus:border-[#801B2E] outline-none"
              />
            </div>

            {/* Admin Role Subtitle */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Role Subtitle
              </label>
              <input
                type="text"
                value={adminRoleTitle}
                onChange={(e) => setAdminRoleTitle(e.target.value)}
                placeholder="e.g. Super Admin"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#801B2E]/20 focus:border-[#801B2E] outline-none"
              />
            </div>

            {/* Admin Email (Read only) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-4 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Admin Phone Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#801B2E]/20 focus:border-[#801B2E] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#B51E3A] to-[#801B2E] text-white text-xs font-bold rounded-xl shadow hover:brightness-110 transition-all border border-rose-400/20 disabled:opacity-50"
            >
              <FaSave />
              <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <form onSubmit={handleUpdatePassword} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6 max-w-xl">
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#801B2E]">
              <FaShieldAlt className="text-lg" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Change Admin Password</h3>
              <p className="text-xs text-gray-500">Ensure your account uses a strong, secure password.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#801B2E]/20 focus:border-[#801B2E] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showCurrentPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#801B2E]/20 focus:border-[#801B2E] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showNewPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#801B2E]/20 focus:border-[#801B2E] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute inset-y-0 right-[#801B2E] pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#B51E3A] to-[#801B2E] text-white text-xs font-bold rounded-xl shadow hover:brightness-110 transition-all border border-rose-400/20 disabled:opacity-50"
            >
              <FaLock />
              <span>{saving ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Platform Preferences */}
      {activeTab === 'platform' && (
        <form onSubmit={handleSavePlatform} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Platform Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full sm:w-96 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#801B2E]/20 focus:border-[#801B2E] outline-none"
              />
            </div>

            {/* Toggle Switch Controls */}
            <div className="pt-4 border-t border-gray-100 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">Platform Maintenance Mode</p>
                  <p className="text-xs text-gray-500">Temporarily restrict non-admin users from accessing the app.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    maintenanceMode ? 'bg-[#801B2E]' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    maintenanceMode ? 'transform translate-x-6' : ''
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">Auto-Approve New Profiles</p>
                  <p className="text-xs text-gray-500">Automatically mark newly registered profiles as approved.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoApproveProfiles(!autoApproveProfiles)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    autoApproveProfiles ? 'bg-[#801B2E]' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    autoApproveProfiles ? 'transform translate-x-6' : ''
                  }`} />
                </button>
              </div>
            </div>

            {/* Email Notifications */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FaBell className="text-[#801B2E]" /> Email Alerts & Notifications
              </h4>

              <label className="flex items-center space-x-3 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts.newUser}
                  onChange={(e) => setEmailAlerts({ ...emailAlerts, newUser: e.target.checked })}
                  className="rounded text-[#801B2E] focus:ring-[#801B2E]"
                />
                <span>Notify me when a new user registers</span>
              </label>

              <label className="flex items-center space-x-3 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts.newPayment}
                  onChange={(e) => setEmailAlerts({ ...emailAlerts, newPayment: e.target.checked })}
                  className="rounded text-[#801B2E] focus:ring-[#801B2E]"
                />
                <span>Notify me when a premium payment is completed</span>
              </label>

              <label className="flex items-center space-x-3 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts.flaggedReport}
                  onChange={(e) => setEmailAlerts({ ...emailAlerts, flaggedReport: e.target.checked })}
                  className="rounded text-[#801B2E] focus:ring-[#801B2E]"
                />
                <span>Notify me when a user profile is reported</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#B51E3A] to-[#801B2E] text-white text-xs font-bold rounded-xl shadow hover:brightness-110 transition-all border border-rose-400/20 disabled:opacity-50"
            >
              <FaSave />
              <span>{saving ? 'Saving System Preferences...' : 'Save System Settings'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AdminSettings
