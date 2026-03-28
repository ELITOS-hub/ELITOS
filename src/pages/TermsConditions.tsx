interface TermsConditionsProps {
  onClose: () => void;
}

const TermsConditions = ({ onClose }: TermsConditionsProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b z-10">
        <div className="container-custom py-4 flex items-center justify-between">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
            ← Back
          </button>
          <h1 className="font-semibold">Terms & Conditions</h1>
          <div className="w-16"></div>
        </div>
      </div>
      
      <div className="container-custom py-12">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <p className="text-gray-600">Last updated: January 2024</p>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600">By accessing and using the ELITOS website (elitos.in), you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Products & Pricing</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>All prices are in Indian Rupees (INR) and inclusive of GST</li>
              <li>Prices are subject to change without prior notice</li>
              <li>Product images are for illustration; actual products may vary slightly</li>
              <li>We reserve the right to limit quantities on any order</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Orders & Payment</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Orders are confirmed only after successful payment or COD confirmation</li>
              <li>We accept Cash on Delivery (COD) and online payments (UPI, Cards, Net Banking)</li>
              <li>COD orders may require verification via phone call</li>
              <li>We reserve the right to cancel orders due to pricing errors or stock unavailability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Shipping & Delivery</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Free shipping on orders above ₹999</li>
              <li>Standard delivery: 5-7 business days (metro cities)</li>
              <li>Extended delivery: 7-10 business days (other areas)</li>
              <li>Delivery timelines are estimates and may vary</li>
              <li>Risk of loss passes to you upon delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Exchanges & Support</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Size exchanges are subject to availability</li>
              <li>Contact us within 7 days of delivery for any issues</li>
              <li>Products must be unused, unworn, and in original packaging for exchange</li>
              <li>Damaged products will be replaced free of charge</li>
              <li>Contact our support team via WhatsApp for quick assistance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. User Account</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>You are responsible for maintaining account confidentiality</li>
              <li>You must provide accurate and complete information</li>
              <li>One account per person; multiple accounts may be terminated</li>
              <li>We reserve the right to suspend accounts for policy violations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p className="text-gray-600">All content on this website including logos, images, text, and designs are property of ELITOS and protected by copyright laws. Unauthorized use is prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p className="text-gray-600">ELITOS shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our maximum liability is limited to the purchase price of the product.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Governing Law</h2>
            <p className="text-gray-600">These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in New Delhi.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
            <p className="text-gray-600">For any questions regarding these terms:</p>
            <p className="text-gray-600">Email: support@elitos.in</p>
            <p className="text-gray-600">Address: A-111 Amar Colony, Lajpat Nagar 4, New Delhi 110024</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
