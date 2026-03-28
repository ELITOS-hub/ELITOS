import { useState, useEffect } from 'react';
import { 
  Heart, Share2, Truck, Shield, Star, Check,
  Minus, Plus, ChevronLeft, ChevronRight,
  Ruler, Package, Clock, X, Copy, Mail, Send
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewContext';
import Header from './Header';
import Footer from './Footer';

interface ProductDetailPageProps {
  product: Product;
  onClose: () => void;
  onViewProduct?: (product: Product) => void;
  onBuyNow?: (product: Product, size: string, quantity: number) => void;
}

const ProductDetailPage = ({ product, onClose, onViewProduct, onBuyNow }: ProductDetailPageProps) => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { auth } = useAuth();
  const { getReviewsByProduct, addReview } = useReviews();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'material' | 'shipping' | 'reviews'>('description');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  // Get product reviews
  const productReviews = getReviewsByProduct(product.id);

  // Check if product is in wishlist
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  // Recently viewed
  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
    const filtered = viewed.filter((id: string) => id !== product.id);
    const updated = [product.id, ...filtered].slice(0, 10);
    localStorage.setItem('recently_viewed', JSON.stringify(updated));
  }, [product.id]);

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.id]);

  const productImages = [
    product.image,
    product.images?.[1] || product.image.replace('w=600', 'w=601'),
    product.images?.[2] || product.image.replace('w=600', 'w=602'),
    product.images?.[3] || product.image.replace('w=600', 'w=603'),
  ];

  const sizes = product.sizes || ['4', '5', '6', '7', '8', '9', '10', '11'];
  const originalPrice = Math.round(product.price * 1.2);
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  // Similar products (same gender + category)
  const similarProducts = products
    .filter(p => 
      p.id !== product.id &&
      p.category === product.category &&
      (p.gender === product.gender || p.gender === 'unisex' || product.gender === 'unisex')
    )
    .slice(0, 4);

  // Customers also bought (same gender, different category)
  const alsoBought = products
    .filter(p => 
      p.id !== product.id &&
      p.category !== product.category &&
      (p.gender === product.gender || p.gender === 'unisex' || product.gender === 'unisex')
    )
    .slice(0, 4);

  // Recently viewed
  const recentlyViewedIds = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
  const recentlyViewed = recentlyViewedIds
    .filter((id: string) => id !== product.id)
    .map((id: string) => products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

  const handleBuyNow = () => {
    if (!selectedSize) return;
    // Add to cart first with selected size
    const cartItem = { ...product, selectedSize };
    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem as any);
    }
    // Then trigger buy now callback to go to cart/checkout
    if (onBuyNow) {
      onBuyNow(product, selectedSize, quantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    setIsAdding(true);
    setTimeout(() => {
      const cartItem = { ...product, selectedSize };
      for (let i = 0; i < quantity; i++) addToCart(cartItem as any);
      setIsAdding(false);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }, 600);
  };

  const handleShare = async () => {
    setShowShareMenu(true);
  };

  const getProductUrl = () => {
    const baseUrl = import.meta.env.VITE_SITE_URL || 'https://elitos.ragspro.com';
    return `${baseUrl}/product/${product.id}`;
  };

  const handleCopyLink = async () => {
    const url = getProductUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowShareMenu(false);
      }, 1500);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowShareMenu(false);
      }, 1500);
    }
  };

  const handleShareWhatsApp = () => {
    const url = getProductUrl();
    const text = `Check out ${product.name} on ELITOS! ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setShowShareMenu(false);
  };

  const handleShareFacebook = () => {
    const url = getProductUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const handleShareTwitter = () => {
    const url = getProductUrl();
    const text = `Check out ${product.name} on ELITOS!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const handleShareEmail = () => {
    const url = getProductUrl();
    const subject = `Check out ${product.name} on ELITOS`;
    const body = `Hey! I found this amazing product on ELITOS:\n\n${product.name}\nPrice: ${formatPrice(product.price)}\n\n${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setShowShareMenu(false);
  };

  const handleNativeShare = async () => {
    const url = getProductUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on ELITOS!`,
          url: url,
        });
        setShowShareMenu(false);
      } catch (err) {
        // User cancelled or error
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!auth.isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }
    
    if (!reviewText.trim() || reviewText.length < 10) {
      alert('Please write at least 10 characters for your review');
      return;
    }
    
    setIsSubmittingReview(true);
    try {
      await addReview({
        productId: product.id,
        name: auth.user?.name || 'Anonymous',
        location: 'India',
        rating: reviewRating,
        text: reviewText,
        product: product.name,
        image: auth.user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
      });
      setReviewSubmitted(true);
      setReviewText('');
      setReviewRating(5);
      setShowReviewForm(false);
      setTimeout(() => setReviewSubmitted(false), 3000);
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Calculate average rating from product reviews
  const avgRating = productReviews.length > 0 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : '4.8';
  const totalReviews = productReviews.length || 128;

  const handleProductClick = (p: Product) => {
    if (onViewProduct) {
      onViewProduct(p);
    }
  };

  const handleNavigate = (page: string) => {
    if (page === 'home') onClose();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        onWholesaleClick={() => {}}
        onAdminClick={() => {}}
        onBlogClick={() => {}}
        onShopClick={() => {}}
        onViewProduct={onViewProduct}
        onHomeClick={onClose}
      />

      {/* Breadcrumb */}
      <div className="container-custom py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={onClose} className="hover:text-elitos-orange">Home</button>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden group">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Navigation */}
              <button
                onClick={() => setSelectedImage(i => i > 0 ? i - 1 : productImages.length - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setSelectedImage(i => i < productImages.length - 1 ? i + 1 : 0)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 justify-center">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden transition-all ${
                    selectedImage === idx ? 'ring-2 ring-elitos-orange' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <p className="text-sm font-medium text-gray-400 tracking-widest mb-1">ELITOS</p>
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-500 text-sm">{product.description || 'Premium quality crafted for comfort & style.'}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.round(parseFloat(avgRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{avgRating} · {totalReviews} reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-gray-900">{formatPrice(product.price)}</span>
              <span className="text-lg text-gray-400 line-through">{formatPrice(originalPrice)}</span>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{discount}% off</span>
            </div>

            {/* Stock */}
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              In Stock · Ready to Ship
            </p>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">Select Size</span>
                <button onClick={() => setShowSizeGuide(true)} className="text-sm text-gray-500 hover:text-elitos-orange flex items-center gap-1">
                  <Ruler size={14} /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-12 px-4 rounded-xl font-medium text-sm transition-all ${
                      selectedSize === size
                        ? 'bg-gray-900 text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && <p className="text-xs text-amber-600 mt-2">Please select a size</p>}
            </div>

            {/* Quantity */}
            <div>
              <span className="text-sm font-medium text-gray-900 block mb-3">Quantity</span>
              <div className="inline-flex items-center bg-white border border-gray-200 rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900">
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || isAdding}
                className={`flex-1 h-14 rounded-2xl font-medium transition-all flex items-center justify-center gap-2 ${
                  !selectedSize ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : addedToCart ? 'bg-green-500 text-white'
                    : 'bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                }`}
              >
                {isAdding ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  : addedToCart ? <><Check size={18} /> Added!</>
                  : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!selectedSize}
                className={`flex-1 h-14 rounded-2xl font-medium transition-all ${
                  !selectedSize ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-elitos-orange text-white hover:bg-orange-600'
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={toggleWishlist}
                className={`flex items-center gap-2 text-sm ${isWishlisted ? 'text-red-500' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                {isWishlisted ? 'Saved' : 'Save'}
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
                {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              {[
                { icon: Package, text: 'Premium Quality' },
                { icon: Shield, text: 'Secure Checkout' },
                { icon: Truck, text: 'Fast Dispatch' },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <item.icon size={20} className="mx-auto text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 bg-white rounded-2xl overflow-hidden">
          <div className="flex border-b">
            {(['description', 'material', 'shipping', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 text-sm font-medium capitalize transition-all ${
                  activeTab === tab ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === 'material' ? 'Material & Care' : tab}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-600 mb-4">Step into comfort with the {product.name}. Crafted with premium materials for everyday wear.</p>
                <ul className="space-y-2">
                  {['Premium quality materials', 'Cushioned insole', 'Durable construction', 'Versatile design'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                      <Check size={16} className="text-green-500" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'material' && (
              <div className="grid grid-cols-2 gap-4">
                {[{ label: 'Upper', value: 'Premium Leather' }, { label: 'Sole', value: 'Rubber' }, { label: 'Lining', value: 'Breathable Mesh' }, { label: 'Care', value: 'Wipe with damp cloth' }].map((item, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                    <span className="text-xs text-gray-400 uppercase">{item.label}</span>
                    <p className="font-medium text-gray-900 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-4">
                {[{ icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' }, { icon: Clock, title: 'Delivery', desc: '3-5 business days' }, { icon: Package, title: 'Quality Guarantee', desc: '100% authentic products' }].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <item.icon size={20} className="text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{avgRating}</div>
                    <div className="flex gap-0.5 justify-center my-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < Math.round(parseFloat(avgRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />)}
                    </div>
                    <div className="text-xs text-gray-500">{totalReviews} reviews</div>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 bg-elitos-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                  >
                    Write a Review
                  </button>
                </div>
                
                {/* Review Success Message */}
                {reviewSubmitted && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                    <Check size={16} />
                    Thank you! Your review has been submitted.
                  </div>
                )}
                
                {/* Review Form */}
                {showReviewForm && (
                  <div className="p-4 bg-white border rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Write Your Review</h4>
                      <button onClick={() => setShowReviewForm(false)} className="p-1 hover:bg-gray-100 rounded">
                        <X size={18} />
                      </button>
                    </div>
                    
                    {!auth.isAuthenticated ? (
                      <p className="text-sm text-gray-500">Please login to write a review.</p>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Your Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="p-1"
                              >
                                <Star size={24} className={star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Your Review</label>
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
                            placeholder="Share your experience with this product..."
                          />
                          <p className="text-xs text-gray-400 mt-1">{reviewText.length}/500 characters (min 10)</p>
                        </div>
                        
                        <button
                          onClick={handleSubmitReview}
                          disabled={isSubmittingReview || reviewText.length < 10}
                          className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                            isSubmittingReview || reviewText.length < 10
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-elitos-orange text-white hover:bg-orange-600'
                          }`}
                        >
                          {isSubmittingReview ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Send size={16} />
                              Submit Review
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                )}
                
                {/* Reviews List */}
                {productReviews.length > 0 ? (
                  productReviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <img src={review.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                        <span className="font-medium text-sm">{review.name}</span>
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
                        )}
                        <div className="flex gap-0.5 ml-auto">
                          {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <>
                    {[{ name: 'Amit K.', rating: 5, text: 'Perfect fit!', date: '2 days ago' }, { name: 'Sneha R.', rating: 4, text: 'Great quality.', date: '1 week ago' }].map((review, idx) => (
                      <div key={idx} className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">{review.name[0]}</div>
                          <span className="font-medium text-sm">{review.name}</span>
                          <div className="flex gap-0.5 ml-auto">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{review.text}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        {similarProducts.length > 0 && (
          <RecommendationSection title="Similar Products" products={similarProducts} onProductClick={handleProductClick} />
        )}
        {alsoBought.length > 0 && (
          <RecommendationSection title="You May Also Like" products={alsoBought} onProductClick={handleProductClick} />
        )}
        {recentlyViewed.length > 0 && (
          <RecommendationSection title="Recently Viewed" products={recentlyViewed} onProductClick={handleProductClick} />
        )}
      </div>

      {/* Footer */}
      <Footer onWholesaleClick={() => {}} onNavigate={handleNavigate} />

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Size Guide (Indian Sizes)</h3>
              <button onClick={() => setShowSizeGuide(false)} className="p-2 hover:bg-gray-100 rounded-full">×</button>
            </div>
            
            {/* Men's Sizes */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Men's Footwear</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">India</th>
                      <th className="px-3 py-2 text-left">UK</th>
                      <th className="px-3 py-2 text-left">US</th>
                      <th className="px-3 py-2 text-left">EU</th>
                      <th className="px-3 py-2 text-left">Foot (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { ind: '6', uk: '5', us: '6', eu: '39', cm: '24.5' },
                      { ind: '7', uk: '6', us: '7', eu: '40', cm: '25.4' },
                      { ind: '8', uk: '7', us: '8', eu: '41', cm: '26.2' },
                      { ind: '9', uk: '8', us: '9', eu: '42', cm: '27.1' },
                      { ind: '10', uk: '9', us: '10', eu: '43', cm: '27.9' },
                      { ind: '11', uk: '10', us: '11', eu: '44', cm: '28.8' },
                      { ind: '12', uk: '11', us: '12', eu: '45', cm: '29.6' },
                    ].map((row) => (
                      <tr key={row.ind}>
                        <td className="px-3 py-2 font-medium">{row.ind}</td>
                        <td className="px-3 py-2 text-gray-500">{row.uk}</td>
                        <td className="px-3 py-2 text-gray-500">{row.us}</td>
                        <td className="px-3 py-2 text-gray-500">{row.eu}</td>
                        <td className="px-3 py-2 text-gray-500">{row.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Women's Sizes */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Women's Footwear</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">India</th>
                      <th className="px-3 py-2 text-left">UK</th>
                      <th className="px-3 py-2 text-left">US</th>
                      <th className="px-3 py-2 text-left">EU</th>
                      <th className="px-3 py-2 text-left">Foot (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { ind: '4', uk: '3', us: '5', eu: '35', cm: '22.1' },
                      { ind: '5', uk: '4', us: '6', eu: '36', cm: '22.9' },
                      { ind: '6', uk: '5', us: '7', eu: '37', cm: '23.8' },
                      { ind: '7', uk: '6', us: '8', eu: '38', cm: '24.6' },
                      { ind: '8', uk: '7', us: '9', eu: '39', cm: '25.4' },
                      { ind: '9', uk: '8', us: '10', eu: '40', cm: '26.2' },
                    ].map((row) => (
                      <tr key={row.ind}>
                        <td className="px-3 py-2 font-medium">{row.ind}</td>
                        <td className="px-3 py-2 text-gray-500">{row.uk}</td>
                        <td className="px-3 py-2 text-gray-500">{row.us}</td>
                        <td className="px-3 py-2 text-gray-500">{row.eu}</td>
                        <td className="px-3 py-2 text-gray-500">{row.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* How to Measure */}
            <div className="bg-elitos-cream/50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">How to Measure</h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Place your foot on a paper against a wall</li>
                <li>Mark the longest toe and heel</li>
                <li>Measure the distance in cm</li>
                <li>Match with the chart above</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowShareMenu(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Share Product</h3>
              <button onClick={() => setShowShareMenu(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            {/* Product Preview */}
            <div className="p-4 bg-gray-50 flex items-center gap-3">
              <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{product.name}</p>
                <p className="text-elitos-orange font-semibold">{formatPrice(product.price)}</p>
              </div>
            </div>
            
            {/* Share Options */}
            <div className="p-4 grid grid-cols-4 gap-4">
              <button onClick={handleShareWhatsApp} className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">WhatsApp</span>
              </button>
              
              <button onClick={handleShareFacebook} className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </button>
              
              <button onClick={handleShareTwitter} className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Twitter</span>
              </button>
              
              <button onClick={handleShareEmail} className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-600">Email</span>
              </button>
            </div>
            
            {/* Copy Link */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-3">
                <input 
                  type="text" 
                  value={getProductUrl()} 
                  readOnly 
                  className="flex-1 bg-transparent text-sm text-gray-600 outline-none truncate"
                />
                <button 
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    copied ? 'bg-green-500 text-white' : 'bg-elitos-orange text-white hover:bg-orange-600'
                  }`}
                >
                  {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
                </button>
              </div>
            </div>
            
            {/* Native Share (Mobile) */}
            {'share' in navigator && (
              <div className="p-4 pt-0">
                <button 
                  onClick={handleNativeShare}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 size={18} />
                  More Options
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-lg font-semibold">{formatPrice(product.price)}</span>
            <span className="text-xs text-gray-400 line-through ml-2">{formatPrice(originalPrice)}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`flex-1 h-12 rounded-xl font-medium ${
              !selectedSize ? 'bg-gray-200 text-gray-400' : addedToCart ? 'bg-green-500 text-white' : 'bg-gray-900 text-white'
            }`}
          >
            {isAdding ? 'Adding...' : addedToCart ? 'Added!' : selectedSize ? 'Add to Cart' : 'Select Size'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Recommendation Section
const RecommendationSection = ({ title, products, onProductClick }: { title: string; products: Product[]; onProductClick: (p: Product) => void }) => (
  <div className="mt-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <button
          key={p.id}
          onClick={() => onProductClick(p)}
          className="group text-left bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div className="aspect-square bg-gray-50 overflow-hidden">
            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{p.name}</h3>
            <p className="text-gray-900 font-semibold mt-1">₹{p.price.toLocaleString()}</p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default ProductDetailPage;
