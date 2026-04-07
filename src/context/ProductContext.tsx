import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, Gender, SubCategory } from '../types';
import { products as defaultProducts } from '../data/products';
import { productsAPI } from '../services/api';
import { localStorageHelper } from '../hooks/useAPI';

const STORAGE_KEY = 'elitos_products_v2';

interface FilterOptions {
  gender?: Gender | null;
  category?: 'footwear' | null;
  subCategory?: SubCategory | null;
  sizes?: string[];
  priceRange?: [number, number];
  bestseller?: boolean;
  searchQuery?: string;
}

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  isUsingAPI: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
  getFilteredProducts: (filters: FilterOptions) => Product[];
  getProductsByCategory: (category: 'footwear') => Product[];
  getProductsByGender: (gender: Gender) => Product[];
  getBestSellers: () => Product[];
  getFeaturedProducts: () => Product[];
  getSimilarProducts: (product: Product, limit?: number) => Product[];
  searchProducts: (query: string) => Product[];
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingAPI, setIsUsingAPI] = useState(false);

  // Load products - try API first, fallback to localStorage
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try API first
      const response = await productsAPI.getAll({ limit: 200 });
      if (response.products && response.products.length > 0) {
        // Map API response to frontend Product type
        const mappedProducts: Product[] = response.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          originalPrice: p.originalPrice,
          wholesalePrice: p.wholesalePrice,
          moq: p.moq,
          material: p.material,
          image: p.images?.[0] || '',
          images: p.images || [],
          category: p.category,
          subCategory: p.subcategory,
          gender: p.gender?.toLowerCase() || 'unisex',
          sizes: p.sizes || [],
          colors: p.colors || [],
          description: p.description,
          tags: p.tags || [],
          stock: p.stock,
          featured: p.featured,
          bestseller: p.bestseller,
          rating: p.avgRating || 0,
          reviews: p.reviewCount || 0,
        }));
        setProducts(mappedProducts);
        setIsUsingAPI(true);
        setIsLoading(false);
        // Also cache in localStorage
        localStorageHelper.set(STORAGE_KEY, mappedProducts);
        return;
      }
    } catch (err) {
      console.log('API not available, using localStorage fallback');
    }

    // Fallback to localStorage
    const saved = localStorageHelper.get<Product[]>(STORAGE_KEY, []);
    if (saved.length > 0 && saved[0].gender) {
      setProducts(saved);
    } else {
      setProducts(defaultProducts);
      localStorageHelper.set(STORAGE_KEY, defaultProducts);
    }
    setIsUsingAPI(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Save to localStorage when products change (for offline support)
  useEffect(() => {
    if (products.length > 0 && !isUsingAPI) {
      localStorageHelper.set(STORAGE_KEY, products);
    }
  }, [products, isUsingAPI]);


  const refreshProducts = async () => {
    await loadProducts();
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    if (isUsingAPI) {
      try {
        // API call would go here for admin
        // For now, add locally
        const newProduct: Product = {
          ...productData,
          id: 'prod-' + Date.now(),
        };
        setProducts(prev => [newProduct, ...prev]);
      } catch (err) {
        setError('Failed to add product');
      }
    } else {
      const newProduct: Product = {
        ...productData,
        id: 'prod-' + Date.now(),
      };
      setProducts(prev => [newProduct, ...prev]);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Advanced filtering
  const getFilteredProducts = (filters: FilterOptions): Product[] => {
    let result = [...products];

    // Search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory?.toLowerCase().includes(q) ||
        p.gender.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q)) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // Gender filter (include unisex)
    if (filters.gender) {
      result = result.filter(p => p.gender === filters.gender || p.gender === 'unisex');
    }

    // Category filter
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    // SubCategory filter
    if (filters.subCategory) {
      result = result.filter(p => p.subCategory === filters.subCategory);
    }

    // Size filter
    if (filters.sizes && filters.sizes.length > 0) {
      result = result.filter(p => p.sizes?.some(s => filters.sizes!.includes(s)));
    }

    // Price range filter
    if (filters.priceRange) {
      result = result.filter(p => 
        p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
      );
    }

    // Bestseller filter
    if (filters.bestseller) {
      result = result.filter(p => p.bestseller);
    }

    return result;
  };

  const getProductsByCategory = (category: 'footwear') => {
    return products.filter(p => p.category === category).slice(0, 4);
  };

  const getProductsByGender = (gender: Gender) => {
    return products.filter(p => p.gender === gender || p.gender === 'unisex');
  };

  const getBestSellers = () => {
    return products.filter(p => p.bestseller).slice(0, 4);
  };

  const getFeaturedProducts = () => {
    return products.filter(p => p.featured).slice(0, 4);
  };

  const getSimilarProducts = (product: Product, limit = 4): Product[] => {
    return products
      .filter(p => 
        p.id !== product.id &&
        (p.gender === product.gender || p.gender === 'unisex' || product.gender === 'unisex') &&
        p.category === product.category
      )
      .slice(0, limit);
  };

  const searchProducts = (query: string): Product[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subCategory?.toLowerCase().includes(q) ||
      p.gender.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q)) ||
      p.description?.toLowerCase().includes(q)
    );
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  return (
    <ProductContext.Provider value={{
      products,
      isLoading,
      error,
      isUsingAPI,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshProducts,
      getFilteredProducts,
      getProductsByCategory,
      getProductsByGender,
      getBestSellers,
      getFeaturedProducts,
      getSimilarProducts,
      searchProducts,
      getProductById,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
