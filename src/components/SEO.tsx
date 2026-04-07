import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  product?: {
    name: string;
    price: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    image?: string;
    description?: string;
    sku?: string;
    brand?: string;
    reviews?: {
      rating: number;
      count: number;
    };
  };
}

const SEO = ({ 
  title = 'ELITOS - Premium Footwear & Winterwear | Best Prices in India',
  description = 'Shop premium quality footwear and winterwear at ELITOS. Best prices, pan-India delivery, COD available, and 100% authentic products. Free shipping on orders above ₹999.',
  keywords = 'footwear, shoes, sneakers, winterwear, jackets, hoodies, online shopping, India, affordable, premium, ELITOS, buy shoes online, winter jackets India',
  image = 'https://elitos.ragspro.com/logo.png',
  url = 'https://elitos.ragspro.com',
  type = 'website',
  product
}: SEOProps) => {
  
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('robots', 'index, follow');
    updateMeta('author', 'ELITOS');

    // Open Graph tags
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', image, true);
    updateMeta('og:url', url, true);
    updateMeta('og:type', type, true);
    updateMeta('og:site_name', 'ELITOS', true);
    updateMeta('og:locale', 'en_IN', true);

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    updateMeta('twitter:site', '@elitos_official');

    // Product schema
    if (product) {
      const existingSchema = document.querySelector('script[data-schema="product"]');
      if (existingSchema) {
        existingSchema.remove();
      }

      const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || description,
        image: product.image || image,
        sku: product.sku,
        brand: {
          '@type': 'Brand',
          name: product.brand || 'ELITOS'
        },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency || 'INR',
          availability: `https://schema.org/${product.availability || 'InStock'}`,
          url: url,
          seller: {
            '@type': 'Organization',
            name: 'ELITOS'
          }
        }
      };

      // Add aggregate rating if reviews exist
      if (product.reviews && product.reviews.count > 0) {
        schema.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: product.reviews.rating,
          reviewCount: product.reviews.count,
          bestRating: 5,
          worstRating: 1
        };
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'product');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    // Cleanup
    return () => {
      const productSchema = document.querySelector('script[data-schema="product"]');
      if (productSchema) {
        productSchema.remove();
      }
    };
  }, [title, description, keywords, image, url, type, product]);

  return null;
};

export default SEO;

// Organization Schema (add to index.html or App)
export const OrganizationSchema = () => {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ELITOS',
      url: 'https://elitos.ragspro.com',
      logo: 'https://elitos.ragspro.com/logo.png',
      description: 'Premium footwear and winterwear brand in India. Affordable Luxe. For Everyone.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'A-111 Amar Colony, Lajpat Nagar 4',
        addressLocality: 'New Delhi',
        postalCode: '110024',
        addressCountry: 'IN'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-9811736143',
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi']
      },
      sameAs: [
        'https://instagram.com/elitos.official',
        'https://facebook.com/elitos.official'
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'organization');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const orgSchema = document.querySelector('script[data-schema="organization"]');
      if (orgSchema) {
        orgSchema.remove();
      }
    };
  }, []);

  return null;
};

// Local Business Schema
export const LocalBusinessSchema = () => {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: 'ELITOS',
      image: 'https://elitos.ragspro.com/logo.png',
      '@id': 'https://elitos.ragspro.com',
      url: 'https://elitos.ragspro.com',
      telephone: '+91-9811736143',
      priceRange: '₹₹',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'A-111 Amar Colony, Lajpat Nagar 4',
        addressLocality: 'New Delhi',
        postalCode: '110024',
        addressCountry: 'IN'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 28.5672,
        longitude: 77.2410
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59'
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'localbusiness');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const localSchema = document.querySelector('script[data-schema="localbusiness"]');
      if (localSchema) {
        localSchema.remove();
      }
    };
  }, []);

  return null;
};

// FAQ Schema
export const FAQSchema = ({ faqs }: { faqs: { question: string; answer: string }[] }) => {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'faq');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const faqSchema = document.querySelector('script[data-schema="faq"]');
      if (faqSchema) {
        faqSchema.remove();
      }
    };
  }, [faqs]);

  return null;
};

// Review Schema
export const ReviewSchema = ({ reviews }: { reviews: { author: string; rating: number; text: string; date: string }[] }) => {
  useEffect(() => {
    if (reviews.length === 0) return;

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ELITOS',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1
      },
      review: reviews.slice(0, 10).map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1
        },
        reviewBody: review.text,
        datePublished: review.date
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'reviews');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const reviewSchema = document.querySelector('script[data-schema="reviews"]');
      if (reviewSchema) {
        reviewSchema.remove();
      }
    };
  }, [reviews]);

  return null;
};
