import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { userAPI } from '../services/api';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const loadWishlist = useCallback(async () => {
    const token = localStorage.getItem('elitos_token');
    
    if (token) {
      try {
        // Try to load from API
        const apiWishlist = await userAPI.getWishlist();
        if (apiWishlist && Array.isArray(apiWishlist)) {
          const productIds = apiWishlist.map((item: any) => item.productId || item.id);
          setWishlist(productIds);
          localStorage.setItem('elitos_wishlist', JSON.stringify(productIds));
          return;
        }
      } catch (err) {
        console.log('Could not load wishlist from API');
      }
    }
    
    // Fallback to localStorage
    const saved = localStorage.getItem('elitos_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch {
        setWishlist([]);
      }
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  useEffect(() => {
    localStorage.setItem('elitos_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const refreshWishlist = async () => {
    await loadWishlist();
  };

  const addToWishlist = async (productId: string) => {
    if (wishlist.includes(productId)) return;
    
    setWishlist(prev => [...prev, productId]);
    
    // Try to sync with API
    const token = localStorage.getItem('elitos_token');
    if (token) {
      try {
        await userAPI.addToWishlist(productId);
      } catch (err) {
        console.log('Could not sync wishlist to API');
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setWishlist(prev => prev.filter(id => id !== productId));
    
    // Try to sync with API
    const token = localStorage.getItem('elitos_token');
    if (token) {
      try {
        await userAPI.removeFromWishlist(productId);
      } catch (err) {
        console.log('Could not sync wishlist removal to API');
      }
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
