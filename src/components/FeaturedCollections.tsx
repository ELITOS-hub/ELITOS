import { ArrowRight } from 'lucide-react';

const collections = [
  {
    id: 'footwear',
    name: 'Footwear',
    tagline: 'Step into style',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
    count: '25+ styles',
  },

  {
    id: 'bestsellers',
    name: 'Best Sellers',
    tagline: 'Customer favorites',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
    count: 'Top picks',
  },
];

interface FeaturedCollectionsProps {
  onViewAll?: (category?: string) => void;
}

const FeaturedCollections = ({ onViewAll }: FeaturedCollectionsProps) => {
  const handleCollectionClick = (collectionId: string) => {
    if (onViewAll) {
      onViewAll(collectionId === 'bestsellers' ? undefined : collectionId);
    } else {
      const element = document.getElementById(collectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="collections" className="py-10 bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-elitos-brown">Shop by Category</h2>
            <p className="text-gray-500 text-sm mt-1">Find your perfect style</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => handleCollectionClick(collection.id)}
              className="group relative h-[240px] md:h-[280px] rounded-2xl overflow-hidden text-left bg-white/50 backdrop-blur-sm border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <img
                src={collection.image}
                alt={collection.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-[10px] text-white/70 uppercase tracking-wider font-medium">{collection.count}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{collection.name}</h3>
                <p className="text-white/80 text-sm">{collection.tagline}</p>
                
                <div className="flex items-center gap-1 text-elitos-orange text-sm font-medium mt-2 group-hover:gap-2 transition-all">
                  <span>Explore</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;