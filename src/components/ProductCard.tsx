import { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  // Check if product is in wishlist
  const isLiked = isInWishlist(product.id);
  
  // Pricing psychology - calculate original price if not provided
  const originalPrice = (product as any).originalPrice || Math.round(product.price * 1.25);
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const stockLeft = product.stock || ((parseInt(product.id.replace(/\D/g, '') || '0') * 3) % 10 + 2);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product);
      setIsAdding(false);
    }, 300);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      className="group relative bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-t-2xl">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Wishlist Heart Icon */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 p-1.5 rounded-xl backdrop-blur-md transition-all duration-200 z-10 ${
            isLiked 
              ? 'bg-red-500 text-white shadow-lg scale-110' 
              : 'bg-white/70 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
        </button>

        {/* Quick Add Button */}
        <div className={`absolute inset-x-2 bottom-2 transition-all duration-300 z-10 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full bg-elitos-brown/90 backdrop-blur-sm text-white py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
              isAdding 
                ? 'bg-elitos-orange cursor-not-allowed' 
                : 'hover:bg-elitos-orange'
            }`}
          >
            {isAdding ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-lg backdrop-blur-md bg-blue-500/80 text-white capitalize">
            {product.category}
          </span>
        </div>

        {/* Bestseller Badge */}
        {product.bestseller && (
          <div className="absolute top-8 left-2">
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-lg bg-elitos-orange/90 backdrop-blur-md text-white">
              🔥 Bestseller
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
          {product.name}
        </h3>
        
        {/* Price with discount */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-elitos-orange font-bold text-base">
            {formatPrice(product.price)}
          </span>
          <span className="text-gray-400 text-xs line-through">
            {formatPrice(originalPrice)}
          </span>
          <span className="text-green-600 text-[10px] font-semibold bg-green-50 px-1.5 py-0.5 rounded">
            {discount}% off
          </span>
        </div>
        
        {/* Low Stock Warning */}
        {stockLeft < 8 && (
          <p className="text-red-500 text-[10px] font-medium mt-1">
            Only {stockLeft} left!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
