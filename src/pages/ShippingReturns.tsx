import { Truck, Package, Clock, MapPin, Shield, CheckCircle } from 'lucide-react';
import { CONTACT } from '../config/contact';

const ShippingReturns = () => {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-elitos-brown mb-4">
            Shipping & Delivery
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fast and reliable delivery across India. Here's everything you need to know 
            about our shipping process.
          </p>
        </div>

        {/* Shipping Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Truck size={32} className="text-elitos-orange" />
            <h2 className="text-2xl font-bold text-elitos-brown">Shipping Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-elitos-cream rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4">Delivery Timeline</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Clock size={20} className="text-elitos-orange mt-1" />
                  <div>
                    <strong>Metro Cities:</strong> 2-4 business days
                    <p className="text-sm text-gray-600">Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={20} className="text-elitos-orange mt-1" />
                  <div>
                    <strong>Other Cities:</strong> 4-6 business days
                    <p className="text-sm text-gray-600">All other serviceable pin codes</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={20} className="text-elitos-orange mt-1" />
                  <div>
                    <strong>Remote Areas:</strong> 6-8 business days
                    <p className="text-sm text-gray-600">Hill stations, islands, and remote locations</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-elitos-cream rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4">Shipping Charges</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span>Orders above ₹999</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </li>
                <li className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span>Orders below ₹999</span>
                  <span className="font-semibold">₹49</span>
                </li>
                <li className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span>Express Delivery (1-2 days)</span>
                  <span className="font-semibold">₹149</span>
                </li>
                <li className="flex items-center justify-between py-2">
                  <span>Cash on Delivery</span>
                  <span className="font-semibold">Available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quality Guarantee Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={32} className="text-elitos-orange" />
            <h2 className="text-2xl font-bold text-elitos-brown">Quality Guarantee</h2>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-lg text-green-800 mb-2">
              ✓ 100% Authentic Products
            </h3>
            <p className="text-green-700">
              Every product is carefully inspected before shipping. We guarantee authenticity 
              and quality with every order.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border rounded-xl p-6">
              <Package size={32} className="text-elitos-orange mb-4" />
              <h3 className="font-semibold mb-2">Secure Packaging</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Double-layer protection</li>
                <li>• Waterproof packaging</li>
                <li>• Branded boxes</li>
                <li>• Tamper-proof seals</li>
              </ul>
            </div>

            <div className="border rounded-xl p-6">
              <MapPin size={32} className="text-elitos-orange mb-4" />
              <h3 className="font-semibold mb-2">Order Tracking</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time tracking</li>
                <li>• SMS & Email updates</li>
                <li>• Delivery notifications</li>
                <li>• Track from your account</li>
              </ul>
            </div>

            <div className="border rounded-xl p-6">
              <CheckCircle size={32} className="text-elitos-orange mb-4" />
              <h3 className="font-semibold mb-2">Delivery Partners</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Delhivery</li>
                <li>• BlueDart</li>
                <li>• DTDC</li>
                <li>• India Post</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-elitos-brown mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              { 
                q: 'Can I track my order?', 
                a: 'Yes! Once shipped, you\'ll receive a tracking link via SMS and email. You can also track from your account.' 
              },
              { 
                q: 'What if I receive a damaged product?', 
                a: 'Contact us immediately with photos via WhatsApp. We\'ll arrange a free replacement within 24 hours.' 
              },
              { 
                q: 'Can I change my delivery address?', 
                a: 'Yes, contact us before the order is shipped. Once shipped, address cannot be changed.' 
              },
              { 
                q: 'Do you ship internationally?', 
                a: 'Currently, we only ship within India. International shipping coming soon!' 
              },
              { 
                q: 'What payment methods do you accept?', 
                a: 'We accept UPI, Credit/Debit Cards, Net Banking, Wallets, and Cash on Delivery.' 
              },
            ].map((faq, idx) => (
              <details key={idx} className="border rounded-lg">
                <summary className="px-4 py-3 cursor-pointer font-medium hover:bg-gray-50">
                  {faq.q}
                </summary>
                <p className="px-4 pb-4 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="text-center bg-elitos-cream rounded-xl p-8">
          <h2 className="text-2xl font-bold text-elitos-brown mb-4">
            Need Help?
          </h2>
          <p className="text-gray-600 mb-6">
            Our support team is available 24/7 to assist you with any shipping queries.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              WhatsApp Support
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center gap-2 bg-elitos-brown hover:bg-elitos-red text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturns;
