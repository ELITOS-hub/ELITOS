import { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartSummaryProps {
  onCheckout?: () => void;
}

const CartSummary = ({ onCheckout }: CartSummaryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    setIsOpen(false);
    onCheckout?.();
  };

  // Calculate shipping
  const shipping = cart.totalPrice >= 999 ? 0 : 49;
  const total = cart.totalPrice + shipping;

  if (cart.totalItems === 0) {
    return null;
  }

  return (
    <>
      {/* Cart Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 bg-elitos-orange text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-elitos-red transition-colors z-40"
      >
        <ShoppingCart size={22} />
        <span className="absolute -top-1 -right-1 bg-elitos-brown text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {cart.totalItems}
        </span>
      </button>

      {/* Cart Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-elitos-brown">Your Cart ({cart.totalItems})</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="overflow-y-auto p-4 space-y-3 max-h-[40vh]">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                    {item.selectedSize && (
                      <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                    )}
                    <p className="text-elitos-orange font-semibold text-sm mt-1">{formatPrice(item.price)}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-white rounded-lg border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t p-4 space-y-3 bg-gray-50">
              {/* Price breakdown */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {cart.totalPrice < 999 && (
                  <p className="text-xs text-gray-500">
                    Add {formatPrice(999 - cart.totalPrice)} more for free shipping
                  </p>
                )}
              </div>
              
              <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-elitos-orange">{formatPrice(total)}</span>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Checkout <ArrowRight size={18} />
              </button>
              
              <button
                onClick={clearCart}
                className="w-full text-gray-500 hover:text-red-600 transition-colors text-sm py-1"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSummary;