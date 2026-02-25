import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const TERMS_EFFECTIVE_DATE = '01 January 2026'

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-cream to-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-maroon to-primary-maroon/90 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Terms &amp; Conditions
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Please read these terms carefully before using Suvira Matrimonial
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <p className="text-gray-600 leading-relaxed mb-3">
            <strong>Effective Date:</strong> {TERMS_EFFECTIVE_DATE}
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong>Website:</strong>{' '}
            <a
              href="https://www.suviramatrimonial.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary-maroon font-medium hover:text-primary-gold transition-colors underline"
            >
              https://www.suviramatrimonial.com
            </a>
          </p>
          <p className="text-gray-600 leading-relaxed mb-10">
            Welcome to Suvira Matrimonial. By accessing or using our website and services, you agree to comply
            with and be bound by the following Terms &amp; Conditions. If you do not agree with these terms,
            please do not use our services.
          </p>

          <div className="space-y-10">
            {/* 1. About Suvira Matrimonial */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                1. About Suvira Matrimonial
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Suvira Matrimonial is an online matrimonial and matchmaking platform that enables registered
                members to create profiles and connect with other members for the purpose of marriage. We do not
                guarantee marriage, compatibility, or successful matches.
              </p>
            </div>

            {/* 2. Eligibility */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                2. Eligibility
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                To use Suvira Matrimonial, you must:
              </p>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
                <li>Be at least 18 years of age.</li>
                <li>Be legally eligible to marry under applicable laws.</li>
                <li>Provide accurate and truthful information.</li>
                <li>Not be prohibited by law from entering into a matrimonial alliance.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                By registering, you confirm that you meet these eligibility requirements.
              </p>
            </div>

            {/* 3. Account Registration */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                3. Account Registration
              </h2>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
                <li>You must register with a valid email address and provide accurate personal details.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                <li>You agree not to create multiple fake accounts.</li>
                <li>
                  We reserve the right to suspend or terminate accounts that contain false or misleading
                  information.
                </li>
              </ul>
            </div>

            {/* 4. Member Responsibilities */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                4. Member Responsibilities
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                As a member, you agree:
              </p>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
                <li>To provide genuine and accurate information.</li>
                <li>Not to post fake photos or impersonate another person.</li>
                <li>Not to misuse the platform for harassment, fraud, or illegal purposes.</li>
                <li>Not to share offensive, abusive, defamatory, or inappropriate content.</li>
                <li>Not to solicit money or financial favors from other members.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                Suvira Matrimonial is not responsible for the conduct of members outside the platform.
              </p>
            </div>

            {/* 5. Profile Content */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                5. Profile Content
              </h2>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
                <li>Members are solely responsible for the content posted on their profile.</li>
                <li>
                  Suvira Matrimonial reserves the right to review, edit, or remove any content that violates
                  these Terms.
                </li>
                <li>We may suspend or delete profiles that are found to be fake, misleading, or abusive.</li>
              </ul>
            </div>

            {/* 6. Premium Membership & Payments */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                6. Premium Membership &amp; Payments
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Suvira Matrimonial offers paid subscription plans (Silver, Gold, etc.) that provide additional
                features.
              </p>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
                <li>Premium membership benefits are limited to the duration purchased.</li>
                <li>
                  Payment processing is handled securely via Razorpay or other approved payment gateways.
                </li>
                <li>Premium membership is non-transferable.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                We reserve the right to modify pricing and features at any time.
              </p>
            </div>

            {/* 7. Refund Policy */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                7. Refund Policy
              </h2>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
                <li>All payments are non-refundable unless otherwise stated.</li>
                <li>Refunds may be considered only in exceptional cases at our sole discretion.</li>
                <li>No refund will be provided for unused subscription periods.</li>
              </ul>
            </div>

            {/* 8. Account Suspension & Termination */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                8. Account Suspension &amp; Termination
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We reserve the right to suspend or terminate your account without prior notice if:
              </p>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
                <li>You violate these Terms &amp; Conditions.</li>
                <li>You engage in fraudulent, abusive, or suspicious activity.</li>
                <li>You provide false information.</li>
                <li>You misuse premium features.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                No refund will be provided in case of suspension due to policy violations.
              </p>
            </div>

            {/* 9. Privacy */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                9. Privacy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Your use of the platform is also governed by our Privacy Policy. We encourage you to review our
                Privacy Policy to understand how your data is handled.
              </p>
            </div>

            {/* 10. Limitation of Liability */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                10. Limitation of Liability
              </h2>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
                <li>Suvira Matrimonial does not conduct background checks on members.</li>
                <li>We do not guarantee the authenticity of information provided by users.</li>
                <li>We are not responsible for any disputes between members.</li>
                <li>
                  We are not liable for any direct or indirect damages arising from the use of our platform.
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                Members are advised to exercise caution when interacting with others.
              </p>
            </div>

            {/* 11. Safety & Caution */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                11. Safety &amp; Caution
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Users should:
              </p>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
                <li>Avoid sharing financial information.</li>
                <li>Avoid sending money to unknown individuals.</li>
                <li>Meet in safe public places when interacting offline.</li>
                <li>Report suspicious activity immediately.</li>
              </ul>
            </div>

            {/* 12. Intellectual Property */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                12. Intellectual Property
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                All website content including, but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
                <li>Logo</li>
                <li>Design</li>
                <li>Text</li>
                <li>Graphics</li>
                <li>Software</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                Are the property of Suvira Matrimonial and may not be copied or reproduced without permission.
              </p>
            </div>

            {/* 13. Changes to Terms */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                13. Changes to Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Suvira Matrimonial reserves the right to modify these Terms &amp; Conditions at any time. Updated
                terms will be posted on this page with a revised effective date.
              </p>
            </div>

            {/* 14. Governing Law */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                14. Governing Law
              </h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms &amp; Conditions shall be governed by and interpreted in accordance with the laws of
                India. Any disputes shall be subject to the jurisdiction of courts located in Maharashtra, India.
              </p>
            </div>

            {/* 15. Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-primary-maroon/10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-maroon mb-4">
                15. Contact Information
              </h2>
              <p className="text-gray-600 leading-relaxed mb-2">
                For questions regarding these Terms &amp; Conditions, you can contact us at:
              </p>
              <p className="text-gray-600 leading-relaxed">
                Email:{' '}
                <a
                  href="mailto:support@suviramatrimonial.com"
                  className="text-primary-maroon font-medium hover:text-primary-gold transition-colors underline"
                >
                  support@suviramatrimonial.com
                </a>
                <br />
                Website:{' '}
                <a
                  href="https://www.suviramatrimonial.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-maroon font-medium hover:text-primary-gold transition-colors underline"
                >
                  https://www.suviramatrimonial.com
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

export default TermsPage