import React from 'react'
import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { 
  FaUsers, 
  FaHeart, 
  FaShieldAlt, 
  FaHeadset, 
  FaBullseye, 
  FaEye, 
  FaLock, 
  FaUserFriends,
  FaAward
} from 'react-icons/fa'
import stylishCouple from '../assets/real-matech-story/stylish-indian-hindu-couple-posed-street_627829-12969.avif'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans antialiased text-gray-800">
      {/* Header Navigation */}
      <Header />

      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      <section className="relative overflow-hidden min-h-[75vh] lg:min-h-[80vh] flex items-center bg-[#FFFDF9] pt-12 pb-16 lg:py-20">
        {/* Right Couple Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-right lg:bg-[center_right] bg-no-repeat transition-all duration-700 z-0"
          style={{ backgroundImage: `url(${stylishCouple})` }}
        />

        {/* Gradient Overlay: Solid cream on left, soft transparent fade towards right couple */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/95 sm:via-[#FFFDF9]/85 lg:via-[#FFFDF9]/65 to-transparent z-0" />

        {/* Delicate background watermark */}
        <div className="absolute inset-0 opacity-5 bg-[radial-[#801B2E]_1px,transparent_1px] [background-size:24px_24px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Main Copy Column */}
            <motion.div 
              className="lg:col-span-7 space-y-6 text-left max-w-2xl"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* About Us Tag Pill */}
              <div className="inline-flex items-center space-x-2 text-[11px] font-bold tracking-widest text-[#801B2E] uppercase">
                <div className="h-[1px] w-8 bg-[#801B2E]/40" />
                <span>ABOUT US</span>
                <span className="text-xs">🌸</span>
                <div className="h-[1px] w-8 bg-[#801B2E]/40" />
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#801B2E] leading-tight tracking-tight">
                About Suvira
                <span className="block text-[#C59B27] font-serif mt-1">Matrimony</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-800 font-bold max-w-xl leading-snug">
                Connecting hearts, preserving traditions, building families
              </p>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600 font-normal max-w-xl leading-relaxed">
                Suvira Matrimony is India's trusted matrimonial platform dedicated to helping individuals and families find compatible life partners while honoring cultural values and traditions.
              </p>

              {/* Decorative Accent Divider */}
              <div className="flex items-center space-x-2 pt-2">
                <div className="h-[1px] w-12 bg-amber-300/80" />
                <span className="text-[#C59B27] text-xs">♥</span>
                <div className="h-[1px] w-12 bg-amber-300/80" />
              </div>
            </motion.div>

            {/* Right Overlaid Card: Trusted by Thousands */}
            <motion.div
              className="lg:col-span-5 flex justify-end"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-[#4A0E1A] via-[#5C1122] to-[#7A1B2D] text-white p-6 sm:p-8 rounded-3xl border border-[#C59B27]/40 shadow-2xl space-y-4 max-w-xs sm:max-w-sm text-center relative overflow-hidden group">
                
                {/* Shield + Heart Icon */}
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-[#C59B27]/30 flex items-center justify-center text-[#E5C158] mx-auto text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  <FaShieldAlt />
                </div>

                <h3 className="text-xl font-serif font-bold text-[#E5C158] tracking-wide">
                  Trusted by Thousands
                </h3>

                <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-normal">
                  Join our growing community of families who have found their perfect matches.
                </p>

                {/* Subtle Decorative Backdrop Circle */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#C59B27]/10 rounded-full blur-xl pointer-events-none" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* STATS BAR CARD */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 lg:-mt-10 mb-16">
        <motion.div 
          className="bg-white rounded-3xl border border-rose-100/80 shadow-xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Item 1 */}
          <div className="flex flex-col items-center justify-center space-y-2 p-2">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-[#801B2E] flex items-center justify-center text-xl shadow-xs">
              <FaUsers />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#801B2E] block">50K+</span>
              <span className="text-xs text-gray-500 font-semibold">Trusted Members</span>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center justify-center space-y-2 p-2 border-l border-gray-100 md:border-l">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-[#801B2E] flex items-center justify-center text-xl shadow-xs">
              <FaHeart />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#801B2E] block">12K+</span>
              <span className="text-xs text-gray-500 font-semibold">Successful Matches</span>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center justify-center space-y-2 p-2 border-l border-gray-100 md:border-l">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-[#801B2E] flex items-center justify-center text-xl shadow-xs">
              <FaShieldAlt />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#801B2E] block">100%</span>
              <span className="text-xs text-gray-500 font-semibold">Verified Profiles</span>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col items-center justify-center space-y-2 p-2 border-l border-gray-100 md:border-l">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-[#801B2E] flex items-center justify-center text-xl shadow-xs">
              <FaHeadset />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#801B2E] block">24/7</span>
              <span className="text-xs text-gray-500 font-semibold">Customer Support</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* LOWER SECTION: MISSION & VISION (LEFT) + CORE VALUES (RIGHT) */}
      <section className="pb-20 lg:pb-28 bg-[#FFFDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Mission & Vision */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Section Header */}
              <div className="text-center lg:text-left space-y-2">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#801B2E]">
                  Our Mission & Vision
                </h2>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="h-[2px] w-12 bg-[#C59B27]" />
                  <span className="text-[#C59B27] text-xs">🌸</span>
                  <div className="h-[1px] w-6 bg-rose-200" />
                </div>
              </div>

              {/* Mission Card */}
              <motion.div 
                className="bg-[#FFF7F8] p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-sm flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-100/80 text-[#801B2E] flex items-center justify-center text-2xl shrink-0 border border-rose-200">
                  <FaBullseye />
                </div>
                <div className="space-y-2 text-left">
                  <h3 className="text-xl font-serif font-bold text-[#801B2E]">
                    Our Mission
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                    To provide a secure, trusted, and culturally aligned platform that helps individuals and families find compatible life partners, creating lifelong bonds built on love, respect, and understanding.
                  </p>
                </div>
              </motion.div>

              {/* Vision Card */}
              <motion.div 
                className="bg-[#FFFDF5] p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-sm flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-[#C59B27] flex items-center justify-center text-2xl shrink-0 border border-amber-200">
                  <FaEye />
                </div>
                <div className="space-y-2 text-left">
                  <h3 className="text-xl font-serif font-bold text-[#C59B27]">
                    Our Vision
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                    To be India's most trusted matrimonial platform, known for authenticity, innovation, and commitment to preserving values while embracing the future.
                  </p>
                </div>
              </motion.div>

            </div>

            {/* Right Column: Core Values Card */}
            <motion.div 
              className="lg:col-span-5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-[#4A0E1A] via-[#5C1122] to-[#78182B] text-white p-6 sm:p-8 rounded-3xl border border-[#C59B27]/30 shadow-2xl space-y-6">
                
                {/* Header */}
                <div className="text-center space-y-2 border-b border-rose-900/60 pb-4">
                  <h3 className="text-2xl font-serif font-bold text-[#E5C158]">
                    Our Core Values
                  </h3>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-[1px] w-8 bg-[#C59B27]/40" />
                    <span className="text-[#E5C158] text-xs">🌸</span>
                    <div className="h-[1px] w-8 bg-[#C59B27]/40" />
                  </div>
                </div>

                {/* Values List */}
                <div className="space-y-6 text-left">
                  
                  {/* Value 1: Trust */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-[#E5C158] flex items-center justify-center text-lg shrink-0 border border-white/10">
                      <FaShieldAlt />
                    </div>
                    <div>
                      <h4 className="text-base font-serif font-bold text-white">Trust</h4>
                      <p className="text-xs text-rose-100/80 leading-relaxed mt-0.5 font-normal">
                        We build trust through transparency, verification, and honest communication.
                      </p>
                    </div>
                  </div>

                  {/* Value 2: Respect */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-[#E5C158] flex items-center justify-center text-lg shrink-0 border border-white/10">
                      <FaUserFriends />
                    </div>
                    <div>
                      <h4 className="text-base font-serif font-bold text-white">Respect</h4>
                      <p className="text-xs text-rose-100/80 leading-relaxed mt-0.5 font-normal">
                        We respect all traditions, cultures, and individual preferences.
                      </p>
                    </div>
                  </div>

                  {/* Value 3: Privacy */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-[#E5C158] flex items-center justify-center text-lg shrink-0 border border-white/10">
                      <FaLock />
                    </div>
                    <div>
                      <h4 className="text-base font-serif font-bold text-white">Privacy</h4>
                      <p className="text-xs text-rose-100/80 leading-relaxed mt-0.5 font-normal">
                        Your personal information is protected with the highest security standards.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default AboutPage
