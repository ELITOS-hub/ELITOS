import { Shield, Truck, Award, Heart, Clock, Sparkles } from 'lucide-react';

const reasons = [
  {
    icon: Shield,
    title: '100% Authentic Products',
    description: 'Every product is sourced directly from manufacturers. We guarantee authenticity with every purchase.',
  },
  {
    icon: Truck,
    title: 'Free & Fast Delivery',
    description: 'Free shipping on orders above ₹999. Most orders delivered within 3-5 business days across India.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'We handpick every product for quality. Only the best makes it to our store.',
  },
  {
    icon: Heart,
    title: '10,000+ Happy Customers',
    description: 'Join thousands of satisfied customers who trust ELITOS for their style needs.',
  },
  {
    icon: Clock,
    title: '24/7 Customer Support',
    description: 'Our team is always here to help via WhatsApp, email, or phone.',
  },
  {
    icon: Sparkles,
    title: 'Affordable Luxury',
    description: 'Premium products at prices that won\'t break the bank. Style for everyone.',
  },
];

const WhyBuyFromUs = () => {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-elitos-brown mb-4">
            Why Buy From ELITOS?
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're not just another online store. We're committed to bringing you 
            the best products with an unmatched shopping experience.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className="bg-elitos-cream rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-elitos-orange rounded-full flex items-center justify-center mb-4">
                <reason.icon size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-elitos-brown mb-2">
                {reason.title}
              </h3>
              <p className="text-gray-600">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-elitos-brown mb-8">
            Trusted By Thousands
          </h2>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png" alt="Stripe" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" alt="Google" className="h-8" />
            <span className="text-2xl font-bold text-gray-400">Razorpay</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-elitos-brown text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience the ELITOS Difference?
          </h2>
          <p className="text-white/80 mb-8">
            Join 10,000+ happy customers who chose quality and style.
          </p>
          <button className="bg-elitos-orange hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhyBuyFromUs;
