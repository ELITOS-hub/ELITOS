import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';

interface FootwearSectionProps {
  onViewProduct?: (product: Product) => void;
  onViewAll?: () => void;
}

const FootwearSection = ({ onViewProduct, onViewAll }: FootwearSectionProps) => {
  const { getProductsByCategory } = useProducts();
  const footwearProducts = getProductsByCategory('footwear');

  return (
    <section id="footwear" className="py-10 bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-elitos-brown">Premium Footwear</h2>
            <p className="text-gray-500 text-sm mt-1">Step into comfort & style</p>
          </div>
          <button 
            onClick={onViewAll}
            className="hidden md:flex items-center gap-1 text-elitos-orange font-medium hover:gap-2 transition-all"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {footwearProducts.map((product) => (
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
            View All Footwear <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FootwearSection;