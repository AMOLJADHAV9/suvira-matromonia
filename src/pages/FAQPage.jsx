import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      category: 'Registration & Profile',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on "Create Free Profile" or "Register" button on our homepage. Fill in your basic details including name, age, gender, email, and password. After registration, you\'ll be prompted to complete your profile with additional information.'
        },
        {
          q: 'Is registration free?',
          a: 'Yes, creating a profile is completely free. You can browse profiles and send interests as a free member. Premium features like chat, full photo access, and advanced search require a subscription.'
        },
        {
          q: 'How do I complete my profile?',
          a: 'After registration, a profile completion form will appear. You can also access it anytime from your dashboard. Fill in details about your education, family, lifestyle, and preferences to increase your profile completion percentage.'
        },
        {
          q: 'How long does profile verification take?',
          a: 'Our team manually verifies each profile to ensure authenticity. Verification typically takes 24-48 hours after you complete your profile. You\'ll receive an email notification once your profile is approved.'
        }
      ]
    },
    {
      category: 'Searching & Matching',
      questions: [
        {
          q: 'How do I search for matches?',
          a: 'Go to "Find Matches" page from the navigation menu. You can filter profiles by age, location, religion, caste, education, and more. As a free member, you can view basic profiles. Premium members get access to advanced filters.'
        },
        {
          q: 'Can I see profiles of the opposite gender only?',
          a: 'Yes, our platform automatically shows you profiles of the opposite gender. Male users see female profiles and vice versa, ensuring relevant matches.'
        },
        {
          q: 'How does the matching algorithm work?',
          a: 'Our algorithm considers factors like age, location, religion, caste, education, family background, and lifestyle preferences to suggest compatible matches. Premium members get priority in match suggestions.'
        },
        {
          q: 'Can I save profiles for later?',
          a: 'Yes, you can send interests to profiles you like. These will be saved in your "My Interests" section where you can track sent and received interests.'
        }
      ]
    },
    {
      category: 'Premium Features',
      questions: [
        {
          q: 'What are the benefits of Premium membership?',
          a: 'Premium members get access to chat with matches, view full photos, see contact details, use advanced search filters, get priority in match suggestions, and enjoy unlimited profile views.'
        },
        {
          q: 'How much does Premium membership cost?',
          a: 'We offer flexible plans: 1 month (₹999), 3 months (₹2,499), and 6 months (₹4,499). Longer plans offer better savings. All plans include the same premium features.'
        },
        {
          q: 'How do I upgrade to Premium?',
          a: 'Go to your Dashboard and click "Upgrade to Premium" or visit the Subscription page. Choose your preferred plan and complete the secure payment process.'
        },
        {
          q: 'Can I cancel my Premium subscription?',
          a: 'Yes, you can cancel your subscription anytime. Your premium access will continue until the end of your current billing period.'
        }
      ]
    },
    {
      category: 'Privacy & Security',
      questions: [
        {
          q: 'Is my personal information safe?',
          a: 'Absolutely. We use industry-standard encryption and security measures to protect your data. Your contact details are only visible to premium members, and you have full control over what information is displayed on your profile.'
        },
        {
          q: 'Who can see my profile?',
          a: 'Your profile is visible to verified members of the opposite gender. You can control privacy settings and choose what information to display. Premium members can see additional details like contact information.'
        },
        {
          q: 'How do I report a fake or inappropriate profile?',
          a: 'If you encounter a suspicious profile, click the "Report" button on that profile. Our moderation team reviews all reports and takes appropriate action, including profile removal if necessary.'
        },
        {
          q: 'Can I hide my profile temporarily?',
          a: 'Yes, you can temporarily hide your profile from search results while keeping your account active. This feature is available in your profile settings.'
        }
      ]
    },
    {
      category: 'Payment & Billing',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets. All payments are processed through secure payment gateways.'
        },
        {
          q: 'Will I be charged automatically after my subscription expires?',
          a: 'No, we do not auto-renew subscriptions. You need to manually renew your premium membership when it expires.'
        },
        {
          q: 'Do you offer refunds?',
          a: 'Refunds are considered on a case-by-case basis. Please contact our support team if you have any concerns about your subscription.'
        }
      ]
    }
  ]

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === index ? null : index)
  }

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
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Find answers to common questions about Suvira Matrimony
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary-maroon mb-6">
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`
                  const isOpen = openIndex === index
                  
                  return (
                    <div
                      key={questionIndex}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-primary-cream transition-colors"
                      >
                        <span className="font-semibold text-primary-maroon pr-4">
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <FaChevronUp className="text-primary-gold flex-shrink-0" />
                        ) : (
                          <FaChevronDown className="text-primary-gold flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-4"
                        >
                          <p className="text-gray-700 leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary-gold/10 to-primary-maroon/10 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-serif font-bold text-primary-maroon mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-700 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-primary-maroon text-white rounded-xl hover:bg-primary-maroon/90 transition-colors font-semibold"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default FAQPage
