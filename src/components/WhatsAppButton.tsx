import { MessageCircle } from 'lucide-react';
import { CONTACT, WHATSAPP_MESSAGES } from '../config/contact';

const WhatsAppButton = () => {
  const message = encodeURIComponent(WHATSAPP_MESSAGES.general);
  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} className="fill-white" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
        Chat with us!
      </span>
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25"></span>
    </a>
  );
};

export default WhatsAppButton;
