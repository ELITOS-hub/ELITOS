import { ArrowRight, Snowflake } from 'lucide-react';
import ProductCard from './ProductCard';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';

interface WinterwearSectionProps {
  onViewProduct?: (product: Product) => void;
  onViewAll?: () => void;
}

const WinterwearSection = ({ onViewProduct, onViewAll }: WinterwearSectionProps) => {
  const { getProductsByCategory } = useProducts();
  const winterwearProducts = getProductsByCategory('winterwear');

  return (
    <section id="winterwear" className="py-10 bg-elitos-cream/30">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Snowflake size={20} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-elitos-brown">Winter Essentials</h2>
              <p className="text-gray-500 text-sm">Stay warm, look cool</p>
            </div>
          </div>
          <button 
            onClick={onViewAll}
            className="hidden md:flex items-center gap-1 text-elitos-orange font-medium hover:gap-2 transition-all"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {winterwearProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onViewDetails={onViewProduct}
            />
          ))}
        </div>
        
        <div className="text-center mt-6 md:hidden">
          <button 
            onClick={onViewAll}
            className="text-elitos-orange font-medium flex items-center gap-1 mx-auto"
          >
            View All Winterwear <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WinterwearSection;