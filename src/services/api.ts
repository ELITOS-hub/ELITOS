// API Service for ELITOS Backend
const API_URL = import.meta.env.VITE_API_URL || 'https://elitosbackend.vercel.app/api';

// Helper to get auth token
const getToken = () => localStorage.getItem('elitos_token');

// Base fetch wrapper
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string; phone?: string }) =>
    fetchAPI<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetchAPI<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  googleSync: (data: { email: string; name: string; googleId: string; avatar?: string }) =>
    fetchAPI<{ user: any; token: string }>('/auth/google-sync', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => fetchAPI<any>('/auth/me'),

  forgotPassword: (email: string) =>
    fetchAPI<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    fetchAPI<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};

// Products API
export const productsAPI = {
  getAll: (params?: { 
    category?: string;
    subcategory?: string;
    gender?: string;
    featured?: boolean; 
    bestseller?: boolean; 
    search?: string;
    sizes?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string;
    limit?: number;
    page?: number;
    sort?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.subcategory) searchParams.set('subcategory', params.subcategory);
    if (params?.gender) searchParams.set('gender', params.gender);
    if (params?.featured) searchParams.set('featured', 'true');
    if (params?.bestseller) searchParams.set('bestseller', 'true');
    if (params?.search) searchParams.set('search', params.search);
    if (params?.sizes) searchParams.set('sizes', params.sizes);
    if (params?.minPrice) searchParams.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());
    if (params?.tags) searchParams.set('tags', params.tags);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.sort) searchParams.set('sort', params.sort);
    
    return fetchAPI<{ products: any[]; pagination: any }>(`/products?${searchParams}`);
  },

  getBySlug: (slug: string) => fetchAPI<any>(`/products/slug/${slug}`),
  
  getById: (id: string) => fetchAPI<any>(`/products/id/${id}`),
  
  getRelated: (slug: string) => fetchAPI<any[]>(`/products/${slug}/related`),

  getCategories: () => fetchAPI<{ categories: any[]; subcategories: any[]; genders: any[] }>('/products/meta/categories'),
};

// Orders API
export const ordersAPI = {
  getAll: () => fetchAPI<any[]>('/orders'),
  
  getById: (id: string) => fetchAPI<any>(`/orders/${id}`),

  track: (orderNumber: string) => fetchAPI<any>(`/orders/track/${orderNumber}`),
  
  create: (data: {
    items: { productId: string; quantity: number; size?: string; color?: string }[];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
      name: string;
      phone: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      pincode: string;
    };
    paymentMethod: string;
    notes?: string;
    orderType?: 'retail' | 'wholesale';
  }) =>
    fetchAPI<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  cancel: (id: string) =>
    fetchAPI<any>(`/orders/${id}/cancel`, { method: 'POST' }),
};

// Payment API
export const paymentAPI = {
  createOrder: (orderId: string) =>
    fetchAPI<{ orderId: string; amount: number; currency: string; key: string }>(
      '/payment/create-order',
      {
        method: 'POST',
        body: JSON.stringify({ orderId }),
      }
    ),

  verify: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;
  }) =>
    fetchAPI<{ success: boolean; order: any }>('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getKey: () => fetchAPI<{ key: string }>('/payment/key'),
};

