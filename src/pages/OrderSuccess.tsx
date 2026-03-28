import { CheckCircle, Package, MessageCircle, ArrowRight } from 'lucide-react';
import { CONTACT, WHATSAPP_MESSAGES } from '../config/contact';

interface OrderSuccessProps {
  orderId: string;
  onClose: () => void;
  onContinueShopping: () => void;
}

const OrderSuccess = ({ orderId, onClose, onContinueShopping }: OrderSuccessProps) => {
  const whatsappMessage = encodeURIComponent(WHATSAPP_MESSAGES.orderHelp(orderId));
  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-elitos-brown mb-2">
          Order Placed Successfully! 🎉
        </h2>
        
        <p className="text-gray-600 mb-6">
          Thank you for shopping with ELITOS. Your order has been confirmed.
        </p>

        {/* Order ID */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">Order ID</p>
          <p className="text-xl font-bold text-elitos-brown">{orderId}</p>
        </div>

        {/* What's Next */}
        <div className="text-left bg-elitos-cream/50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-elitos-brown mb-3 flex items-center gap-2">
            <Package size={18} /> What's Next?
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Order confirmation sent to your email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>You'll receive shipping updates via WhatsApp</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Expected delivery: 5-7 business days</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onContinueShopping}
            className="w-full bg-elitos-orange text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-elitos-red transition-colors"
          >
            Continue Shopping <ArrowRight size={18} />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
          >
            <MessageCircle size={18} /> Track on WhatsApp
          </a>

          <button
            onClick={onClose}
            className="w-full text-gray-500 py-2 text-sm hover:text-gray-700"
          >
            View Order Details
          </button>
        </div>

        {/* Support */}
        <p className="text-xs text-gray-400 mt-6">
          Need help? Contact us at {CONTACT.whatsappDisplay}
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
