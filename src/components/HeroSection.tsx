import { MessageCircle, Mail, Star, Users, Truck } from 'lucide-react';
import WelcomeMessage from './WelcomeMessage';
import { CONTACT, WHATSAPP_MESSAGES, EMAIL_SUBJECTS } from '../config/contact';

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const wholesaleMessage = encodeURIComponent(WHATSAPP_MESSAGES.wholesale());
  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${wholesaleMessage}`;
  const emailUrl = `mailto:${CONTACT.email}?subject=${encodeURIComponent(EMAIL_SUBJECTS.wholesale)}`;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background with texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-elitos-cream via-white to-elitos-cream">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23521C0D' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-elitos-orange/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-elitos-red/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10 text-center py-12">
        <WelcomeMessage />

        {/* Micro trust line */}
        <div className="flex items-center justify-center gap-3 text-xs text-gray-500 mb-4 animate-fade-in">
          <span className="flex items-center gap-1">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            4.8/5 Rating
          </span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="flex items-center gap-1">
            <Users size={12} />
            10K+ Customers
          </span>
          <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block" />
          <span className="hidden sm:flex items-center gap-1">
            <Truck size={12} />
            Pan India
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-elitos-brown mb-3 animate-fade-in leading-tight">
          Drop in. <br className="md:hidden" /> Stand out.
        </h1>

        <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto mb-3 animate-slide-up">
          Fresh drops. Limited pairs. Made for those who walk different.
        </p>

        <p className="text-xs text-gray-500 mb-6 animate-slide-up">
          Free shipping above ₹999 • COD available • Pan India delivery
        </p>

        {/* Main CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 animate-slide-up">
          <button
            onClick={() => scrollToSection('bestsellers')}
            className="btn-primary text-base px-6 py-3 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Shop Best Sellers
          </button>
          <button
            onClick={() => scrollToSection('collections')}
            className="btn-secondary text-base px-6 py-3 transform hover:scale-105 transition-all duration-200"
          >
            Explore Collections
          </button>
        </div>

        {/* Retail vs Wholesale Strip */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-5 animate-slide-up">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Retail */}
            <div className="text-center md:text-left md:border-r md:border-gray-100 md:pr-5">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full mb-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Shop Online
              </div>
              <h3 className="text-base font-semibold text-elitos-brown mb-1">Retail Customers</h3>
              <p className="text-gray-600 text-xs mb-3">
                Easy checkout, COD available, free shipping above ₹999.
              </p>
              <button
                onClick={() => scrollToSection('bestsellers')}
                className="text-elitos-orange font-medium text-sm hover:underline"
              >
                Start Shopping →
              </button>
            </div>

            {/* Wholesale */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 text-xs font-medium px-2 py-1 rounded-full mb-2">
                Bulk Orders
              </div>
              <h3 className="text-base font-semibold text-elitos-brown mb-1">Wholesale Buyers</h3>
              <p className="text-gray-600 text-xs mb-3">
                Contact us for best bulk pricing and details.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition-colors"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
                <a
                  href={emailUrl}
                  className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1.5 px-3 rounded-lg transition-colors"
                >
                  <Mail size={14} />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 border-2 border-elitos-brown/30 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-elitos-brown/30 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