// User API
export const userAPI = {
  getProfile: () => fetchAPI<any>('/users/profile'),
  
  updateProfile: (data: { name?: string; phone?: string }) =>
    fetchAPI<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    fetchAPI<any>('/users/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Addresses
  getAddresses: () => fetchAPI<any[]>('/users/addresses'),
  
  addAddress: (data: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
  }) =>
    fetchAPI<any>('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateAddress: (id: string, data: any) =>
    fetchAPI<any>(`/users/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteAddress: (id: string) =>
    fetchAPI<any>(`/users/addresses/${id}`, { method: 'DELETE' }),

  setDefaultAddress: (id: string) =>
    fetchAPI<any>(`/users/addresses/${id}/default`, { method: 'PUT' }),

  // Wishlist
  getWishlist: () => fetchAPI<any[]>('/users/wishlist'),
  
  addToWishlist: (productId: string) =>
    fetchAPI<any>(`/users/wishlist/${productId}`, { method: 'POST' }),

  removeFromWishlist: (productId: string) =>
    fetchAPI<any>(`/users/wishlist/${productId}`, { method: 'DELETE' }),
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (email: string) =>
    fetchAPI<{ message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  unsubscribe: (email: string) =>
    fetchAPI<{ message: string }>('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// Wholesale API
export const wholesaleAPI = {
  apply: (data: {
    businessName: string;
    ownerName: string;
    phone: string;
    email: string;
    gstNumber?: string;
    expectedMonthlyQty: string;
    notes?: string;
  }) =>
    fetchAPI<{ message: string; application: any }>('/wholesale/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  checkStatus: (email: string) =>
    fetchAPI<{ status: string; submittedAt: string }>(`/wholesale/status/${email}`),
};

// Admin API
export const adminAPI = {
  getStats: () => fetchAPI<any>('/admin/stats'),

  getAnalytics: (days?: number) => {
    const params = days ? `?days=${days}` : '';
    return fetchAPI<any>(`/admin/analytics${params}`);
  },
  
  // Products
  getProducts: () => fetchAPI<any[]>('/admin/products'),
  
  createProduct: (data: any) =>
    fetchAPI<any>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: any) =>
    fetchAPI<any>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string) =>
    fetchAPI<any>(`/admin/products/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: (params?: { status?: string; paymentStatus?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.paymentStatus) searchParams.set('paymentStatus', params.paymentStatus);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    return fetchAPI<{ orders: any[]; total: number }>(`/admin/orders?${searchParams}`);
  },

  updateOrderStatus: (id: string, data: { status: string; trackingNumber?: string; trackingUrl?: string; adminNotes?: string }) =>
    fetchAPI<any>(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateOrderPayment: (id: string, data: { paymentStatus: string; adminNotes?: string }) =>
    fetchAPI<any>(`/admin/orders/${id}/payment`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Customers
  getCustomers: () => fetchAPI<any[]>('/admin/customers'),

  // Wholesale
  getWholesaleApplications: () => fetchAPI<any[]>('/admin/wholesale-applications'),
  
  updateWholesaleApplication: (id: string, data: { status: string; notes?: string }) =>
    fetchAPI<any>(`/admin/wholesale-applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Reviews
  getReviews: (params?: { isVisible?: boolean; verified?: boolean; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.isVisible !== undefined) searchParams.set('isVisible', params.isVisible.toString());
    if (params?.verified !== undefined) searchParams.set('verified', params.verified.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    return fetchAPI<{ reviews: any[]; total: number }>(`/admin/reviews?${searchParams}`);
  },

  toggleReviewVisibility: (id: string, isVisible: boolean) =>
    fetchAPI<any>(`/admin/reviews/${id}/visibility`, {
      method: 'PUT',
      body: JSON.stringify({ isVisible }),
    }),

  verifyReview: (id: string, verified: boolean) =>
    fetchAPI<any>(`/admin/reviews/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ verified }),
    }),
  
  deleteReview: (id: string) =>
    fetchAPI<any>(`/admin/reviews/${id}`, { method: 'DELETE' }),

  // Subscribers
  getSubscribers: () => fetchAPI<any[]>('/admin/subscribers'),
};

// Reviews API
export const reviewsAPI = {
  getAll: (params?: { productId?: string; limit?: number; page?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.productId) searchParams.set('productId', params.productId);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    
    return fetchAPI<{ reviews: any[]; total: number; avgRating: number }>(`/reviews?${searchParams}`);
  },

  getByProduct: (productId: string) =>
    fetchAPI<{ reviews: any[]; avgRating: number; totalReviews: number; ratingDistribution: Record<number, number> }>(
      `/reviews/product/${productId}`
    ),

  getFeatured: () => fetchAPI<any[]>('/reviews/featured'),

  create: (data: { productId: string; rating: number; title?: string; text: string; images?: string[] }) =>
    fetchAPI<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { rating?: number; title?: string; text?: string; images?: string[] }) =>
    fetchAPI<any>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI<any>(`/reviews/${id}`, { method: 'DELETE' }),
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File): Promise<{ url: string; publicId: string }> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    return response.json();
  },

  uploadImages: async (files: File[]): Promise<{ images: { url: string; publicId: string }[] }> => {
    const token = getToken();
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const response = await fetch(`${API_URL}/upload/images`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload images');
    }

    return response.json();
  },

  deleteImage: (publicId: string) =>
    fetchAPI<{ message: string }>(`/upload/image/${publicId}`, { method: 'DELETE' }),
};
