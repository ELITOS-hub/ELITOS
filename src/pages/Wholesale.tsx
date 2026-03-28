import { useState } from 'react';
import { Package, TrendingUp, Truck, Shield, CheckCircle, ArrowRight, MessageCircle, Mail, Phone } from 'lucide-react';
import { CONTACT, WHATSAPP_MESSAGES, EMAIL_SUBJECTS } from '../config/contact';
import { wholesaleAPI } from '../services/api';

const benefits = [
  { icon: TrendingUp, title: 'Best Pricing', desc: 'Competitive wholesale rates for bulk orders' },
  { icon: Package, title: 'Bulk Orders', desc: 'Minimum quantity applicable per style' },
  { icon: Truck, title: 'Pan India Delivery', desc: 'We deliver across all major cities' },
  { icon: Shield, title: 'Quality Guarantee', desc: '100% authentic products' },
];

interface WholesaleProps {
  onClose: () => void;
}

const Wholesale = ({ onClose }: WholesaleProps) => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    city: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const wholesaleMessage = encodeURIComponent(WHATSAPP_MESSAGES.wholesale());
  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${wholesaleMessage}`;
  const emailUrl = `mailto:${CONTACT.email}?subject=${encodeURIComponent(EMAIL_SUBJECTS.wholesale)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Save to localStorage for admin dashboard
    const inquiry = {
      id: 'WS-' + Date.now(),
      businessName: formData.businessName,
      ownerName: formData.ownerName,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      expectedMonthlyQty: formData.message || 'Not specified',
      status: 'new' as const,
      createdAt: new Date().toISOString(),
    };
    
    const existing = localStorage.getItem('elitos_wholesale_inquiries');
    const inquiries = existing ? JSON.parse(existing) : [];
    inquiries.unshift(inquiry);
    localStorage.setItem('elitos_wholesale_inquiries', JSON.stringify(inquiries));
    
    try {
      // Also try to save to database
      await wholesaleAPI.apply({
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        email: formData.email,
        expectedMonthlyQty: formData.message || 'Not specified',
      });
    } catch (err) {
      // Continue even if API fails - data is saved locally
      console.error('Failed to save to API:', err);
    }
    
    // Create WhatsApp message with form data
    const formMessage = encodeURIComponent(
      `Hi ELITOS Team,\n\n` +
      `I am interested in wholesale purchase.\n\n` +
      `Business: ${formData.businessName}\n` +
      `Name: ${formData.ownerName}\n` +
      `Phone: ${formData.phone}\n` +
      `Email: ${formData.email}\n` +
      `City: ${formData.city}\n` +
      `${formData.message ? `Message: ${formData.message}\n` : ''}\n` +
      `Please share pricing and details.\n\nThank you!`
    );
    
    // Open WhatsApp with form data
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${formMessage}`, '_blank');
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You!
            </h1>
            <p className="text-gray-600 mb-8">
              Your enquiry has been sent via WhatsApp. Our team will get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Continue on WhatsApp
              </a>
              <button
                onClick={onClose}
                className="block w-full btn-secondary"
              >
                Back to Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b z-10">
        <div className="container-custom py-4 flex items-center justify-between">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
            ← Back
          </button>
          <h1 className="font-semibold">Wholesale Enquiry</h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-elitos-brown to-elitos-red text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Wholesale Partnership
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Partner with ELITOS for quality footwear and winterwear at wholesale prices.
          </p>
          
          {/* Quick Contact Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <MessageCircle size={20} />
              WhatsApp Now
            </a>
            <a
              href={emailUrl}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <Mail size={20} />
              Email Us
            </a>
            <a
              href={`tel:+${CONTACT.whatsapp}`}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <Phone size={20} />
              Call Us
            </a>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="text-center p-6 bg-elitos-cream rounded-xl">
              <div className="w-14 h-14 bg-elitos-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-elitos-brown mb-8">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Contact Us', desc: 'Reach out via WhatsApp or Email with your requirements' },
              { step: '2', title: 'Get Quote', desc: 'Our team will share pricing and minimum order details' },
              { step: '3', title: 'Place Order', desc: 'Confirm your order and we handle the rest' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-elitos-orange text-white rounded-full flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  {idx < 2 && (
                    <ArrowRight className="hidden md:block text-gray-300 absolute right-0 top-5" size={24} />
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-elitos-brown mb-2">
              Send Enquiry
            </h2>
            <p className="text-gray-600 mb-6">
              Fill the form below and we'll get back to you within 24 hours.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
                    placeholder="Your store/business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
                    placeholder="Your city"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MessageCircle size={20} />
                    Send via WhatsApp
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Direct Contact */}
        <div className="mt-12 text-center bg-elitos-cream rounded-2xl p-8">
          <h3 className="text-xl font-bold text-elitos-brown mb-4">
            Prefer to Contact Directly?
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div>
              <p className="text-gray-500 text-sm mb-1">WhatsApp / Call</p>
              <a href={`tel:+${CONTACT.whatsapp}`} className="text-elitos-orange font-semibold text-lg hover:underline">
                {CONTACT.whatsappDisplay}
              </a>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Email</p>
              <a href={`mailto:${CONTACT.email}`} className="text-elitos-orange font-semibold text-lg hover:underline">
                {CONTACT.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wholesale;
