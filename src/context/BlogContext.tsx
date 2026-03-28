import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

// Default blog posts
const defaultBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Choose the Perfect Sneakers for Your Foot Type',
    excerpt: 'Finding the right sneakers can make all the difference in comfort and style. Learn how to pick the perfect pair based on your foot type.',
    content: `Finding the right sneakers is more than just picking a style you like – it's about understanding your foot type and choosing shoes that provide the right support.

**Understanding Your Foot Type**

There are three main foot types:
1. **Flat feet** - Low or no arch
2. **Neutral feet** - Normal arch
3. **High arches** - Pronounced arch

**For Flat Feet:**
Look for sneakers with motion control and stability features. These shoes help prevent overpronation and provide the arch support your feet need.

**For Neutral Feet:**
You have the most flexibility in shoe choice. Look for moderate stability and cushioning.

**For High Arches:**
Choose sneakers with extra cushioning to absorb shock, as high arches don't naturally absorb impact well.

**Tips for Trying On Sneakers:**
- Shop in the afternoon when feet are slightly swollen
- Wear the socks you'll typically use
- Walk around the store for at least 5 minutes
- Check for a thumb's width of space at the toe

At ELITOS, we offer a range of sneakers designed for different foot types. Visit our size guide for more detailed measurements.`,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=400&fit=crop',
    author: 'ELITOS Team',
    date: 'Jan 5, 2026',
    readTime: '5 min read',
    category: 'Footwear Guide',
  },
  {
    id: '2',
    title: '10 Ways to Style Your Puffer Jacket This Winter',
    excerpt: 'Puffer jackets are a winter essential, but styling them can be tricky. Here are 10 ways to look chic while staying warm.',
    content: `Puffer jackets have evolved from purely functional outerwear to fashion statements. Here's how to style them for any occasion.

**1. Casual Street Style**
Pair your puffer with jeans and sneakers for an effortless everyday look.

**2. Athleisure Vibes**
Combine with joggers and trainers for a sporty aesthetic.

**3. Smart Casual**
Layer over a turtleneck with tailored trousers for a polished look.

**4. Monochromatic Magic**
Match your puffer color with the rest of your outfit for a sleek appearance.

**5. Belt It**
Add a belt over your puffer to create a more defined silhouette.

**6. Layer with Hoodies**
The hoodie-under-puffer combo is both warm and trendy.

**7. Dress It Up**
Yes, you can wear a puffer over a dress! Add boots for a fashion-forward look.

**8. Color Pop**
Use a bright puffer as a statement piece against neutral outfits.

**9. Cropped Style**
Cropped puffers work great with high-waisted pants.

**10. Oversized Comfort**
Embrace the oversized trend for maximum coziness.

Shop our Winter Puffer collection at ELITOS for premium quality at affordable prices.`,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=400&fit=crop',
    author: 'Style Editor',
    date: 'Jan 3, 2026',
    readTime: '7 min read',
    category: 'Style Tips',
  },
  {
    id: '3',
    title: 'The Complete Guide to Leather Shoe Care',
    excerpt: 'Proper care can extend the life of your leather shoes by years. Learn the essential maintenance tips every shoe owner should know.',
    content: `Leather shoes are an investment, and with proper care, they can last for decades. Here's your complete guide to leather shoe maintenance.

**Daily Care:**
- Use a shoe horn when putting on shoes
- Rotate between pairs to allow leather to rest
- Wipe off dirt with a soft cloth after each wear

**Weekly Maintenance:**
- Brush shoes with a horsehair brush
- Apply leather conditioner to prevent cracking
- Store with cedar shoe trees

**Monthly Deep Clean:**
1. Remove laces and brush off loose dirt
2. Apply leather cleaner with a soft cloth
3. Let dry completely
4. Apply leather conditioner
5. Buff with a clean cloth
6. Apply polish if desired

**Storage Tips:**
- Keep in a cool, dry place
- Use shoe bags for travel
- Never store wet shoes
- Avoid direct sunlight

Invest in quality leather care products and your ELITOS leather shoes will serve you well for years to come.`,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=400&fit=crop',
    author: 'ELITOS Team',
    date: 'Dec 28, 2025',
    readTime: '6 min read',
    category: 'Care Guide',
  },
  {
    id: '4',
    title: "Best Men's Sneakers in India 2026: Top Picks Under ₹3000",
    excerpt: "Looking for affordable yet stylish sneakers? Here are the best men's sneakers available in India under ₹3000.",
    content: `Finding quality sneakers at an affordable price in India can be challenging. We've curated the best options that won't break the bank.

**What to Look for in Budget Sneakers:**
- Durable sole construction
- Breathable upper material
- Cushioned insole
- Versatile design

**Top Sneaker Styles for 2026:**

**1. Classic White Sneakers**
The timeless white sneaker works with everything from jeans to chinos.

**2. Retro Running Sneakers**
Chunky dad shoes continue to trend with excellent comfort.

**3. Minimalist Low-Tops**
Clean lines and simple designs for casual and semi-formal occasions.

**4. Canvas Sneakers**
Perfect for summer, breathable and lightweight.

**5. Slip-On Sneakers**
Convenience meets style for quick outings.

**Why Choose ELITOS?**
At ELITOS, we offer premium quality sneakers at affordable prices. Free shipping on orders above ₹999!`,
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&h=400&fit=crop',
    author: 'ELITOS Team',
    date: 'Jan 7, 2026',
    readTime: '8 min read',
    category: 'Buying Guide',
  },
  {
    id: '5',
    title: "Winter Fashion Trends 2026: What's Hot in India",
    excerpt: 'Stay ahead of the fashion curve with our guide to the hottest winter trends in India for 2026.',
    content: `Winter 2026 brings exciting new trends to Indian fashion. Here's what's making waves this season.

**1. Oversized Puffer Jackets**
The bigger, the better. Oversized puffers in bold colors are dominating street style.

**2. Layering is Key**
Master the art of layering with base, mid, and outer layers.

**3. Earth Tones**
Brown, olive, rust, and beige are the colors of the season.

**4. Fleece Everything**
From jackets to vests, fleece is making a major comeback.

**5. Statement Boots**
Chunky boots and Chelsea boots are essential winter footwear.

Shop the latest winter collection at ELITOS. Premium quality, affordable prices.`,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop',
    author: 'Fashion Editor',
    date: 'Jan 6, 2026',
    readTime: '6 min read',
    category: 'Fashion Trends',
  },
];

