import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { CONTACT } from '../config/contact';

interface ContactProps {
  onClose: () => void;
}

const Contact = ({ onClose }: ContactProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create WhatsApp message
    const message = encodeURIComponent(
      `Hi ELITOS Team!\n\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Subject: ${formData.subject}\n\n` +
      `Message:\n${formData.message}`
    );

    // Open WhatsApp
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${message}`, '_blank');

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b z-10">
          <div className="container-custom py-4 flex items-center justify-between">
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900">← Back</button>
            <h1 className="font-semibold">Contact Us</h1>
            <div className="w-16"></div>
          </div>
        </div>
        
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h2>
            <p className="text-gray-600 mb-8">
              Your message has been sent via WhatsApp. We'll get back to you within 24 hours.
            </p>
            <button onClick={onClose} className="btn-primary">
              Back to Home
            </button>
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
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">← Back</button>
          <h1 className="font-semibold">Contact Us</h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-elitos-brown to-elitos-red text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-white/80 max-w-xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-elitos-cream rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <a 
                  href={`tel:+${CONTACT.whatsapp}`}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-white transition-colors"
                >
                  <div className="w-10 h-10 bg-elitos-orange rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">{CONTACT.whatsappDisplay}</p>
                  </div>
                </a>

                <a 
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-white transition-colors"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-gray-600">Chat with us</p>
                  </div>
                </a>

                <a 
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-white transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600 text-sm break-all">{CONTACT.email}</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600 text-sm">{CONTACT.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-gray-600 text-sm">Mon - Sat: 10 AM - 7 PM</p>
                    <p className="text-gray-600 text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent('Hi! I need help with my order.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full p-3 bg-green-50 text-green-700 rounded-lg text-center font-medium hover:bg-green-100 transition-colors"
                >
                  Order Support
                </a>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent('Hi! I want to know about wholesale pricing.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full p-3 bg-orange-50 text-orange-700 rounded-lg text-center font-medium hover:bg-orange-100 transition-colors"
                >
                  Wholesale Inquiry
                </a>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent('Hi! I have a question about my order.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full p-3 bg-blue-50 text-blue-700 rounded-lg text-center font-medium hover:bg-blue-100 transition-colors"
                >
                  Order Support
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-2xl p-6 lg:p-8">
              <h3 className="font-semibold text-xl mb-6">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
                      placeholder="John Doe"
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
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="Order Inquiry">Order Inquiry</option>
                      <option value="Product Question">Product Question</option>
                      <option value="Shipping Query">Shipping Query</option>
                      <option value="Wholesale Inquiry">Wholesale Inquiry</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message via WhatsApp
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-12 bg-gray-100 rounded-2xl p-8 text-center">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Visit Our Store</h3>
          <p className="text-gray-600">{CONTACT.address}</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-elitos-orange font-medium hover:underline"
          >
            Get Directions →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
