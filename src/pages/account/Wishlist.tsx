import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useProducts } from '../../context/ProductContext';

interface WishlistProps {
  onBack: () => void;
}

const Wishlist = ({ onBack }: WishlistProps) => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { products } = useProducts();
  const { addToCart } = useCart();

  // Get actual product data for wishlist items
  const wishlistProducts = wishlist
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const moveToCart = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const moveAllToCart = () => {
    wishlistProducts.forEach(product => {
      if (product) {
        addToCart(product);
      }
    });
    clearWishlist();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 md:pb-0">
      <div className="container-custom py-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Back to Account
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-elitos-brown">My Wishlist</h1>
            <p className="text-gray-500">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</p>
          </div>
          {wishlist.length > 0 && (
            <button 
              onClick={moveAllToCart}
              className="btn-primary flex items-center gap-2"
            >
              <ShoppingCart size={18} />
              Move All to Cart
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save items you love to your wishlist.</p>
            <button onClick={onBack} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => {
              if (!product) return null;
              const originalPrice = Math.round(product.price * 1.25);
              const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
              
              return (
                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    >
                      <X size={18} className="text-gray-600 hover:text-red-500" />
                    </button>
                    {product.bestseller && (
                      <span className="absolute top-3 left-3 bg-elitos-orange text-white text-xs px-2 py-1 rounded-full">
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-elitos-orange font-bold text-lg">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-gray-400 text-sm line-through">
                        {formatPrice(originalPrice)}
                      </span>
                      <span className="text-green-600 text-xs font-medium">
                        {discount}% off
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveToCart(product)}
                        className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16} />
                        Move to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                      >
                        <Trash2 size={18} className="text-gray-500 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
