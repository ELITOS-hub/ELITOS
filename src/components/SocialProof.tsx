import { useState, useRef } from 'react';
import { Star, Quote, X, Send, ArrowRight } from 'lucide-react';
import { useReviews } from '../context/ReviewContext';

interface SocialProofProps {
  onViewAllReviews?: () => void;
}

const SocialProof = ({ onViewAllReviews }: SocialProofProps) => {
  const { reviews } = useReviews();
  const [showWriteReview, setShowWriteReview] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    text: '',
    product: '',
    image: '',
  });
  const { addReview } = useReviews();

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.text) {
      alert('Please fill name and review');
      return;
    }
    addReview({
      ...formData,
      image: formData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
    });
    setFormData({ name: '', location: '', rating: 5, text: '', product: '', image: '' });
    setShowWriteReview(false);
    alert('Thank you! Your review has been submitted.');
  };

  return (
    <section className="py-10 bg-white border-b border-gray-100 overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-elitos-brown">
              Loved by 10,000+ Customers
            </h2>
            <p className="text-gray-500 text-sm mt-1">Real reviews from real people</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-semibold text-elitos-brown ml-1">4.8/5</span>
              </div>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <span className="text-gray-600 hidden sm:inline">{reviews.length} reviews</span>
            </div>
            <button
              onClick={() => setShowWriteReview(true)}
              className="px-4 py-2 bg-elitos-orange text-white rounded-xl text-sm font-medium hover:bg-elitos-red transition-colors"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Carousel */}
        <div className="relative -mx-4 px-4">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 cursor-grab active:cursor-grabbing scroll-smooth snap-x snap-mandatory"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {reviews.map((review, idx) => (
              <div 
                key={`${review.id}-${idx}`}
                className="flex-shrink-0 w-[280px] md:w-[320px] bg-elitos-cream/50 p-5 rounded-xl relative snap-start select-none"
              >
                <Quote size={24} className="absolute top-4 right-4 text-elitos-orange/20" />
                <div className="flex gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">"{review.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img 
                      src={review.image} 
                      alt={review.name}
                      className="w-8 h-8 rounded-full object-cover pointer-events-none"
                      draggable={false}
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900 block leading-tight">{review.name}</span>
                      <span className="text-xs text-gray-500">{review.location}</span>
                    </div>
                  </div>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Scroll hint for mobile */}
          <div className="md:hidden text-center mt-2">
            <span className="text-xs text-gray-400">← Swipe to see more →</span>
          </div>
        </div>

        {/* View All Reviews Button */}
        {reviews.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={onViewAllReviews}
              className="inline-flex items-center gap-2 text-elitos-orange hover:text-elitos-red font-medium transition-colors"
            >
              View All {reviews.length} Reviews
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {showWriteReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-elitos-brown">Write a Review</h3>
              <button onClick={() => setShowWriteReview(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-elitos-orange focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-elitos-orange focus:outline-none"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1"
                    >
                      <Star
                        size={24}
                        className={star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Purchased</label>
                <input
                  type="text"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-elitos-orange focus:outline-none"
                  placeholder="Premium Leather Sneaker"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-elitos-orange focus:outline-none"
                  placeholder="Share your experience..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo URL (optional)</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-elitos-orange focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-elitos-orange text-white rounded-xl font-medium hover:bg-elitos-red transition-colors flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default SocialProof;
