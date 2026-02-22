import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaCheck, FaShieldAlt, FaLock, FaQuoteLeft, FaStar, FaHeart, FaEye } from 'react-icons/fa'
import Button from '../components/ui/Button'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'
import { useAllProfiles } from '../hooks/useAllProfiles'
import ProfileCard from '../components/profile/ProfileCard'

const LandingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { profiles: allProfiles, loading: profilesLoading } = useAllProfiles({
    limit: 16,
    enabled: true
  })

  // Hero banner carousel images
  const bannerImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
    // 'https://images.unsplash.com/photo-1520854222734-252b691c6f3d?w=1920&q=80',
    // 'https://images.unsplash.com/photo-1529634806980-cd3e6b67a0c5?w=1920&q=80'
  ]

  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [bannerImages.length])

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  }

  const trustBadgeVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-cream to-white">
      {/* Header */}
      <Header />
      
      {/* Hero Section with Carousel Banner */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Carousel */}
        <div className="absolute inset-0 overflow-hidden">
          {bannerImages.map((src, index) => (
            <motion.div
              key={src}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${src})` }}
              initial={{ opacity: index === currentBanner ? 1 : 0 }}
              animate={{ opacity: index === currentBanner ? 1 : 0 }}
              transition={{ duration: 1.2 }}
            />
          ))}

          {/* Light Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-maroon/30 via-primary-maroon/20 to-primary-maroon/30"></div>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={heroVariants}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg"
                variants={heroVariants}
              >
                Where Traditions Meet
                <span className="text-primary-gold block">True Love</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto drop-shadow-md"
                variants={heroVariants}
              >
                India's most trusted matrimonial platform connecting families and creating lasting bonds. 
                Find your perfect match with 100% verified profiles and secure communication.
              </motion.p>
            </motion.div>
              
            {/* Trust Badges */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-10"
              variants={heroVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
                variants={trustBadgeVariants}
                whileHover={{ scale: 1.05 }}
              >
                <FaCheck className="text-green-600 text-lg" />
                <span className="text-sm font-medium text-gray-800">100% Admin Verified</span>
              </motion.div>
              
              <motion.div 
                className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
                variants={trustBadgeVariants}
                whileHover={{ scale: 1.05 }}
              >
                <FaShieldAlt className="text-blue-600 text-lg" />
                <span className="text-sm font-medium text-gray-800">Secure Payments</span>
              </motion.div>
              
              <motion.div 
                className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
                variants={trustBadgeVariants}
                whileHover={{ scale: 1.05 }}
              >
                <FaLock className="text-purple-600 text-lg" />
                <span className="text-sm font-medium text-gray-800">Privacy Protected</span>
              </motion.div>
            </motion.div>
              
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={heroVariants}
              initial="hidden"
              animate="visible"
            >
              {!isAuthenticated() && (
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto shadow-xl"
                  onClick={() => navigate('/register', { state: { backgroundLocation: location } })}
                >
                  Create Free Profile
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-primary-maroon shadow-xl"
                onClick={() => navigate(isAuthenticated() ? '/search' : '/login')}
              >
                {isAuthenticated() ? 'Find Matches' : 'Find Matches'}
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-white">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-maroon mb-4">
              Why Choose Suvira Matrimony?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing Indian matrimonial services with trust, technology, and tradition
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🔒',
                title: 'Verified Profiles',
                description: 'Every profile is manually verified by our team for 100% authenticity'
              },
              {
                icon: '💬',
                title: 'Secure Premium Chat',
                description: 'Safe and private messaging with end-to-end encryption for premium members'
              },
              {
                icon: '✨',
                title: 'Horoscope Matching',
                description: 'Advanced astrological compatibility analysis for perfect matches'
              },
              {
                icon: '👨‍👩‍👧‍👦',
                title: 'Family-Focused',
                description: 'We prioritize family values and cultural compatibility in all matches'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card-premium text-center p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-primary-maroon mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Matches Section */}
      <section className="py-20 bg-primary-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-maroon mb-4">
              Featured Matches
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover verified profiles of Indian brides and grooms looking for their perfect match
            </p>
          </motion.div>

          {/* All users from database */}
          {profilesLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary-maroon/30 border-t-primary-gold animate-spin" />
              <p className="text-gray-600">Loading profiles...</p>
            </div>
          ) : allProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProfileCard profile={profile} />
                </motion.div>
              ))}
            </div>
          ) : (
            <>
          {/* Female Profiles - Static for non-logged-in */}
          <div className="mb-12">
            <h3 className="text-2xl font-serif font-semibold text-primary-maroon mb-6 text-center">
              Featured Brides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: 'Priya Sharma',
                  age: 26,
                  location: 'Mumbai, Maharashtra',
                  religion: 'Hindu',
                  caste: 'Brahmin',
                  education: 'MBA',
                  occupation: 'Marketing Manager',
                  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
                  bio: 'Looking for a life partner who values family traditions and has a successful career.'
                },
                {
                  name: 'Anjali Patel',
                  age: 28,
                  location: 'Ahmedabad, Gujarat',
                  religion: 'Hindu',
                  caste: 'Patel',
                  education: 'M.Sc',
                  occupation: 'Software Engineer',
                  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
                  bio: 'Well-educated professional seeking a compatible match with similar values and goals.'
                },
                {
                  name: 'Meera Reddy',
                  age: 25,
                  location: 'Hyderabad, Telangana',
                  religion: 'Hindu',
                  caste: 'Reddy',
                  education: 'B.Tech',
                  occupation: 'Data Analyst',
                  image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
                  bio: 'Traditional values with modern outlook. Looking for a caring and understanding partner.'
                },
                {
                  name: 'Kavya Nair',
                  age: 27,
                  location: 'Kochi, Kerala',
                  religion: 'Hindu',
                  caste: 'Nair',
                  education: 'M.A',
                  occupation: 'Teacher',
                  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
                  bio: 'Educated and cultured, seeking a partner who respects traditions and family values.'
                }
              ].map((profile, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card hover className="overflow-hidden">
                    <div className="relative">
                      <div className="w-full h-64 bg-gradient-to-br from-primary-maroon to-primary-gold flex items-center justify-center overflow-hidden">
                        <img
                          src={profile.image}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-primary-gold text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Verified
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-xl font-semibold text-primary-maroon mb-1">
                          {profile.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          {profile.age} years • {profile.location}
                        </p>
                        <div className="space-y-1 mb-3 text-sm text-gray-600">
                          <div>Religion: <span className="font-medium">{profile.religion}</span></div>
                          <div>Caste: <span className="font-medium">{profile.caste}</span></div>
                          <div>Education: <span className="font-medium">{profile.education}</span></div>
                          <div>Occupation: <span className="font-medium">{profile.occupation}</span></div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {profile.bio}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(isAuthenticated() ? '/search' : '/register')}
                            icon={<FaEye />}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(isAuthenticated() ? '/search' : '/register')}
                            icon={<FaHeart />}
                          >
                            Interest
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Male Profiles */}
          <div>
            <h3 className="text-2xl font-serif font-semibold text-primary-maroon mb-6 text-center">
              Featured Grooms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: 'Rahul Kumar',
                  age: 29,
                  location: 'Delhi, NCR',
                  religion: 'Hindu',
                  caste: 'Kumar',
                  education: 'B.Tech',
                  occupation: 'Software Engineer',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
                  bio: 'IT professional with traditional values. Looking for a life partner who shares similar interests.'
                },
                {
                  name: 'Vikram Singh',
                  age: 31,
                  location: 'Pune, Maharashtra',
                  religion: 'Hindu',
                  caste: 'Rajput',
                  education: 'MBA',
                  occupation: 'Business Manager',
                  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
                  bio: 'Business professional seeking a well-educated and family-oriented partner for life.'
                },
                {
                  name: 'Arjun Menon',
                  age: 28,
                  location: 'Bangalore, Karnataka',
                  religion: 'Hindu',
                  caste: 'Menon',
                  education: 'M.Tech',
                  occupation: 'Senior Engineer',
                  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
                  bio: 'Engineer with a passion for technology and family values. Looking for a compatible match.'
                },
                {
                  name: 'Aditya Iyer',
                  age: 30,
                  location: 'Chennai, Tamil Nadu',
                  religion: 'Hindu',
                  caste: 'Iyer',
                  education: 'CA',
                  occupation: 'Chartered Accountant',
                  image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
                  bio: 'Finance professional seeking a life partner who values education and family traditions.'
                }
              ].map((profile, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card hover className="overflow-hidden">
                    <div className="relative">
                      <div className="w-full h-64 bg-gradient-to-br from-primary-maroon to-primary-gold flex items-center justify-center overflow-hidden">
                        <img
                          src={profile.image}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-primary-gold text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Verified
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-xl font-semibold text-primary-maroon mb-1">
                          {profile.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          {profile.age} years • {profile.location}
                        </p>
                        <div className="space-y-1 mb-3 text-sm text-gray-600">
                          <div>Religion: <span className="font-medium">{profile.religion}</span></div>
                          <div>Caste: <span className="font-medium">{profile.caste}</span></div>
                          <div>Education: <span className="font-medium">{profile.education}</span></div>
                          <div>Occupation: <span className="font-medium">{profile.occupation}</span></div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {profile.bio}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(isAuthenticated() ? '/search' : '/register')}
                            icon={<FaEye />}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(isAuthenticated() ? '/search' : '/register')}
                            icon={<FaHeart />}
                          >
                            Interest
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
            </>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              onClick={() => navigate(isAuthenticated() ? '/search' : '/register')}
            >
              {isAuthenticated() ? 'View All Matches' : 'Create Free Profile to View All Matches'}
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-primary-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-maroon mb-4">
              Real Matches, Real Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from couples who found their perfect match through Suvira Matrimony
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Aarav & Ananya',
                location: 'Mumbai, Maharashtra',
                image: 'https://images.unsplash.com/photo-1529634702774-0a227cc14afc?auto=format&fit=crop&w=1200&q=80',
                quote: 'Our families connected through Suvira and within a few months, everything fell into place. The verified profiles made the process smooth and trustworthy.',
                marriedDate: 'Married in 2023',
                rating: 5
              },
              {
                name: 'Rohan & Priya',
                location: 'Delhi, NCR',
                image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
                quote: 'We were in different cities, but Suvira brought our families together. The recommendations felt accurate and saved us so much time.',
                marriedDate: 'Married in 2024',
                rating: 5
              },
              {
                name: 'Vikram & Kavya',
                location: 'Bangalore, Karnataka',
                image: 'https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80',
                quote: 'We loved the focus on family values and culture. It was comfortable for both families to connect, talk, and move forward confidently.',
                marriedDate: 'Married in 2022',
                rating: 5
              },
              {
                name: 'Arjun & Meera',
                location: 'Hyderabad, Telangana',
                image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
                quote: 'The profile details and verification gave our parents confidence. We found a genuine connection and everything progressed naturally.',
                marriedDate: 'Married in 2023',
                rating: 5
              },
              {
                name: 'Aditya & Sneha',
                location: 'Chennai, Tamil Nadu',
                image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
                quote: 'From first conversation to meeting families, the journey felt secure and well-guided. We are grateful for the platform.',
                marriedDate: 'Married in 2024',
                rating: 5
              },
              {
                name: 'Karan & Aisha',
                location: 'Pune, Maharashtra',
                image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80',
                quote: 'We appreciated the privacy features and verified profiles. Suvira helped us find the right match with respect and comfort.',
                marriedDate: 'Married in 2022',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {/* Big Couple Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={testimonial.image}
                    alt={`${testimonial.name} testimonial`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="text-xl md:text-2xl font-serif font-semibold text-white drop-shadow-md truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-white/90 drop-shadow-md truncate">
                        {testimonial.location}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FaStar key={i} className="text-primary-gold text-sm drop-shadow" />
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0 bg-primary-gold/90 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {testimonial.marriedDate}
                    </div>
                  </div>
                </div>

                {/* Feedback Content */}
                <div className="p-6">
                  <FaQuoteLeft className="text-primary-gold text-3xl mb-3 opacity-70" />
                  <p className="text-gray-700 leading-relaxed italic">
                    “{testimonial.quote}”
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage