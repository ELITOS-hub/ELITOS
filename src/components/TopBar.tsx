import { Phone, Mail, Truck } from 'lucide-react';
import { CONTACT, WHATSAPP_MESSAGES } from '../config/contact';

interface TopBarProps {
  onWholesaleClick?: () => void;
}

const TopBar = ({ onWholesaleClick }: TopBarProps) => {
  const wholesaleMessage = encodeURIComponent(WHATSAPP_MESSAGES.wholesale());
  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${wholesaleMessage}`;

  return (
    <div className="bg-elitos-brown text-white text-sm py-2">
      <div className="container-custom flex items-center justify-between">
        {/* Left - Contact */}
        <div className="hidden md:flex items-center gap-4">
          <a 
            href={`tel:+${CONTACT.whatsapp}`}
            className="flex items-center gap-1 hover:text-elitos-orange transition-colors"
          >
            <Phone size={14} />
            <span>{CONTACT.whatsappDisplay}</span>
          </a>
          <a 
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-1 hover:text-elitos-orange transition-colors"
          >
            <Mail size={14} />
            <span>{CONTACT.email}</span>
          </a>
        </div>

        {/* Center - Shipping Info */}
        <div className="flex items-center gap-1 text-center flex-1 md:flex-none justify-center">
          <Truck size={14} />
          <span>Free Shipping on Orders Above ₹999</span>
        </div>

        {/* Right - Wholesale CTA */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-white/70">Wholesale?</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-elitos-orange hover:text-white transition-colors font-medium"
          >
            Contact Us
          </a>
          <span className="text-white/50">|</span>
          <button
            onClick={onWholesaleClick}
            className="hover:text-elitos-orange transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
