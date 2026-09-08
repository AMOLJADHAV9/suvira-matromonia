import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import SubscriptionExpiredBanner from '../premium/SubscriptionExpiredBanner'
import { FaCrown, FaSignOutAlt, FaBars, FaTimes, FaShieldAlt, FaArrowLeft } from 'react-icons/fa'
import { cornerFlowerImage } from '../../assets/wedding'

const Header = () => {
  const { isAuthenticated, isAdmin, canAccessPremium, isSubscriptionExpired, userProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const publicNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Blog', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ]

  const authenticatedNavLinks = [
    { name: 'Home', path: '/' },
    ...(isAdmin() ? [
      { name: 'Admin Dashboard', path: '/admin' }
    ] : [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Find Matches', path: '/search' },
      { name: 'Interests', path: '/interests' },
    ])
  ]

  const navLinks = isAuthenticated() ? authenticatedNavLinks : publicNavLinks

  const handleLogout = async () => {
    try {
      const { logoutUser } = await import('../../services/auth')
      await logoutUser()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      navigate('/')
    }
  }

  const showExpiredBanner = isAuthenticated() && !isAdmin() && isSubscriptionExpired()

  return (
    <>
      {showExpiredBanner && <SubscriptionExpiredBanner />}
      <header className="bg-[#FFFDF9]/95 backdrop-blur-md border-b border-rose-100 shadow-sm sticky top-0 z-40 relative">
        {/* Decorative corner flowers */}
        <img
          src={cornerFlowerImage}
          alt=""
          className="absolute top-0 left-0 h-16 w-auto object-contain pointer-events-none opacity-80"
          aria-hidden
        />
        <img
          src={cornerFlowerImage}
          alt=""
          className="absolute top-0 right-0 h-16 w-auto object-contain pointer-events-none scale-x-[-1] opacity-80"
          aria-hidden
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Move Back Container */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Universal Move Back Navigation Button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-[#801B2E] text-xs font-bold transition-all border border-rose-200/80 shadow-2xs hover:shadow-xs active:scale-95 shrink-0"
                title="Go back to previous page"
                aria-label="Go back"
              >
                <FaArrowLeft className="text-xs text-[#801B2E]" />
                <span className="hidden xs:inline">Back</span>
              </button>

              {/* Brand Logo */}
              <Link to="/" className="flex items-center space-x-3 group">
                <img
                  src="/suviralogo-removebg-preview.png"
                  alt="Suvira Matrimony"
                  className="h-12 w-auto object-contain group-hover:scale-105 transition-transform"
                />
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#801B2E] tracking-tight leading-none">
                    Suvira
                  </h1>
                  <p className="text-[11px] font-medium text-[#C59B27] tracking-wider uppercase mt-0.5">Matrimony</p>
                </div>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-[#801B2E] ${location.pathname === link.path
                      ? 'text-[#801B2E] font-bold border-b-2 border-[#801B2E] pb-1'
                      : 'text-gray-700'
                    }`}
                >
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>

            {/* Right Header Action Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated() ? (
                <div className="flex items-center space-x-4">
                  {/* User Profile Avatar Dropdown Button */}
                  <div className="relative flex items-center space-x-2">
                    <button
                      onClick={() => navigate('/my-profile')}
                      className="flex items-center space-x-2.5 pl-2 pr-1 py-1 rounded-full hover:bg-rose-50/80 transition-colors"
                    >
                      <div className="w-8 h-8 bg-[#801B2E] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs">
                        {userProfile?.personal?.name?.charAt(0) || 'A'}
                      </div>
                      <span className="text-xs font-bold text-gray-800">
                        {userProfile?.personal?.name || 'Amol Jadhav'}
                      </span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="p-1.5 text-gray-400 hover:text-[#801B2E] transition-colors"
                      title="Logout"
                    >
                      <FaSignOutAlt className="text-xs" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login', { state: { backgroundLocation: location } })}
                    className="px-6 py-2 rounded-full border border-[#801B2E] text-[#801B2E] text-sm font-semibold hover:bg-rose-50 transition-all shadow-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register', { state: { backgroundLocation: location } })}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-[#B51E3A] to-[#801B2E] text-white text-sm font-semibold hover:shadow-md transition-all"
                  >
                    Register
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-600 hover:text-primary-maroon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            className={`lg:hidden overflow-hidden ${isMenuOpen ? 'block' : 'hidden'}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="py-4 border-t border-gray-100">
              <div className="space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block py-2 text-gray-600 hover:text-primary-maroon font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                {isAuthenticated() ? (
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <div className="w-8 h-8 bg-primary-maroon rounded-full flex items-center justify-center text-white text-sm">
                        {userProfile?.personal?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="font-medium">
                        {userProfile?.personal?.name || 'User'}
                      </span>
                      {canAccessPremium() && (
                        <FaCrown className="text-primary-gold" />
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      icon={<FaSignOutAlt />}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate('/login', { state: { backgroundLocation: location } })
                        setIsMenuOpen(false)
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        navigate('/register', { state: { backgroundLocation: location } })
                        setIsMenuOpen(false)
                      }}
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </header>
    </>
  )
}

export default Header