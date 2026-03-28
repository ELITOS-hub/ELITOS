import { useState } from 'react';
import { ArrowLeft, Star, Quote, X, Send } from 'lucide-react';
import { useReviews } from '../context/ReviewContext';

interface ReviewsPageProps {
  onClose: () => void;
}

const ReviewsPage = ({ onClose }: ReviewsPageProps) => {
  const { reviews, addReview } = useReviews();
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    text: '',
    product: '',
    image: '',
  });

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

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container-custom py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-elitos-brown">Customer Reviews</h1>
          </div>
          <button
            onClick={() => setShowWriteReview(true)}
            className="px-4 py-2 bg-elitos-orange text-white rounded-xl text-sm font-medium hover:bg-elitos-red transition-colors"
          >
            Write a Review
          </button>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Stats */}
        <div className="bg-white rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-elitos-brown">{avgRating}</div>
            <div className="flex gap-1 justify-center my-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className={i < Math.round(Number(avgRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <p className="text-gray-500">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 w-full md:w-auto">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => r.rating === star).length;
              const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 mb-1">
                  <span className="text-sm w-3">{star}</span>
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white p-5 rounded-2xl relative shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote size={24} className="absolute top-4 right-4 text-elitos-orange/20" />
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">"{review.text}"</p>
              {review.product && (
                <p className="text-xs text-gray-400 mb-3">Purchased: {review.product}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src={review.image} 
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">{review.name}</span>
                    <span className="text-xs text-gray-500">{review.location}</span>
                  </div>
                </div>
                {review.verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No reviews yet. Be the first to review!</p>
            <button
              onClick={() => setShowWriteReview(true)}
              className="px-6 py-3 bg-elitos-orange text-white rounded-xl font-medium hover:bg-elitos-red transition-colors"
            >
              Write a Review
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
                        size={28}
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
                  rows={4}
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
    </div>
  );
};

export default ReviewsPage;