const STORAGE_KEY = 'elitos_blogs';

interface BlogContextType {
  blogs: BlogPost[];
  addBlog: (blog: Omit<BlogPost, 'id'>) => void;
  updateBlog: (id: string, blog: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;
  getBlogById: (id: string) => BlogPost | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  // Load blogs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBlogs(parsed);
          return;
        }
      } catch (e) {
        console.error('Error parsing blogs:', e);
      }
    }
    // Use default blogs if nothing saved
    setBlogs(defaultBlogPosts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBlogPosts));
  }, []);

  // Save to localStorage when blogs change
  useEffect(() => {
    if (blogs.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
    }
  }, [blogs]);

  const addBlog = (blogData: Omit<BlogPost, 'id'>) => {
    const newBlog: BlogPost = {
      ...blogData,
      id: 'blog-' + Date.now(),
    };
    setBlogs(prev => [newBlog, ...prev]);
  };

  const updateBlog = (id: string, updates: Partial<BlogPost>) => {
    setBlogs(prev => prev.map(blog => 
      blog.id === id ? { ...blog, ...updates } : blog
    ));
  };

  const deleteBlog = (id: string) => {
    setBlogs(prev => prev.filter(blog => blog.id !== id));
  };

  const getBlogById = (id: string) => {
    return blogs.find(blog => blog.id === id);
  };

  return (
    <BlogContext.Provider value={{ blogs, addBlog, updateBlog, deleteBlog, getBlogById }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogs must be used within a BlogProvider');
  }
  return context;
};
