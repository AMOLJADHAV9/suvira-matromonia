import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import { FaCrown, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'

const Header = () => {
  const { isAuthenticated, isAdmin, isPremiumUser, userProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
    ...(isAuthenticated() && !isAdmin() ? [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Find Matches', path: '/search' },
      { name: 'Interests', path: '/interests' },
      ...(isPremiumUser() ? [{ name: 'Chat', path: '/chat' }] : [])
    ] : [])
  ]

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

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/suviralogo-removebg-preview.png"
                alt="Suvira Matrimony"
                className="h-12 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-serif font-bold text-primary-maroon">
                  Suvira
                </h1>
                <p className="text-xs text-primary-gold -mt-1">Matrimony</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-600 hover:text-primary-maroon font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                {/* User Menu */}
                <div className="relative">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-maroon transition-colors">
                    <div className="w-8 h-8 bg-primary-maroon rounded-full flex items-center justify-center text-white text-sm">
                      {userProfile?.personal?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="font-medium">
                      {userProfile?.personal?.name || 'User'}
                    </span>
                    {isPremiumUser() && (
                      <FaCrown className="text-primary-gold" />
                    )}
                  </button>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  icon={<FaSignOutAlt />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login', { state: { backgroundLocation: location } })}
                >
                  Login
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/register', { state: { backgroundLocation: location } })}
                >
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600 hover:text-primary-maroon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div 
          className={`md:hidden overflow-hidden ${isMenuOpen ? 'block' : 'hidden'}`}
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
                    {isPremiumUser() && (
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
  )
}

export default Header