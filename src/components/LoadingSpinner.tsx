import { memo } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = memo(({ size = 'md', text = 'Loading...', fullScreen = false }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Logo with rotation animation */}
      <div className={`${sizeClasses[size]} relative`}>
        <img 
          src="/logo.png" 
          alt="ELITOS" 
          className="w-full h-full object-contain animate-spin-slow"
        />
      </div>
      {text && (
        <p className="text-gray-500 text-sm animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {content}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

// Product skeleton loader for grid
export const ProductSkeleton = memo(() => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-5 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
));

ProductSkeleton.displayName = 'ProductSkeleton';

// Grid of product skeletons
export const ProductGridSkeleton = memo(({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
));

ProductGridSkeleton.displayName = 'ProductGridSkeleton';

export default LoadingSpinner;
