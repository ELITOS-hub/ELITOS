import { useState } from 'react';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowLeft, 
  ShoppingCart, Tag, Truck, Shield, ChevronRight,
  Heart, X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import { CONTACT } from '../config/contact';

interface CartPageProps {
  onBack: () => void;
  onCheckout: () => void;
  onViewProduct: (productId: string) => void;
}

const CartPage = ({ onBack, onCheckout, onViewProduct }: CartPageProps) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { products, getBestSellers } = useProducts();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const discount = appliedCoupon === 'ELITOS10' ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    if (couponCode.toUpperCase() === 'ELITOS10') {
      setAppliedCoupon('ELITOS10');
      setCouponCode('');
    } else if (couponCode.trim()) {
      setCouponError('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleMoveToWishlist = (item: typeof cart.items[0]) => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      addToWishlist(product.id);
      removeFromCart(item.id);
    }
  };

  const recommendedProducts = getBestSellers().filter(
    p => !cart.items.some(item => item.id === p.id)
  ).slice(0, 4);

  // Empty Cart State
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-20 md:pb-0">
        <div className="container-custom py-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </button>

          <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-lg mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added anything to your cart yet. 
              Start shopping to fill it up!
            </p>
            <button onClick={onBack} className="btn-primary px-8">
              Start Shopping
            </button>
          </div>

          {/* Recommended Products */}
          {recommendedProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">You might like these</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendedProducts.map((product) => (
                  <div 
                    key={product.id}
                    onClick={() => onViewProduct(product.id)}
                    className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</h4>
                      <p className="text-elitos-orange font-bold">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 md:pb-0">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-500">{cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button 
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const originalPrice = Math.round(item.price * 1.25);
              const inWishlist = isInWishlist(item.id);
              
              return (
                <div key={`${item.id}-${item.selectedSize}`} className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div 
                      className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                      onClick={() => onViewProduct(item.id)}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 
                            className="font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-elitos-orange"
                            onClick={() => onViewProduct(item.id)}
                          >
                            {item.name}
                          </h3>
                          {item.selectedSize && (
                            <p className="text-sm text-gray-500 mt-1">Size: {item.selectedSize}</p>
                          )}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-elitos-orange">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                        <span className="text-xs text-green-600 font-medium">
                          20% off
                        </span>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-200 rounded-l-lg"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-200 rounded-r-lg"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => inWishlist ? removeFromWishlist(item.id) : handleMoveToWishlist(item)}
                            className={`flex items-center gap-1 text-sm ${inWishlist ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                          >
                            <Heart size={16} className={inWishlist ? 'fill-current' : ''} />
                            <span className="hidden sm:inline">
                              {inWishlist ? 'In Wishlist' : 'Save'}
                            </span>
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <span className="text-sm text-gray-500">Item Total</span>
                        <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Trust Badges */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Truck size={24} className="text-elitos-orange mb-2" />
                  <span className="text-xs text-gray-600">Free Shipping above ₹999</span>
                </div>
                <div className="flex flex-col items-center">
                  <Shield size={24} className="text-elitos-orange mb-2" />
                  <span className="text-xs text-gray-600">100% Authentic</span>
                </div>
                <div className="flex flex-col items-center">
                  <Tag size={24} className="text-elitos-orange mb-2" />
                  <span className="text-xs text-gray-600">Best Prices</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Tag size={18} className="text-green-600" />
                      <span className="font-medium text-green-700">{appliedCoupon}</span>
                    </div>
                    <button 
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent text-sm"
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-500 text-xs mt-1">{couponError}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Try: ELITOS10 for 10% off</p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">FREE</span>
                  ) : (
                    <span className="font-medium">{formatPrice(shipping)}</span>
                  )}
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-elitos-orange">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Savings */}
              {(discount > 0 || shipping === 0) && (
                <div className="mt-4 bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-green-700 text-sm font-medium">
                    🎉 You're saving {formatPrice(discount + (subtotal >= 999 ? 99 : 0))} on this order!
                  </p>
                </div>
              )}

              {/* Free Shipping Progress */}
              {subtotal < 999 && (
                <div className="mt-4 bg-orange-50 rounded-lg p-3">
                  <p className="text-sm text-orange-700 mb-2">
                    Add {formatPrice(999 - subtotal)} more for FREE shipping!
                  </p>
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div 
                      className="bg-elitos-orange h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button 
                onClick={onCheckout}
                className="w-full bg-elitos-orange hover:bg-orange-600 text-white py-4 rounded-xl font-semibold mt-6 flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag size={20} />
                Proceed to Checkout
                <ChevronRight size={18} />
              </button>

              {/* Continue Shopping */}
              <button 
                onClick={onBack}
                className="w-full mt-3 py-3 text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                Continue Shopping
              </button>

              {/* WhatsApp Help */}
              <div className="mt-4 pt-4 border-t text-center">
                <p className="text-xs text-gray-500 mb-2">Need help with your order?</p>
                <a 
                  href={`https://wa.me/${CONTACT.whatsapp}?text=Hi, I need help with my cart`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 text-sm font-medium hover:underline"
                >
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">You might also like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedProducts.map((product) => {
                const originalPrice = Math.round(product.price * 1.25);
                return (
                  <div 
                    key={product.id}
                    onClick={() => onViewProduct(product.id)}
                    className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                  >
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {product.bestseller && (
                        <span className="absolute top-2 left-2 bg-elitos-orange text-white text-xs px-2 py-1 rounded-full">
                          Bestseller
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-elitos-orange font-bold">{formatPrice(product.price)}</span>
                        <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
