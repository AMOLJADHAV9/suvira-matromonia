import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const PRIVACY_POLICY_EFFECTIVE_DATE = 'February 25, 2025'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-cream to-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-maroon to-primary-maroon/90 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              How we collect, use, and protect your information
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 leading-relaxed mb-8">
            <strong>Effective Date:</strong> {PRIVACY_POLICY_EFFECTIVE_DATE}
          </p>
          <p className="text-gray-600 leading-relaxed mb-12">
            Suvira Matrimonial (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) values your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our matrimonial services.
          </p>

          <div className="space-y-10">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                1. Information We Collect
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We collect information you provide during registration and profile creation, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1 mb-3">
                <li>Name, age, gender</li>
                <li>Religion, caste, sub-caste</li>
                <li>Location</li>
                <li>Education and employment details</li>
                <li>Family and lifestyle information</li>
                <li>Profile photos</li>
                <li>Email and contact number</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-2">
                If you purchase a premium plan, payment processing is handled securely through third-party payment gateways. We do not store full card details on our servers.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We may also collect device information such as IP address, browser type, and usage activity for security and performance improvement.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We use your information to:
              </p>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1 mb-3">
                <li>Create and display your matrimonial profile</li>
                <li>Match you with suitable partners</li>
                <li>Enable communication between members</li>
                <li>Process premium subscriptions</li>
                <li>Improve platform functionality</li>
                <li>Prevent fraud and misuse</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                We do not sell your personal data.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                3. Sharing of Information
              </h2>
              <p className="text-gray-600 leading-relaxed mb-2">
                Your profile information is visible to registered members of Suvira Matrimonial.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We may share limited information with:
              </p>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1 mt-2">
                <li>Payment service providers</li>
                <li>Law enforcement authorities (if legally required)</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                4. Data Security
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We use secure technologies and access controls to protect your information. However, users are responsible for maintaining the confidentiality of their login credentials.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                5. Your Rights
              </h2>
              <p className="text-gray-600 leading-relaxed mb-2">
                You may:
              </p>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
                <li>Edit or update your profile</li>
                <li>Control profile visibility</li>
                <li>Block or report users</li>
                <li>Request account deletion</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                6. Policy Updates
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will be posted on this page.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                7. Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                For any privacy-related concerns, contact us at:{' '}
                <a
                  href="mailto:support@suviramatrimonial.com"
                  className="text-primary-maroon font-medium hover:text-primary-gold transition-colors underline"
                >
                  support@suviramatrimonial.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default PrivacyPage
