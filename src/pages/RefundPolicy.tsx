interface RefundPolicyProps {
  onClose: () => void;
}

const RefundPolicy = ({ onClose }: RefundPolicyProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b z-10">
        <div className="container-custom py-4 flex items-center justify-between">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
            ← Back
          </button>
          <h1 className="font-semibold">Exchange & Support Policy</h1>
          <div className="w-16"></div>
        </div>
      </div>
      
      <div className="container-custom py-12">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Exchange & Support Policy</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <p className="text-gray-600">Last updated: January 2026</p>
          
          <div className="bg-elitos-cream p-6 rounded-xl mb-8">
            <h3 className="font-semibold text-elitos-brown mb-2">Quick Summary</h3>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>✓ Free replacement for damaged/defective products</li>
              <li>✓ Size exchange available (subject to stock)</li>
              <li>✓ 48-hour reporting window for damaged items</li>
              <li>✓ Dedicated WhatsApp support</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-8">
            <p className="text-amber-800 font-medium">📌 Important Note</p>
            <p className="text-amber-700 text-sm mt-1">
              ELITOS does not offer refunds or returns. We only provide exchanges for damaged/defective products or size issues. Please read our policy carefully before placing your order.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Damaged or Defective Products</h2>
            <p className="text-gray-600 mb-2">If you receive a damaged or defective product:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Contact us within 48 hours of delivery with clear photos/videos</li>
              <li>Share your Order ID and describe the issue</li>
              <li>Our team will verify and arrange free pickup</li>
              <li>Replacement will be shipped within 3-5 business days</li>
              <li>If same product unavailable, store credit will be provided</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Size Exchange</h2>
            <p className="text-gray-600 mb-2">We offer one free size exchange per order:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Request within 7 days of delivery</li>
              <li>Product must be unused, unworn, and in original condition</li>
              <li>Original tags and packaging must be intact</li>
              <li>Subject to size availability</li>
              <li>Customer bears shipping cost for size exchange</li>
            </ul>
            <p className="text-gray-600 mt-3 text-sm">
              💡 Tip: Check our <strong>Size Guide</strong> before ordering to ensure the perfect fit!
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Non-Exchangeable Items</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Products marked as "Final Sale" or "Non-Exchangeable"</li>
              <li>Innerwear and socks (for hygiene reasons)</li>
              <li>Products with removed tags or damaged packaging</li>
              <li>Products showing signs of use or wear</li>
              <li>Customized or personalized items</li>
              <li>Items reported after 7 days of delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. How to Request an Exchange</h2>
            <ol className="list-decimal pl-6 text-gray-600 space-y-2">
              <li>Contact us via WhatsApp at +91-9876543210</li>
              <li>Provide your Order ID and reason for exchange</li>
              <li>Share clear photos of the product (for damaged items)</li>
              <li>Our team will verify eligibility within 24 hours</li>
              <li>Pack the product securely in original packaging</li>
              <li>Ship to our address (provided by our team)</li>
              <li>Replacement shipped after quality verification</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Order Cancellation</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Orders can be cancelled before shipping</li>
              <li>Contact us immediately via WhatsApp for cancellation</li>
              <li>Full refund for cancelled orders (processed in 3-5 business days)</li>
              <li>Orders already shipped cannot be cancelled</li>
              <li>COD orders: No refund processing needed</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Quality Guarantee</h2>
            <p className="text-gray-600 mb-2">At ELITOS, we stand behind our products:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>All products undergo quality checks before shipping</li>
              <li>We use premium materials for durability</li>
              <li>Manufacturing defects are covered for 30 days</li>
              <li>Normal wear and tear is not covered</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact for Support</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-2"><strong>WhatsApp (Preferred):</strong> +91-9876543210</p>
              <p className="text-gray-600 mb-2"><strong>Email:</strong> support@elitos.in</p>
              <p className="text-gray-600 mb-2"><strong>Response Time:</strong> Within 24 hours</p>
              <p className="text-gray-600"><strong>Address:</strong> A-111 Amar Colony, Lajpat Nagar 4, New Delhi 110024</p>
            </div>
          </section>

          <section className="bg-elitos-cream p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-elitos-brown mb-3">Why No Refunds?</h2>
            <p className="text-gray-700">
              To offer you the best prices on premium products, we operate on thin margins. Our no-refund policy helps us keep costs low and pass the savings to you. However, we're committed to your satisfaction – if there's any issue with your order, we'll make it right with a replacement or exchange.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
