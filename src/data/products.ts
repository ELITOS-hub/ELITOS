import { Product, Collection, Gender, SubCategory } from '../types';

// Complete product data with gender, subCategory, tags
export const products: Product[] = [
  // MEN'S FOOTWEAR
  {
    id: '1',
    name: 'Premium Leather Sneaker',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop',
    ],
    category: 'footwear',
    subCategory: 'sneakers',
    gender: 'men',
    tags: ['leather', 'premium', 'casual', 'everyday'],
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Black', 'White', 'Brown'],
    bestseller: true,
    featured: true,
    stock: 25,
    material: 'Genuine Leather',
    description: 'Premium leather sneakers crafted for everyday comfort and style.',
  },
  {
    id: '2',
    name: 'Classic Canvas Low',
    price: 2299,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop'],
    category: 'footwear',
    subCategory: 'sneakers',
    gender: 'men',
    tags: ['canvas', 'casual', 'classic', 'everyday'],
    sizes: ['6', '7', '8', '9', '10'],
    colors: ['White', 'Navy', 'Red'],
    bestseller: true,
    stock: 40,
    description: 'Timeless canvas sneakers perfect for casual everyday wear.',
  },
  {
    id: '4',
    name: 'Minimalist High-Top',
    price: 3799,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=400&fit=crop&crop=center',
    category: 'footwear',
    subCategory: 'sneakers',
    gender: 'men',
    tags: ['high-top', 'minimalist', 'premium'],
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['White', 'Black'],
    bestseller: true,
    stock: 20,
    description: 'Clean minimalist high-top sneakers with premium leather upper.',
  },
  {
    id: '5',
    name: 'Urban Runner',
    price: 4299,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center',
    category: 'footwear',
    subCategory: 'sports-shoes',
    gender: 'men',
    tags: ['running', 'sports', 'athletic', 'cushioned'],
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Red', 'Black', 'Blue'],
    featured: true,
    stock: 30,
    description: 'Lightweight running shoes with responsive cushioning.',
  },
  {
    id: '8',
    name: 'Casual Slip-On',
    price: 2799,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&crop=center',
    category: 'footwear',
    subCategory: 'casual-shoes',
    gender: 'men',
    tags: ['slip-on', 'casual', 'easy', 'comfortable'],
    sizes: ['6', '7', '8', '9', '10'],
    colors: ['Tan', 'Black', 'White'],
    stock: 45,
    description: 'Easy slip-on sneakers for effortless everyday style.',
  },
  {
    id: '9',
    name: 'Sport Running Shoe',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&crop=center',
    category: 'footwear',
    subCategory: 'sports-shoes',
    gender: 'men',
    tags: ['running', 'professional', 'sports', 'performance'],
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['White', 'Black', 'Grey'],
    bestseller: true,
    stock: 28,
    description: 'Professional-grade running shoes with advanced cushioning.',
  },
  {
    id: '11',
    name: 'Retro Basketball Shoe',
    price: 5299,
    image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=400&h=400&fit=crop&crop=center',
    category: 'footwear',
    subCategory: 'sports-shoes',
    gender: 'men',
    tags: ['basketball', 'retro', 'classic', 'sports'],
    sizes: ['8', '9', '10', '11'],
    colors: ['White/Red', 'Black/Gold'],
    stock: 18,
    description: 'Classic retro basketball shoes with modern comfort.',
  },

  // WOMEN'S FOOTWEAR
  {
    id: '13',
    name: 'Women\'s Classic Sneaker',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&crop=center',
    category: 'footwear',
    subCategory: 'sneakers',
    gender: 'women',
    tags: ['sneakers', 'casual', 'everyday', 'comfortable'],
    sizes: ['4', '5', '6', '7', '8'],
    colors: ['White', 'Pink', 'Grey'],
    bestseller: true,
    featured: true,
    stock: 35,
    description: 'Classic women\'s sneakers for everyday comfort.',
  },
  {
    id: '14',
    name: 'Elegant Sandals',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop&crop=center',
    category: 'footwear',
    subCategory: 'sandals',
    gender: 'women',
    tags: ['sandals', 'summer', 'elegant', 'casual'],
    sizes: ['4', '5', '6', '7', '8'],
    colors: ['Beige', 'Black', 'Brown'],
    stock: 30,
    description: 'Elegant sandals perfect for summer days.',
  },
  {
    id: '15',
    name: 'Women\'s Running Shoe',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop&crop=center',
    category: 'footwear',
    subCategory: 'sports-shoes',
    gender: 'women',
    tags: ['running', 'sports', 'athletic', 'lightweight'],
    sizes: ['4', '5', '6', '7', '8'],
    colors: ['Pink', 'White', 'Purple'],
    featured: true,
    stock: 25,
    description: 'Lightweight running shoes designed for women.',
  },
  {
    id: '16',
    name: 'Casual Loafers',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=400&fit=crop&crop=center',
    category: 'footwear',
    subCategory: 'casual-shoes',
    gender: 'women',
    tags: ['loafers', 'casual', 'comfortable', 'office'],
    sizes: ['4', '5', '6', '7', '8'],
    colors: ['Black', 'Tan', 'Navy'],
    stock: 22,
    description: 'Comfortable loafers for work and casual wear.',
  },

  // KIDS' FOOTWEAR
  {
    id: '17',
    name: 'Kids Sports Sneaker',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1555274175-75f79b09d5b8?w=400&h=400&fit=crop&crop=center',
    category: 'footwear',
    subCategory: 'sports-shoes',
    gender: 'kids',
    tags: ['kids', 'sports', 'school', 'durable'],
    sizes: ['1', '2', '3', '4', '5'],
    colors: ['Blue', 'Red', 'Black'],
    bestseller: true,
    stock: 50,
    description: 'Durable sports sneakers for active kids.',
  },
  {
    id: '18',
    name: 'Kids Canvas Shoes',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=400&h=400&fit=crop&crop=center',
    category: 'footwear',
    subCategory: 'sneakers',
    gender: 'kids',
    tags: ['kids', 'canvas', 'school', 'casual'],
    sizes: ['1', '2', '3', '4', '5'],
    colors: ['White', 'Navy', 'Red'],
    stock: 40,
    description: 'Comfortable canvas shoes for everyday wear.',
  },
  {
    id: '19',
    name: 'Kids Sandals',
    price: 999,
    image: 'https://images.unsplash.com/photo-1604001307862-2d953b875079?w=400&h=400&fit=crop&crop=center',
    category: 'footwear',
    subCategory: 'sandals',
    gender: 'kids',
    tags: ['kids', 'sandals', 'summer', 'comfortable'],
    sizes: ['1', '2', '3', '4', '5'],
    colors: ['Blue', 'Pink', 'Green'],
    stock: 35,
    description: 'Comfortable sandals for summer adventures.',
  },

  // UNISEX ITEMS
  {
    id: '25',
    name: 'Classic White Sneaker',
    price: 2799,
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop&crop=center',
    category: 'footwear',
    subCategory: 'sneakers',
    gender: 'unisex',
    tags: ['unisex', 'classic', 'white', 'versatile'],
    sizes: ['5', '6', '7', '8', '9', '10', '11'],
    colors: ['White'],
    bestseller: true,
    stock: 60,
    description: 'Classic white sneakers for everyone.',
  },

];

// Sample collection data
export const collections: Collection[] = [
  {
    id: 'footwear-essentials',
    name: 'Footwear Essentials',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=500&fit=crop&crop=center',
    description: 'Everyday comfort meets modern style'
  },
  {
    id: 'best-sellers',
    name: 'Best Sellers',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop&crop=center',
    description: 'Customer favorites that never go out of style'
  },

  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=500&fit=crop&crop=center',
    description: 'Fresh styles for the modern wardrobe'
  }
];

// Helper functions
export const getProductsByCategory = (category: 'footwear'): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductsByGender = (gender: Gender): Product[] => {
  return products.filter(product => product.gender === gender || product.gender === 'unisex');
};

export const getProductsBySubCategory = (subCategory: SubCategory): Product[] => {
  return products.filter(product => product.subCategory === subCategory);
};

export const getBestSellers = (): Product[] => {
  return products.filter(product => product.bestseller);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const searchProducts = (query: string): Product[] => {
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
