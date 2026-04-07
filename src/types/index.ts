// Core data models for ELITOS e-commerce website

export type Gender = 'men' | 'women' | 'kids' | 'unisex';
export type ProductCategory = 'footwear';
export type SubCategory = 
  | 'sneakers' | 'casual-shoes' | 'formal-shoes' | 'sandals' | 'sports-shoes' | 'heels';

export interface Product {
  id: string;
  name: string;
  price: number;
  wholesalePrice?: number;
  moq?: number;
  image: string;
  images?: string[];
  category: ProductCategory;
  subCategory?: SubCategory;
  gender: Gender;
  tags?: string[];
  featured?: boolean;
  bestseller?: boolean;
  stock?: number;
  sizes?: string[];
  colors?: string[];
  material?: string;
  description?: string;
  specifications?: Record<string, string>;
  createdAt?: Date;
  slug?: string;
}

export interface Collection {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: Date;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: Address;
  trackingNumber?: string;
  orderType: 'retail' | 'wholesale';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  images?: string[];
  verified: boolean;
  createdAt: Date;
}

export interface WholesaleApplication {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  gstNumber?: string;
  expectedMonthlyQty: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface UIState {
  mobileMenuOpen: boolean;
  cartOpen: boolean;
  loading: boolean;
  error: string | null;
}

export interface CartContextType {
  cart: CartState;
  addToCart: (product: Product, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// Re-export auth types
export * from './auth';
