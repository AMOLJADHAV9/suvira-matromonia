import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import { validateField } from '../utils/validation'

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
    setSuccess(false)
  }

  const validate = () => {
    const nextErrors = {}

    const nameErrors = validateField('name', form.name, ['required', 'name'])
    if (nameErrors.length) nextErrors.name = nameErrors[0]

    const emailErrors = validateField('email', form.email, ['required', 'email'])
    if (emailErrors.length) nextErrors.email = emailErrors[0]

    if (!form.subject.trim()) {
      nextErrors.subject = 'Subject is required'
    }

    if (!form.message.trim()) {
      nextErrors.message = 'Message is required'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)

    if (!validate()) return

    setSubmitting(true)
    // Simulate form submission
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 1000)
  }

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-2xl text-primary-gold" />,
      title: 'Email',
      content: 'support@suviramatrimony.com',
      link: 'mailto:support@suviramatrimony.com'
    },
    {
      icon: <FaPhone className="text-2xl text-primary-gold" />,
      title: 'Phone',
      content: '+91 1800-XXX-XXXX',
      link: 'tel:+911800XXXXXX'
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-primary-gold" />,
      title: 'Address',
      content: 'Mumbai, Maharashtra, India',
      link: null
    },
    {
      icon: <FaClock className="text-2xl text-primary-gold" />,
      title: 'Business Hours',
      content: 'Mon - Sat: 9:00 AM - 8:00 PM',
      link: null
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-cream to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-maroon to-primary-maroon/90 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              We're here to help! Get in touch with us for any questions or support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-serif font-bold text-primary-maroon mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Name"
                  required
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  error={errors.name}
                  placeholder="Enter your name"
                />
                
                <Input
                  label="Email"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  error={errors.email}
                  placeholder="your@email.com"
                />
                
                <Input
                  label="Phone (Optional)"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
                
                <Input
                  label="Subject"
                  required
                  value={form.subject}
                  onChange={(e) => setField('subject', e.target.value)}
                  error={errors.subject}
                  placeholder="What is this regarding?"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setField('message', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-gold focus:ring-2 focus:ring-primary-gold/20"
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                {success && (
                  <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                    Thank you! Your message has been sent. We'll get back to you soon.
                  </div>
                )}

                <Button type="submit" loading={submitting} className="w-full">
                  Send Message
                </Button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-serif font-bold text-primary-maroon mb-6">
                Get in Touch
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="p-3 bg-primary-cream rounded-xl">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-maroon mb-1">
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-gray-600 hover:text-primary-gold transition-colors"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-600">{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-primary-gold/10 to-primary-maroon/10 rounded-2xl">
                <h3 className="text-xl font-semibold text-primary-maroon mb-3">
                  Need Immediate Assistance?
                </h3>
                <p className="text-gray-700 mb-4">
                  Our customer support team is available 24/7 to assist you with any queries or concerns.
                </p>
                <Button variant="outline" onClick={() => window.open('mailto:support@suviramatrimony.com')}>
                  <FaEnvelope className="mr-2" />
                  Email Support
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ContactPage