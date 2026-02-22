import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms & Conditions', path: '/terms' },
      { name: 'FAQ', path: '/faq' }
    ],
    services: [
      { name: 'Create Profile', path: '/register' },
      { name: 'Search Matches', path: '/search' },
      { name: 'Premium Plans', path: '/subscription' },
      { name: 'Success Stories', path: '/success-stories' }
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Safety Tips', path: '/safety' },
      { name: 'Report Issue', path: '/report' },
      { name: 'Customer Support', path: '/support' }
    ]
  }

  return (
    <footer className="bg-gradient-maroon text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3">
              <img
                src="/suviralogo-removebg-preview.png"
                alt="Suvira Matrimony"
                className="h-12 w-auto object-contain"
              />
              <div>
                <h3 className="text-2xl font-serif font-bold">Suvira</h3>
                <p className="text-primary-gold text-sm">Matrimony</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              India's premium matrimonial platform connecting families and creating lasting bonds. 
              Where traditions meet true love.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary-gold transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-gold transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-gold transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-gold transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-300 hover:text-primary-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-300 hover:text-primary-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaEnvelope className="text-primary-gold mt-1" />
                <div>
                  <p className="text-gray-300">support@suviramaternity.com</p>
                  <p className="text-gray-400 text-sm">24/7 Customer Support</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <FaPhone className="text-primary-gold mt-1" />
                <div>
                  <p className="text-gray-300">+91 98765 43210</p>
                  <p className="text-gray-400 text-sm">Mon-Sat 9:00 AM - 8:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-gold mt-1" />
                <div>
                  <p className="text-gray-300">Mumbai, Maharashtra</p>
                  <p className="text-gray-400 text-sm">India</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-primary-gold/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Suvira Matrimony. All rights reserved.
            </p>
            <Link
              to="/admin/login"
              className="text-gray-500 hover:text-primary-gold text-sm"
            >
              Admin
            </Link>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>Secure Payment</span>
            <div className="flex space-x-2">
              <div className="w-8 h-5 bg-white rounded-sm"></div>
              <div className="w-8 h-5 bg-white rounded-sm"></div>
              <div className="w-8 h-5 bg-white rounded-sm"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer