import React from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaCheck, FaShieldAlt, FaLock, FaQuoteLeft, FaStar } from 'react-icons/fa'
import Button from '../components/ui/Button'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import WeddingGallery from '../components/WeddingGallery'
import { useAuth } from '../context/AuthContext'
import { useAllProfiles } from '../hooks/useAllProfiles'
import { useOppositeGenderProfiles } from '../hooks/useOppositeGenderProfiles'
import ProfileCard from '../components/profile/ProfileCard'
import { heroBannerImages, galleryImages } from '../assets/wedding'
import couple1 from '../assets/real-matech-story/9da33655fe580abfc72c0b483b715a30.jpg'
import couple2 from '../assets/real-matech-story/b2f4bc0bbba5e4bfb172aecb168cfc56.jpg'
import couple3 from '../assets/real-matech-story/b797f6384f89b1ade60e0a1f57b0c352.jpg'
import couple4 from '../assets/real-matech-story/f2b3666b5c0db1dc5d9def42435b5dbb.jpg'
import couple5 from '../assets/real-matech-story/images (2).jpg'
import couple6 from '../assets/real-matech-story/stylish-indian-hindu-couple-posed-street_627829-12969.avif'

const LandingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, currentUser, userProfile } = useAuth()

  const { profiles: allProfiles, loading: allLoading } = useAllProfiles({
    limit: 16,
    enabled: !isAuthenticated()
  })

  const {
    profiles: oppositeProfiles,
    loading: oppositeLoading,
    error: oppositeError
  } = useOppositeGenderProfiles({
    userId: currentUser?.uid,
    userGender: userProfile?.personal?.gender,
    limit: 16,
    fetchFromFirestore: true,
    enabled: isAuthenticated()
  })

  const displayedProfiles = isAuthenticated() ? oppositeProfiles : allProfiles
  const profilesLoading = isAuthenticated() ? oppositeLoading : allLoading

  const heroImage = heroBannerImages[0]

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
      <section className="relative overflow-hidden min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        <div className="absolute inset-0 overflow-hidden">
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

      {/* Wedding Gallery Grid */}
      <section className="py-20 bg-primary-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-maroon mb-4">
              Our Wedding Moments
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Celebrating love and tradition through beautiful Indian weddings
            </p>
          </motion.div>
          <WeddingGallery images={galleryImages} columns={4} />
        </div>
      </section>
      
      {/* Featured Matches Section */}
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
              Featured Matches
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover verified profiles of Indian brides and grooms looking for their perfect match
            </p>
          </motion.div>

          {/* Logged in: opposite gender only. Logged out: all profiles */}
          {profilesLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary-maroon/30 border-t-primary-gold animate-spin" />
              <p className="text-gray-600">Loading profiles...</p>
            </div>
          ) : oppositeError && isAuthenticated() ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 rounded-xl border border-primary-gold/40 bg-primary-gold/5 px-6">
              <p className="text-gray-700 text-center">{oppositeError}</p>
              <Button onClick={() => navigate('/complete-profile')}>Complete Your Profile</Button>
            </div>
          ) : displayedProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <ProfileCard profile={profile} />
                </motion.div>
              ))}
            </div>
          ) : null}

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
                image: couple1,
                quote: 'Our families connected through Suvira and within a few months, everything fell into place. The verified profiles made the process smooth and trustworthy.',
                marriedDate: 'Married in 2023',
                rating: 5
              },
              {
                name: 'Rohan & Priya',
                location: 'Delhi, NCR',
                image: couple2,
                quote: 'We were in different cities, but Suvira brought our families together. The recommendations felt accurate and saved us so much time.',
                marriedDate: 'Married in 2024',
                rating: 5
              },
              {
                name: 'Vikram & Kavya',
                location: 'Bangalore, Karnataka',
                image: couple3,
                quote: 'We loved the focus on family values and culture. It was comfortable for both families to connect, talk, and move forward confidently.',
                marriedDate: 'Married in 2022',
                rating: 5
              },
              {
                name: 'Arjun & Meera',
                location: 'Hyderabad, Telangana',
                image: couple4,
                quote: 'The profile details and verification gave our parents confidence. We found a genuine connection and everything progressed naturally.',
                marriedDate: 'Married in 2023',
                rating: 5
              },
              {
                name: 'Aditya & Sneha',
                location: 'Chennai, Tamil Nadu',
                image: couple5,
                quote: 'From first conversation to meeting families, the journey felt secure and well-guided. We are grateful for the platform.',
                marriedDate: 'Married in 2024',
                rating: 5
              },
              {
                name: 'Karan & Aisha',
                location: 'Pune, Maharashtra',
                image: couple6,
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