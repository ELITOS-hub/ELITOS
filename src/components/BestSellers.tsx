import { TrendingUp, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';

interface BestSellersProps {
  onViewProduct?: (product: Product) => void;
  onViewAll?: () => void;
}

const BestSellers = ({ onViewProduct, onViewAll }: BestSellersProps) => {
  const { getBestSellers } = useProducts();
  const bestSellers = getBestSellers();

  return (
    <section id="bestsellers" className="py-10 bg-elitos-cream/30">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-elitos-orange/10 rounded-full flex items-center justify-center">
              <TrendingUp size={20} className="text-elitos-orange" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-elitos-brown">Best Sellers</h2>
              <p className="text-gray-500 text-sm">What everyone's buying</p>
            </div>
          </div>
          <button 
            onClick={onViewAll}
            className="hidden md:flex items-center gap-1 text-elitos-orange font-medium hover:gap-2 transition-all"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {bestSellers.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onViewDetails={onViewProduct}
            />
          ))}
        </div>
        
        {/* Mobile View All */}
        <div className="text-center mt-6 md:hidden">
          <button 
            onClick={onViewAll}
            className="text-elitos-orange font-medium flex items-center gap-1 mx-auto"
          >
            View All Best Sellers <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;