interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy = ({ onClose }: PrivacyPolicyProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b z-10">
        <div className="container-custom py-4 flex items-center justify-between">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
            ← Back
          </button>
          <h1 className="font-semibold">Privacy Policy</h1>
          <div className="w-16"></div>
        </div>
      </div>
      
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <p className="text-gray-600">Last updated: January 2024</p>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="text-gray-600 mb-2">We collect information you provide directly:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Name, email address, phone number</li>
              <li>Shipping and billing address</li>
              <li>Payment information (processed securely via payment gateway)</li>
              <li>Order history and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to customer service requests</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Improve our website and services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Information Sharing</h2>
            <p className="text-gray-600">We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Shipping partners to deliver your orders</li>
              <li>Payment processors for secure transactions</li>
              <li>Service providers who assist our operations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Security</h2>
            <p className="text-gray-600">We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits to protect your information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Your Rights</h2>
            <p className="text-gray-600">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Cookies</h2>
            <p className="text-gray-600">We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookies through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact Us</h2>
            <p className="text-gray-600">For privacy-related inquiries, contact us at:</p>
            <p className="text-gray-600">Email: support@elitos.in</p>
            <p className="text-gray-600">Address: A-111 Amar Colony, Lajpat Nagar 4, New Delhi 110024</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
