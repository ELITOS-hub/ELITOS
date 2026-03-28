import { Phone, MapPin, Instagram, Facebook, Mail } from 'lucide-react';
import { CONTACT } from '../config/contact';

interface FooterProps {
  onWholesaleClick?: () => void;
  onNavigate?: (page: string) => void;
}

const Footer = ({ onWholesaleClick, onNavigate }: FooterProps) => {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 pt-4">
      {/* Rounded Footer Container */}
      <div className="container-custom">
        <div className="bg-elitos-brown text-white rounded-t-[2.5rem] overflow-hidden">
          <div className="px-8 lg:px-12 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="/logo.png" 
                    alt="ELITOS" 
                    className="h-10 w-auto brightness-0 invert"
                  />
                  <h3 className="text-2xl font-bold">ELITOS</h3>
                </div>
                <p className="text-white/70 text-sm mb-4">
                  Affordable Luxe. For Everyone.<br />
                  Premium footwear and winter essentials.
                </p>
                <div className="space-y-2 text-sm">
                  <a 
                    href={`tel:+${CONTACT.whatsapp}`}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <Phone size={16} />
                    {CONTACT.whatsappDisplay}
                  </a>
                  <a 
                    href={`mailto:${CONTACT.email}`}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <Mail size={16} />
                    {CONTACT.email}
                  </a>
                  <p className="flex items-center gap-2 text-white/70">
                    <MapPin size={16} />
                    {CONTACT.address}
                  </p>
                </div>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>
                    <button 
                      onClick={() => onNavigate?.('about')}
                      className="hover:text-white transition-colors text-left"
                    >
                      About Us
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={onWholesaleClick}
                      className="hover:text-white transition-colors text-left"
                    >
                      Wholesale
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate?.('contact')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Contact Us
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate?.('shipping')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Shipping & Delivery
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate?.('size-guide')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Size Guide
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate?.('why-us')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Why Buy From Us
                    </button>
                  </li>
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>
                    <button 
                      onClick={() => onNavigate?.('privacy')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate?.('terms')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Terms & Conditions
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate?.('refund')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Exchange Policy
                    </button>
                  </li>
                </ul>
              </div>

              {/* Connect With Us */}
              <div>
                <h3 className="font-semibold mb-4">Connect With Us</h3>
                <p className="text-sm text-white/70 mb-4">
                  Follow us on social media for the latest updates and exclusive offers.
                </p>
                {/* Social Links */}
                <div className="flex gap-3">
                  <a 
                    href={`https://instagram.com/${CONTACT.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all"
                  >
                    <Instagram size={20} />
                  </a>
                  <a 
                    href={`https://facebook.com/${CONTACT.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <Facebook size={20} />
                  </a>
                  <a 
                    href={`https://wa.me/${CONTACT.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
                  >
                    <Phone size={20} />
                  </a>
                  <a 
                    href={`mailto:${CONTACT.email}`}
                    className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-elitos-orange transition-colors"
                  >
                    <Mail size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-white/50">
                  © 2024 ELITOS. All rights reserved.
                </p>
                <p className="text-xs text-white/40 mt-1">
                  Developed by <a href="https://ragspro.com" target="_blank" rel="noopener noreferrer" className="text-elitos-orange hover:text-white transition-colors">RAGSPRO</a>
                </p>
              </div>
              
              {/* Back to Top Button */}
              <button 
                onClick={scrollToTop}
                className="group flex items-center gap-2 text-sm text-white/50 hover:text-white transition-all duration-300"
              >
                <span>Back to Top</span>
                <span className="inline-flex items-center justify-center w-8 h-8 bg-white/10 rounded-full group-hover:bg-elitos-orange group-hover:-translate-y-1 transition-all duration-300">↑</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
