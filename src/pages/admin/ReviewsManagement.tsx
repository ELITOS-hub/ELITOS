import { useState, useCallback } from 'react';
import { ArrowLeft, Star, Edit2, Trash2, X, Save, Check, Plus, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useReviews, Review } from '../../context/ReviewContext';
import { adminAPI } from '../../services/api';
import ImageUpload from '../../components/ImageUpload';

interface ReviewsManagementProps {
  onBack: () => void;
}

const ReviewsManagement = ({ onBack }: ReviewsManagementProps) => {
  const { reviews, addReview, updateReview, deleteReview, refreshReviews, isUsingAPI } = useReviews();
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    text: '',
    product: '',
    image: '',
    verified: false,
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshReviews();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshReviews]);

  const handleToggleVisibility = async (review: Review) => {
    try {
      if (isUsingAPI) {
        await adminAPI.toggleReviewVisibility(review.id, !review.isVisible);
        await refreshReviews();
      } else {
        updateReview(review.id, { isVisible: !review.isVisible });
      }
    } catch (err) {
      console.error('Toggle visibility error:', err);
      updateReview(review.id, { isVisible: !review.isVisible });
    }
  };

  const toggleVerified = async (review: Review) => {
    try {
      if (isUsingAPI) {
        await adminAPI.verifyReview(review.id, !review.verified);
        await refreshReviews();
      } else {
        updateReview(review.id, { verified: !review.verified });
      }
    } catch (err) {
      console.error('Toggle verified error:', err);
      updateReview(review.id, { verified: !review.verified });
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setIsAddingReview(false);
    setFormData({
      name: review.name,
      location: review.location,
      rating: review.rating,
      text: review.text,
      product: review.product,
      image: review.image,
      verified: review.verified,
    });
  };

  const handleAddNew = () => {
    setEditingReview(null);
    setIsAddingReview(true);
    setFormData({
      name: '',
      location: '',
      rating: 5,
      text: '',
      product: '',
      image: '',
      verified: false,
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.text) {
      alert('Please fill in name and review text');
      return;
    }
    
    if (editingReview) {
      updateReview(editingReview.id, formData);
    } else {
      addReview(formData);
    }
    setEditingReview(null);
    setIsAddingReview(false);
  };

  const handleClose = () => {
    setEditingReview(null);
    setIsAddingReview(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        if (isUsingAPI) {
          await adminAPI.deleteReview(id);
          await refreshReviews();
        } else {
          deleteReview(id);
        }
      } catch (err) {
        console.error('Delete error:', err);
        deleteReview(id);
      }
    }
  };

  // Remove old toggleVerified function since we defined it above

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Reviews Management</h2>
        <span className="text-sm text-gray-500">{reviews.length} reviews</span>
        {isUsingAPI && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">API Connected</span>}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            title="Refresh reviews"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleAddNew}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Review
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Review</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Rating</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={review.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-sm">{review.name}</p>
                        <p className="text-xs text-gray-500">{review.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700 line-clamp-2 max-w-xs">"{review.text}"</p>
                    {review.product && <p className="text-xs text-gray-400 mt-1">{review.product}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleVerified(review)}
                        className={`text-xs px-2 py-1 rounded-full ${
                          review.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {review.verified ? '✓ Verified' : 'Unverified'}
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(review)}
                        className={`p-1 rounded ${
                          review.isVisible !== false ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={review.isVisible !== false ? 'Visible' : 'Hidden'}
                      >
                        {review.isVisible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {(editingReview || isAddingReview) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editingReview ? 'Edit Review' : 'Add New Review'}</h3>
              <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {/* Profile Image Upload */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Profile Image</label>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                    <ImageUpload
                      value={formData.image}
                      onChange={(url) => setFormData({ ...formData, image: url })}
                      aspectRatio="square"
                      className="[&>div]:rounded-full [&>div]:aspect-square"
                    />
                  </div>
                  <div className="flex-1 text-xs text-gray-500">
                    <p className="mb-1">Drag & drop an image, paste from clipboard, or enter URL</p>
                    <p>Recommended: Square image, at least 100x100px</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="City"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Product</label>
                <input
                  type="text"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                    >
                      <Star size={24} className={star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Review Text *</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="What did the customer say?"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Mark as Verified Purchase</span>
                <Check size={16} className="text-green-500" />
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="flex-1 py-2 border rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 bg-elitos-orange text-white rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  {editingReview ? 'Save Changes' : 'Add Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;
