import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import {
  FaCheckCircle,
  FaLock,
  FaUserFriends,
  FaShieldAlt,
  FaHeart,
  FaComments,
  FaUsers,
  FaHeadset,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaArrowRight,
  FaUserPlus,
  FaSearch,
  FaRing
} from 'react-icons/fa'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'
import couple1 from '../assets/real-matech-story/9da33655fe580abfc72c0b483b715a30.jpg'
import couple2 from '../assets/real-matech-story/b2f4bc0bbba5e4bfb172aecb168cfc56.jpg'
import couple3 from '../assets/real-matech-story/b797f6384f89b1ade60e0a1f57b0c352.jpg'
import couple4 from '../assets/real-matech-story/f2b3666b5c0db1dc5d9def42435b5dbb.jpg'
import stylishCouple from '../assets/real-matech-story/stylish-indian-hindu-couple-posed-street_627829-12969.avif'
import { heroNewCoupleImage, ritualImage1, ritualImage2 } from '../assets/wedding'
import { getAllPackages } from '../utils/premiumPackages'

const motherTongues = [
  'Bengali Matrimonial', 'NRI Matrimonial', 'Sikh Matrimonial', 'Kannada Matrimonial', 'Malayalee Matrimonial', 'Marwadi Matrimonial',
  'Assamese Matrimonial', 'Oriya Matrimonial', 'Parsi Matrimonial', 'Punjabi Matrimonial', 'Rajasthani Matrimonial', 'Bihari Matrimonial',
  'Hindi Matrimonial', 'Sindhi Matrimonial', 'Gujarati Matrimonial', 'Marathi Matrimonial', 'Haryanvi Matrimonial', 'Tamil Matrimonial',
  'Telugu Matrimonial', 'Christian Matrimonial', 'Urdu Matrimonial', 'Konkani Matrimonial', 'Tulu Matrimonial', 'Kashmiri Matrimonial'
]

const LandingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [activeStoryIndex, setActiveStoryIndex] = useState(0)
  const [showMoreText, setShowMoreText] = useState(false)

  const stories = [
    {
      name: 'Rahul & Priya',
      location: 'Mumbai, Maharashtra',
      image: couple1,
      quote: 'Suvira Matrimony helped us find each other and our families connected instantly.',
      rating: 5
    },
    {
      name: 'Vikram & Kavya',
      location: 'Bangalore, Karnataka',
      image: couple2,
      quote: 'The verification process gave us confidence. Now we are happily married.',
      rating: 5
    },
    {
      name: 'Arjun & Meera',
      location: 'Hyderabad, Telangana',
      image: couple3,
      quote: 'Thank you Suvira for making our journey so smooth and beautiful.',
      rating: 5
    },
    {
      name: 'Rohan & Ananya',
      location: 'Pune, Maharashtra',
      image: couple4,
      quote: 'We found our soulmate through Suvira. The compatibility matching was spot on!',
      rating: 5
    }
  ]

  const nextStory = () => {
    setActiveStoryIndex((prev) => (prev + 1) % Math.max(1, stories.length - 2))
  }

  const prevStory = () => {
    setActiveStoryIndex((prev) => (prev === 0 ? Math.max(0, stories.length - 3) : prev - 1))
  }

  const handleLanguageClick = (lang) => {
    const cleanLang = lang.replace(' Matrimonial', '')
    navigate(`/search?motherTongue=${encodeURIComponent(cleanLang)}`)
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans antialiased text-gray-800">
      {/* Header Navigation */}
      <Header />

      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      <section className="relative overflow-hidden min-h-[75vh] lg:min-h-[85vh] flex items-center bg-[#FFFDF9] py-12 lg:py-24">
        {/* Full Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-right lg:bg-[center_right] bg-no-repeat transition-all duration-700"
          style={{ backgroundImage: `url(${heroNewCoupleImage})` }}
        />

        {/* Gradient Overlay for Text Readability: solid on left, soft fade on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/95 sm:via-[#FFFDF9]/85 lg:via-[#FFFDF9]/70 to-transparent z-0" />

        {/* Subtle decorative background watermark */}
        <div className="absolute inset-0 opacity-5 bg-[radial-[#801B2E]_1px,transparent_1px] [background-size:24px_24px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content Column */}
            <motion.div
              className="lg:col-span-7 space-y-6 text-left max-w-2xl"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Main Heading */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#801B2E] leading-tight tracking-tight">
                  Where Hearts Meet,
                  <span className="block text-[#C59B27] font-serif mt-2">Families Unite</span>
                </h1>

                {/* Decorative Accent */}
                <div className="flex items-center space-x-2 mt-4">
                  <div className="h-[1px] w-12 bg-rose-200" />
                  <span className="text-[#C59B27] text-sm">✨</span>
                  <div className="h-[1px] w-12 bg-rose-200" />
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-700 font-medium max-w-xl leading-relaxed">
                Your journey to a meaningful relationship begins with a connection that feels right — for you and your family.
              </p>

              {/* Trust Badges Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-rose-200 text-[#801B2E] text-xs font-semibold shadow-xs">
                  <FaCheckCircle className="text-rose-600 text-sm" />
                  <span>100% Verified Profiles</span>
                </div>
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-rose-200 text-[#801B2E] text-xs font-semibold shadow-xs">
                  <FaLock className="text-rose-600 text-xs" />
                  <span>Secure & Private</span>
                </div>
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-rose-200 text-[#801B2E] text-xs font-semibold shadow-xs">
                  <FaUserFriends className="text-rose-600 text-sm" />
                  <span>Family Protected</span>
                </div>
              </div>

              {/* Action CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button
                  onClick={() => navigate(isAuthenticated() ? '/dashboard' : '/register')}
                  className="inline-flex items-center justify-center space-x-3 px-8 py-3.5 rounded-full bg-[#801B2E] hover:bg-[#681423] text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all group"
                >
                  <span>Create Free Profile</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate(isAuthenticated() ? '/search' : '/login')}
                  className="inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-full border-2 border-[#801B2E] text-[#801B2E] bg-white/80 hover:bg-white text-sm font-semibold transition-all shadow-xs"
                >
                  <FaUserFriends className="text-sm" />
                  <span>Find Matches</span>
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* STATS / TRUST BAR */}
      <section className="bg-[#801B2E] text-white py-6 border-y border-[#681423] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white text-xl mb-1">
                <FaUsers />
              </div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#E5C158]">50K+</span>
              <span className="text-xs sm:text-sm text-rose-100/90 font-medium">Trusted Members</span>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white text-xl mb-1">
                <FaHeart />
              </div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#E5C158]">12K+</span>
              <span className="text-xs sm:text-sm text-rose-100/90 font-medium">Successful Matches</span>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white text-xl mb-1">
                <FaShieldAlt />
              </div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#E5C158]">100%</span>
              <span className="text-xs sm:text-sm text-rose-100/90 font-medium">Verified Profiles</span>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white text-xl mb-1">
                <FaHeadset />
              </div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#E5C158]">24/7</span>
              <span className="text-xs sm:text-sm text-rose-100/90 font-medium">Customer Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE SUVIRA MATRIMONY & SUCCESS STORIES SECTION */}
      <section className="py-16 lg:py-24 bg-[#FFFDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left Sub-Section: Why Choose Suvira Matrimony? */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#801B2E]">
                  Why Choose Suvira Matrimony?
                </h2>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="h-[2px] w-12 bg-[#C59B27]" />
                  <div className="h-[1px] w-6 bg-rose-200" />
                </div>
              </div>

              {/* 4 Feature Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#801B2E] mb-3">
                    <FaLock className="text-base" />
                  </div>
                  <h3 className="text-sm font-bold text-[#801B2E] mb-1.5">Verified Profiles</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Every profile is manually verified for 100% authenticity and trust.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#801B2E] mb-3">
                    <FaComments className="text-base" />
                  </div>
                  <h3 className="text-sm font-bold text-[#801B2E] mb-1.5">Secure Communication</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    End-to-end encrypted chat ensures your privacy and safety.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#801B2E] mb-3">
                    <FaHeart className="text-base" />
                  </div>
                  <h3 className="text-sm font-bold text-[#801B2E] mb-1.5">Smart Matching</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Advanced compatibility matching for better and meaningful connections.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#801B2E] mb-3">
                    <FaUserFriends className="text-base" />
                  </div>
                  <h3 className="text-sm font-bold text-[#801B2E] mb-1.5">Family First</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    We involve families in the journey because your happiness matters.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sub-Section: Real Stories, Real Happiness */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#801B2E]">
                    Real Stories, Real Happiness
                  </h2>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="h-[2px] w-12 bg-[#C59B27]" />
                    <div className="h-[1px] w-6 bg-rose-200" />
                  </div>
                </div>

                <Link
                  to="/success-stories"
                  className="px-4 py-1.5 rounded-full border border-[#801B2E] text-[#801B2E] text-xs font-semibold hover:bg-rose-50 transition-colors"
                >
                  View All Stories
                </Link>
              </div>

              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {stories.slice(activeStoryIndex, activeStoryIndex + 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
                    >
                      <div className="h-44 w-full overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-serif font-bold text-[#801B2E] text-sm truncate">{item.name}</h4>
                        <p className="text-[11px] text-gray-400 font-medium truncate">{item.location}</p>
                        <p className="text-xs text-gray-600 line-clamp-3 italic leading-relaxed">
                          "{item.quote}"
                        </p>
                        <div className="flex items-center space-x-1 pt-1">
                          {[...Array(item.rating)].map((_, i) => (
                            <FaStar key={i} className="text-[#C59B27] text-xs" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={prevStory}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-rose-200 text-[#801B2E] flex items-center justify-center shadow-md hover:bg-rose-50 transition-colors z-10"
                >
                  <FaChevronLeft className="text-xs" />
                </button>
                <button
                  onClick={nextStory}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-rose-200 text-[#801B2E] flex items-center justify-center shadow-md hover:bg-rose-50 transition-colors z-10"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* NEW SECTION 1: MOTHER TONGUE BROWSE CATEGORIES */}
      <section className="py-16 bg-[#FFFDF9] border-t border-rose-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">
              Mother Tongue
            </h2>
            <button
              onClick={() => navigate('/search')}
              className="text-xs text-rose-600 font-semibold hover:underline"
            >
              View All »
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {motherTongues.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleLanguageClick(item)}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-full border border-rose-200/90 bg-white hover:bg-rose-50 hover:border-rose-400 text-xs text-gray-700 font-medium transition-all shadow-2xs hover:shadow-xs group cursor-pointer text-left w-full truncate"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#801B2E] shrink-0 group-hover:scale-125 transition-transform" />
                <span className="truncate">{item}</span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* NEW SECTION: MEMBERSHIP PLANS PRICING CARDS */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#FFFDF9] border-t border-rose-100" id="plans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">Invest In Your Future</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#801B2E]">
              Membership Plans
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
              Choose the ideal plan to view verified profiles, unlock contact details, send interest, and chat with prospective matches.
            </p>
            <div className="flex items-center justify-center space-x-2 pt-1">
              <div className="h-[1px] w-12 bg-rose-200" />
              <span className="text-[#C59B27] text-xs">🌸</span>
              <div className="h-[1px] w-12 bg-rose-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getAllPackages().map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-md hover:shadow-2xl transition-all flex flex-col justify-between group relative"
              >
                {pkg.id === 'gold' && (
                  <div className="absolute top-0 right-0 bg-[#C59B27] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Header Strip */}
                  <div
                    className="px-6 py-4 text-center font-bold text-sm uppercase tracking-wider text-white font-serif"
                    style={{
                      backgroundColor: pkg.headerColor || '#801B2E',
                      color: pkg.headerColor === '#D4AF37' ? '#1F1F1F' : 'white'
                    }}
                  >
                    {pkg.name}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-6 text-center">
                    <div>
                      <span className="text-3xl font-serif font-bold text-[#801B2E]">₹{pkg.price}</span>
                      <span className="text-xs text-gray-400 font-medium block mt-0.5">/{pkg.validityMonths} Months Validity</span>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-gray-100 text-xs text-gray-600 text-left">
                      <div className="flex items-center space-x-2.5">
                        <FaCheckCircle className="text-emerald-500 text-sm shrink-0" />
                        <span><strong>{pkg.contactsPerWeek}</strong> Contacts per week</span>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <FaCheckCircle className="text-emerald-500 text-sm shrink-0" />
                        <span><strong>{pkg.totalContacts}</strong> Total profile contacts</span>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <FaCheckCircle className="text-emerald-500 text-sm shrink-0" />
                        <span>100% Verified Profile Access</span>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <FaCheckCircle className="text-emerald-500 text-sm shrink-0" />
                        <span>Direct Chat & Contact Unlock</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => navigate('/plans')}
                    className="w-full py-3 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all"
                    style={{
                      background: pkg.headerColor === '#D4AF37'
                        ? 'linear-gradient(to right, #C59B27, #E5C158)'
                        : 'linear-gradient(to right, #801B2E, #A0233B)',
                      color: pkg.headerColor === '#D4AF37' ? '#1F1F1F' : 'white'
                    }}
                  >
                    Select Plan
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-[#FAF6F0] to-[#FFFDF9] border-t border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#801B2E]">
              How It Works?
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="h-[1px] w-12 bg-rose-200" />
              <span className="text-[#C59B27]">🌸</span>
              <div className="h-[1px] w-12 bg-rose-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-rose-100 text-center space-y-3 shadow-xs hover:shadow-md transition-shadow relative">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-[#801B2E] flex items-center justify-center mx-auto text-lg font-bold">
                  <FaUserPlus />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#C59B27] uppercase tracking-wider block">01</span>
                  <h4 className="text-sm font-bold text-[#801B2E] mt-0.5">Create Profile</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Sign up and create your profile in minutes.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-rose-100 text-center space-y-3 shadow-xs hover:shadow-md transition-shadow relative">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-[#801B2E] flex items-center justify-center mx-auto text-lg font-bold">
                  <FaSearch />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#C59B27] uppercase tracking-wider block">02</span>
                  <h4 className="text-sm font-bold text-[#801B2E] mt-0.5">Find Matches</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Get compatible matches curated for you.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-rose-100 text-center space-y-3 shadow-xs hover:shadow-md transition-shadow relative">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-[#801B2E] flex items-center justify-center mx-auto text-lg font-bold">
                  <FaComments />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#C59B27] uppercase tracking-wider block">03</span>
                  <h4 className="text-sm font-bold text-[#801B2E] mt-0.5">Connect & Chat</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Start a conversation with mutual interest.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-rose-100 text-center space-y-3 shadow-xs hover:shadow-md transition-shadow relative">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-[#801B2E] flex items-center justify-center mx-auto text-lg font-bold">
                  <FaRing />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#C59B27] uppercase tracking-wider block">04</span>
                  <h4 className="text-sm font-bold text-[#801B2E] mt-0.5">Build Relationship</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Take the next step towards a happy future.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-gradient-to-br from-rose-100/90 via-rose-50 to-amber-50 p-6 sm:p-8 rounded-3xl border border-rose-200/80 shadow-md text-center space-y-4 relative overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#801B2E] mx-auto text-2xl shadow-sm">
                  💍
                </div>
                <h3 className="text-lg font-serif font-bold text-[#801B2E] leading-snug">
                  Begin your journey towards a lifetime of happiness
                </h3>
                <button
                  onClick={() => navigate(isAuthenticated() ? '/search' : '/register')}
                  className="px-6 py-2.5 rounded-full bg-[#801B2E] hover:bg-[#681423] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center space-x-2"
                >
                  <span>Start Exploring Now</span>
                  <FaArrowRight className="text-[10px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION 2: WELCOME TO SUVIRA MATRIMONY INTRO BANNER */}
      <section className="py-16 lg:py-20 bg-gray-100/80 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl overflow-hidden shadow-md border border-gray-200">

            {/* Left Image: Joyous Bride & Groom */}
            <div className="lg:col-span-5 h-72 sm:h-96 lg:h-full relative overflow-hidden">
              <img
                src={stylishCouple}
                alt="Welcome to Suvira Matrimony"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/40 lg:to-white/90" />
            </div>

            {/* Right Copy Text */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-4 text-left">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
                Welcome To Suvira Matrimony
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                SuviraMatrimony.com is India's most traditional match-making service provider to help find you your best life partner or jeevansathi. Our dedicated and experienced team is committed to provide solutions to all prospective Indian brides and grooms e.g. Hindu, Marathi, Gujarati, Sikh, and NRI profiles.
              </p>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                We thrive on technology to create a platform to make 100% safe and secure match-making service which makes us one of the best matrimonial sites in India among the Indian matrimonial sites. Some of the features like Join Free! to find matches and meet perfect life partner is a prominent feature for those who are serious about commitments or shaadi or lovevivah...
                {showMoreText && (
                  <span className="block mt-2 text-gray-600">
                    We offer verified profiles, privacy controls, horoscope matching, and dedicated customer support to ensure your matrimonial journey is smooth, comfortable, and successful for both you and your family.
                  </span>
                )}
              </p>

              <button
                onClick={() => setShowMoreText(!showMoreText)}
                className="inline-flex items-center text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors pt-2 cursor-pointer"
              >
                <span>{showMoreText ? 'Read Less «' : 'Read More »'}</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* NEW SECTION 3: TRADITIONAL CEREMONIES PHOTO GRID */}
      <section className="py-12 bg-[#FFFDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Banner Photo 1: Saptapadi Ceremony */}
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md group">
              <img
                src={ritualImage1}
                alt="Saptapadi Ceremony"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h4 className="text-xl font-serif font-bold text-white drop-shadow-md">Sacred Saptapadi Rituals</h4>
                <p className="text-xs text-rose-100/90 mt-1">Seven vows of togetherness & lifelong commitment</p>
              </div>
            </div>

            {/* Banner Photo 2: Kalash & Garland Ritual */}
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md group">
              <img
                src={ritualImage2}
                alt="Kalash & Garland Ritual"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h4 className="text-xl font-serif font-bold text-white drop-shadow-md">Creating Lifelong Traditions</h4>
                <p className="text-xs text-rose-100/90 mt-1">Honoring family heritage and joyous celebrations</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage