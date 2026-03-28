import { ArrowLeft, Heart, Award, Users, Sparkles, Target, Shield, Truck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CONTACT } from '../config/contact';

interface AboutUsProps {
  onClose: () => void;
}

const AboutUs = ({ onClose }: AboutUsProps) => {
  return (
    <div className="min-h-screen bg-white">
      <Header 
        onWholesaleClick={() => {}}
        onAdminClick={() => {}}
        onBlogClick={() => {}}
        onShopClick={() => {}}
        onHomeClick={onClose}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-elitos-cream via-white to-orange-50 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-elitos-orange rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-elitos-brown rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-custom relative">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-elitos-orange mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-elitos-orange/10 text-elitos-orange rounded-full text-sm font-medium mb-6">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-elitos-orange">ELITOS</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Affordable Luxe. For Everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Our Journey
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Elitos is an affordable-luxe fashion brand founded by <strong>Raminder Babbar</strong> and <strong>Ranjan Babbar</strong>, created with a vision to make premium fashion accessible without compromising on quality or style.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We curate high-quality fashion essentials that blend modern trends with everyday comfort. Currently, our collection includes footwear and winter puffer jackets, designed to deliver a refined look, durability, and value at sensible prices.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Elitos, we believe great fashion should feel elevated yet effortless—luxury in style, smart in price.
              </p>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-elitos-cream to-orange-100 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-xl">
                      <img src="/logo.png" alt="ELITOS" className="w-20 h-20 object-contain" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">ELITOS</h3>
                    <p className="text-gray-600">Est. 2023</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-elitos-orange/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-elitos-brown/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Meet Our Founders</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The visionaries behind ELITOS who are passionate about making premium fashion accessible to everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-elitos-orange to-orange-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                RB
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Raminder Babbar</h3>
              <p className="text-elitos-orange font-medium mb-3">Co-Founder</p>
              <p className="text-gray-600 text-sm">
                Bringing years of experience in fashion retail and a keen eye for quality craftsmanship.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-elitos-brown to-amber-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                RB
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Ranjan Babbar</h3>
              <p className="text-elitos-orange font-medium mb-3">Co-Founder</p>
              <p className="text-gray-600 text-sm">
                Passionate about creating value-driven products that don't compromise on style or comfort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-elitos-orange to-orange-500 rounded-3xl p-8 lg:p-10 text-white">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/90 leading-relaxed">
                To democratize premium fashion by offering high-quality, stylish products at prices that make sense. We're committed to proving that looking good doesn't have to cost a fortune.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-elitos-brown to-amber-800 rounded-3xl p-8 lg:p-10 text-white">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-white/90 leading-relaxed">
                To become India's most trusted affordable-luxe fashion brand, known for exceptional quality, contemporary designs, and unmatched value. We envision a world where everyone can access premium fashion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-elitos-cream/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What We Stand For</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our core values guide everything we do, from product selection to customer service.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Quality First', desc: 'Premium materials and craftsmanship in every product' },
              { icon: Heart, title: 'Customer Love', desc: 'Your satisfaction is our top priority, always' },
              { icon: Shield, title: 'Trust & Transparency', desc: 'Honest pricing with no hidden costs' },
              { icon: Truck, title: 'Reliable Service', desc: 'Fast shipping across India' },
            ].map((value, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 mx-auto mb-4 bg-elitos-orange/10 rounded-xl flex items-center justify-center">
                  <value.icon size={24} className="text-elitos-orange" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { number: '10,000+', label: 'Happy Customers' },
                { number: '500+', label: 'Products Sold' },
                { number: '4.8★', label: 'Average Rating' },
                { number: '100%', label: 'Quality Assured' },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="text-3xl lg:text-4xl font-bold text-elitos-orange mb-2">{stat.number}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Carefully curated collections designed for the modern individual.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <span className="text-6xl">👟</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Footwear</h3>
                <p className="text-gray-600">
                  From casual sneakers to formal shoes, our footwear collection combines comfort with contemporary style. Each pair is crafted with premium materials for lasting durability.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <span className="text-6xl">🧥</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Winter Puffer Jackets</h3>
                <p className="text-gray-600">
                  Stay warm in style with our collection of puffer jackets. Designed for Indian winters, they offer the perfect balance of warmth, comfort, and fashion-forward design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="bg-elitos-cream rounded-3xl p-8 lg:p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-elitos-orange rounded-full flex items-center justify-center">
              <Users size={28} className="text-white" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Join the ELITOS Family
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Experience affordable luxury that doesn't compromise on quality. Shop our collection and discover why thousands of customers trust ELITOS for their fashion needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-elitos-orange text-white rounded-full font-medium hover:bg-orange-600 transition-colors"
              >
                Shop Now
              </button>
              <a 
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors border border-gray-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer onWholesaleClick={() => {}} onNavigate={() => {}} />
    </div>
  );
};

export default AboutUs;
