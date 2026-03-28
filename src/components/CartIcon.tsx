import { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartIconProps {
  onViewCart?: () => void;
}

const CartIcon = ({ onViewCart }: CartIconProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleViewCart = () => {
    setIsOpen(false);
    onViewCart?.();
  };

  return (
    <>
      {/* Cart Icon Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-700 hover:text-elitos-orange transition-colors relative"
      >
        <ShoppingCart size={20} />
        {cart.totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-elitos-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cart.totalItems}
          </span>
        )}
      </button>

      {/* Cart Dropdown/Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Cart Panel */}
          <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Shopping Cart ({cart.totalItems})</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {cart.items.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="max-h-64 overflow-y-auto p-4 space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-elitos-orange font-semibold text-sm">{formatPrice(item.price)}</p>
                        {item.selectedSize && (
                          <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors ml-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t p-4 space-y-3">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span className="text-elitos-orange">{formatPrice(cart.totalPrice)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <button 
                      onClick={handleViewCart}
                      className="w-full btn-primary text-sm py-2 flex items-center justify-center gap-2"
                    >
                      View Cart & Checkout
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => {
                        clearCart();
                        setIsOpen(false);
                      }}
                      className="w-full text-gray-600 hover:text-red-600 transition-colors text-xs"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CartIcon;