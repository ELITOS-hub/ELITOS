import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Collection } from '../types';

interface CollectionCardProps {
  collection: Collection;
  onClick?: () => void;
}

const CollectionCard = ({ collection, onClick }: CollectionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Collection Image */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <img 
          src={collection.image} 
          alt={collection.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
        
        {/* Collection Info Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <h3 className="text-xl font-bold mb-2 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
            {collection.name}
          </h3>
          {collection.description && (
            <p className="text-sm opacity-90 mb-4 transform transition-all duration-300 group-hover:translate-y-[-4px]">
              {collection.description}
            </p>
          )}
          
          {/* Shop Now Button */}
          <div className={`flex items-center space-x-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <span className="text-sm font-medium">Shop Now</span>
            <ArrowRight size={16} className="transform transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;