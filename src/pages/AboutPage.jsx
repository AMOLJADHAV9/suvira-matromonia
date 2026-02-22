import React from 'react'
import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { FaShieldAlt, FaUsers, FaHeart, FaAward } from 'react-icons/fa'

const AboutPage = () => {
  const features = [
    {
      icon: <FaShieldAlt className="text-4xl text-primary-gold" />,
      title: '100% Verified Profiles',
      description: 'Every profile undergoes manual verification by our dedicated team to ensure authenticity and trust.'
    },
    {
      icon: <FaUsers className="text-4xl text-primary-gold" />,
      title: 'Family-Focused Approach',
      description: 'We understand the importance of family values in Indian matrimony and prioritize cultural compatibility.'
    },
    {
      icon: <FaHeart className="text-4xl text-primary-gold" />,
      title: 'Secure & Private',
      description: 'Your privacy is our priority. We use advanced security measures to protect your personal information.'
    },
    {
      icon: <FaAward className="text-4xl text-primary-gold" />,
      title: 'Trusted Platform',
      description: 'Join thousands of families who have found their perfect matches through Suvira Matrimony.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-cream to-white">
      <Header />
      
      <section className="bg-gradient-to-r from-primary-maroon to-primary-maroon/90 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              About Suvira Matrimony
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Connecting hearts, preserving traditions, building families
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-maroon mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                At Suvira Matrimony, we believe that marriage is not just a union of two individuals, 
                but a coming together of two families. Our mission is to provide a trusted platform where 
                families can find compatible matches while preserving traditional values and cultural heritage.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We combine modern technology with time-honored traditions to create a seamless experience 
                for finding your life partner. Every profile is carefully verified, and we ensure complete 
                privacy and security throughout your journey.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-gold/20 to-primary-maroon/20 rounded-2xl p-8 h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">💕</div>
                  <h3 className="text-2xl font-serif font-semibold text-primary-maroon mb-4">
                    Trusted by Thousands
                  </h3>
                  <p className="text-gray-700">
                    Join our growing community of families who have found their perfect matches
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-maroon mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to making your matrimonial journey smooth, secure, and successful
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-primary-cream rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
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

      <section className="py-20 bg-primary-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-maroon mb-4">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Trust',
                description: 'We build trust through transparency, verification, and honest communication.'
              },
              {
                title: 'Respect',
                description: 'We respect all traditions, cultures, and individual preferences.'
              },
              {
                title: 'Privacy',
                description: 'Your personal information is protected with the highest security standards.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-2xl font-serif font-semibold text-primary-maroon mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AboutPage
