import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { reviewsAPI } from '../services/api';
import { localStorageHelper } from '../hooks/useAPI';

const STORAGE_KEY = 'elitos_reviews';

export interface Review {
  id: string;
  productId?: string;
  userId?: string;
  name: string;
  location: string;
  rating: number;
  title?: string;
  text: string;
  product: string;
  image: string;
  images?: string[];
  verified: boolean;
  isVisible?: boolean;
  createdAt: string;
}

interface ReviewContextType {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  isUsingAPI: boolean;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'verified'>) => Promise<void>;
  updateReview: (id: string, review: Partial<Review>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  getReviewsByProduct: (productId: string) => Review[];
  getFeaturedReviews: () => Review[];
  refreshReviews: () => Promise<void>;
}

const defaultReviews: Review[] = [
  {
    id: 'rev-1',
    name: 'Arjun M.',
    location: 'Mumbai',
    rating: 5,
    text: 'Best sneakers I\'ve owned! Super comfortable for daily wear.',
    product: 'Premium Leather Sneaker',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
    verified: true,
    createdAt: '2023-12-01',
  },
  {
    id: 'rev-2',
    name: 'Priya S.',
    location: 'Delhi',
    rating: 5,
    text: 'The puffer jacket is amazing quality. Worth every rupee!',
    product: 'Winter Puffer Jacket',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face',
    verified: true,
    createdAt: '2023-12-05',
  },
  {
    id: 'rev-3',
    name: 'Rahul K.',
    location: 'Bangalore',
    rating: 5,
    text: 'Fast delivery and excellent packaging. Will buy again!',
    product: 'Urban Runner',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
    verified: true,
    createdAt: '2023-12-10',
  },
];

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [isUsingAPI, setIsUsingAPI] = useState(false);

  // Load reviews
  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Try API first
      const response = await reviewsAPI.getAll({ limit: 50 });
      if (response.reviews && response.reviews.length > 0) {
        const mappedReviews: Review[] = response.reviews.map((r: any) => ({
          id: r.id,
          productId: r.productId,
          userId: r.userId,
          name: r.user?.name || 'Anonymous',
          location: 'India',
          rating: r.rating,
          title: r.title,
          text: r.text,
          product: r.product?.name || 'Product',
          image: r.images?.[0] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
          images: r.images,
          verified: r.verified,
          isVisible: r.isVisible,
          createdAt: r.createdAt,
        }));
        setReviews(mappedReviews);
        setIsUsingAPI(true);
        localStorageHelper.set(STORAGE_KEY, mappedReviews);
        return;
      }
    } catch (err) {
      console.log('API not available for reviews, using localStorage');
    }

    // Fallback to localStorage
    const saved = localStorageHelper.get<Review[]>(STORAGE_KEY, []);
    if (saved.length > 0) {
      setReviews(saved);
    } else {
      setReviews(defaultReviews);
      localStorageHelper.set(STORAGE_KEY, defaultReviews);
    }
    setIsUsingAPI(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Save to localStorage when reviews change
  useEffect(() => {
    if (reviews.length > 0 && !isUsingAPI) {
      localStorageHelper.set(STORAGE_KEY, reviews);
    }
  }, [reviews, isUsingAPI]);

  const refreshReviews = async () => {
    await loadReviews();
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'verified'>) => {
    try {
      if (isUsingAPI && reviewData.productId) {
        const newReview = await reviewsAPI.create({
          productId: reviewData.productId,
          rating: reviewData.rating,
          title: reviewData.title,
          text: reviewData.text,
          images: reviewData.images,
        });
        
        if (newReview) {
          const mappedReview: Review = {
            id: newReview.id,
            ...reviewData,
            verified: newReview.verified || false,
            createdAt: newReview.createdAt || new Date().toISOString(),
          };
          setReviews(prev => [mappedReview, ...prev]);
          return;
        }
      }
    } catch (err) {
      console.log('API review creation failed, using localStorage');
    }

    // Fallback to localStorage
    const newReview: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      verified: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const updateReview = async (id: string, updates: Partial<Review>) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteReview = async (id: string) => {
    try {
      if (isUsingAPI) {
        await reviewsAPI.delete(id);
      }
    } catch (err) {
      console.log('API delete failed');
    }
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const getReviewsByProduct = (productId: string): Review[] => {
    return reviews.filter(r => r.productId === productId && r.isVisible !== false);
  };

  const getFeaturedReviews = (): Review[] => {
    return reviews
      .filter(r => r.verified && r.rating >= 4 && r.isVisible !== false)
      .slice(0, 10);
  };

  return (
    <ReviewContext.Provider value={{ 
      reviews, 
      isLoading,
      error,
      isUsingAPI,
      addReview, 
      updateReview, 
      deleteReview,
      getReviewsByProduct,
      getFeaturedReviews,
      refreshReviews,
    }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};
