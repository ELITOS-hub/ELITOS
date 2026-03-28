import { useEffect } from 'react';

// Get IDs from environment variables
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

// Declare global types for analytics
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

// Initialize Google Analytics 4
const initGA4 = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;
  
  // Check if already initialized
  if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) return;

  // Load gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
  });
};

// Initialize Meta Pixel
const initMetaPixel = () => {
  if (!META_PIXEL_ID || typeof window === 'undefined') return;
  
  // Check if already initialized
  if (window.fbq && typeof window.fbq === 'function') return;

  // Meta Pixel base code
  const n = (window.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  } as any);
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];

  // Load pixel script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  // Initialize pixel
  window.fbq('init', META_PIXEL_ID);
  window.fbq('track', 'PageView');
};

// Analytics Provider Component
export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    initGA4();
    initMetaPixel();
  }, []);

  return <>{children}</>;
};

// Analytics event tracking functions
export const analytics = {
  // Track product view
  viewProduct: (product: {
    id: string;
    name: string;
    price: number;
    category?: string;
  }) => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'INR',
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          item_category: product.category,
        }],
      });
    }

    if (META_PIXEL_ID && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency: 'INR',
      });
    }
  },

  // Track add to cart
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }) => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'INR',
        value: product.price * product.quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity,
          item_category: product.category,
        }],
      });
    }

    if (META_PIXEL_ID && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price * product.quantity,
        currency: 'INR',
      });
    }
  },

  // Track begin checkout
  beginCheckout: (items: { id: string; name: string; price: number; quantity: number }[], total: number) => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'INR',
        value: total,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });
    }

    if (META_PIXEL_ID && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: items.map(i => i.id),
        num_items: items.reduce((sum, i) => sum + i.quantity, 0),
        value: total,
        currency: 'INR',
      });
    }
  },

  // Track purchase
  purchase: (order: {
    orderId: string;
    total: number;
    items: { id: string; name: string; price: number; quantity: number }[];
    paymentMethod?: string;
  }) => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: order.orderId,
        currency: 'INR',
        value: order.total,
        items: order.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });
    }

    if (META_PIXEL_ID && window.fbq) {
      window.fbq('track', 'Purchase', {
        content_ids: order.items.map(i => i.id),
        content_type: 'product',
        num_items: order.items.reduce((sum, i) => sum + i.quantity, 0),
        value: order.total,
        currency: 'INR',
      });
    }
  },

  // Track search
  search: (query: string) => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag('event', 'search', {
        search_term: query,
      });
    }

    if (META_PIXEL_ID && window.fbq) {
      window.fbq('track', 'Search', {
        search_string: query,
      });
    }
  },

  // Track sign up
  signUp: (method: string = 'email') => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag('event', 'sign_up', {
        method,
      });
    }

    if (META_PIXEL_ID && window.fbq) {
      window.fbq('track', 'CompleteRegistration', {
        status: true,
      });
    }
  },

  // Track newsletter subscription
  subscribe: () => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag('event', 'newsletter_signup', {
        method: 'email',
      });
    }

    if (META_PIXEL_ID && window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Newsletter Subscription',
      });
    }
  },

  // Track wholesale inquiry
  wholesaleInquiry: (businessName: string) => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag('event', 'generate_lead', {
        currency: 'INR',
        value: 0,
      });
    }

    if (META_PIXEL_ID && window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Wholesale Inquiry',
        content_category: businessName,
      });
    }
  },

  // Track add to wishlist
  addToWishlist: (product: { id: string; name: string; price: number }) => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag('event', 'add_to_wishlist', {
        currency: 'INR',
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
        }],
      });
    }

    if (META_PIXEL_ID && window.fbq) {
      window.fbq('track', 'AddToWishlist', {
        content_ids: [product.id],
        content_name: product.name,
        value: product.price,
        currency: 'INR',
      });
    }
  },

  // Custom event
  trackEvent: (eventName: string, params?: Record<string, any>) => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag('event', eventName, params);
    }
  },
};

export default analytics;
