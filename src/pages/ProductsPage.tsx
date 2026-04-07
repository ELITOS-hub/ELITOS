import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ChevronDown, ChevronUp, Heart, Star, SlidersHorizontal } from 'lucide-react';
import { Product, Gender, SubCategory } from '../types';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import ProductDetailPage from '../components/ProductDetailPage';
import { ProductGridSkeleton } from '../components/LoadingSpinner';

interface ProductsPageProps {
  onClose: () => void;
  onViewProduct: (product: Product) => void;
  onBuyNow?: () => void;
  initialCategory?: string;
  initialSearch?: string;
  initialProduct?: Product | null;
  focusSearch?: boolean;
}

// Category hierarchy with subCategories
const genderCategories = {
  men: {
    label: 'Men',
    footwear: ['sneakers', 'casual-shoes', 'formal-shoes', 'sports-shoes'],
    winterwear: [],
  },
  women: {
    label: 'Women',
    footwear: ['sneakers', 'sandals', 'heels', 'casual-shoes', 'sports-shoes'],
    winterwear: [],
  },
  kids: {
    label: 'Kids',
    footwear: ['sneakers', 'sandals', 'sports-shoes'],
    winterwear: [],
  },
};

const subCategoryLabels: Record<string, string> = {
  'sneakers': 'Sneakers',
  'casual-shoes': 'Casual Shoes',
  'formal-shoes': 'Formal Shoes',
  'sports-shoes': 'Sports Shoes',
  'sandals': 'Sandals',
  'heels': 'Heels',
};

const allSizes = {
  footwear: ['4', '5', '6', '7', '8', '9', '10', '11'],
  winterwear: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  kids: ['1', '2', '3', '4', '5', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
};

const ProductsPage = ({ onClose, onBuyNow, initialCategory, initialSearch, initialProduct, focusSearch }: ProductsPageProps) => {
  const { products, getFilteredProducts, isLoading } = useProducts();
  const { auth } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Product detail view state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct || null);
  
  // Auth modal state for login requirement
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'footwear' | 'winterwear' | null>(
    initialCategory === 'footwear' || initialCategory === 'winterwear' ? initialCategory : null
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState('featured');
  const [onlyBestseller, setOnlyBestseller] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Expanded sections
  const [expandedSections, setExpandedSections] = useState({
    gender: true,
    category: true,
    subCategory: false,
    size: false,
    price: false,
  });

  // Reset subCategory when gender or category changes
  useEffect(() => {
    setSelectedSubCategory(null);
  }, [selectedGender, selectedCategory]);

  // Focus search input when focusSearch is true
  useEffect(() => {
    if (focusSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [focusSearch]);

  // After login, open the pending product
  useEffect(() => {
    if (auth.isAuthenticated && pendingProduct) {
      setSelectedProduct(pendingProduct);
      setPendingProduct(null);
    }
  }, [auth.isAuthenticated, pendingProduct]);

  // Handle product click - require login for lead generation
  const handleProductClick = (product: Product) => {
    if (!auth.isAuthenticated) {
      setPendingProduct(product);
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedProduct(product);
  };

  // Handle close product detail - go back to product list
  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Get available subCategories based on gender and category
  const availableSubCategories = useMemo(() => {
    if (!selectedGender || !selectedCategory) return [];
    const genderConfig = genderCategories[selectedGender as keyof typeof genderCategories];
    if (!genderConfig) return [];
    return genderConfig[selectedCategory] || [];
  }, [selectedGender, selectedCategory]);

  // Get available sizes based on category and gender
  const availableSizes = useMemo(() => {
    if (selectedGender === 'kids') {
      return allSizes.kids;
    }
    if (selectedCategory === 'footwear') {
      return allSizes.footwear;
    }
    if (selectedCategory === 'winterwear') {
      return allSizes.winterwear;
    }
    return [...allSizes.footwear, ...allSizes.winterwear];
  }, [selectedGender, selectedCategory]);

  // Filter products using context
  const filteredProducts = useMemo(() => {
    let result = getFilteredProducts({
      gender: selectedGender,
      category: selectedCategory,
      subCategory: selectedSubCategory,
      sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
      priceRange: priceRange[0] > 0 || priceRange[1] < 10000 ? priceRange : undefined,
      bestseller: onlyBestseller || undefined,
      searchQuery: searchQuery || undefined,
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, selectedGender, selectedCategory, selectedSubCategory, selectedSizes, priceRange, sortBy, onlyBestseller, getFilteredProducts]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGender(null);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedSizes([]);
    setPriceRange([0, 10000]);
    setOnlyBestseller(false);
  };

  const activeFilterCount =
    (selectedGender ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    (selectedSubCategory ? 1 : 0) +
    selectedSizes.length +
    (onlyBestseller ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0);

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      onClose();
    } else if (page === 'shipping' || page === 'size-guide' || page === 'why-us' || page === 'reviews') {
      // These pages need to be handled by parent App.tsx
      // For now, close products page and let parent handle
      onClose();
    }
  };

  // Sidebar Component
  const Sidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`${isMobile ? '' : 'sticky top-24'} space-y-4`}>
      {/* Gender Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <button
          onClick={() => toggleSection('gender')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-900"
        >
          Shop By
          {expandedSections.gender ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.gender && (
          <div className="mt-3 space-y-1">
            {Object.entries(genderCategories).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedGender(selectedGender === key ? null : key as Gender)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedGender === key
                    ? 'bg-elitos-orange text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {value.label}
                <span className="float-right text-xs opacity-70">
                  {products.filter(p => p.gender === key || p.gender === 'unisex').length}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-900"
        >
          Category
          {expandedSections.category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.category && (
          <div className="mt-3 space-y-1">
            {['footwear', 'winterwear'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat as 'footwear' | 'winterwear')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-elitos-orange text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {cat}
                <span className="float-right text-xs opacity-70">
                  {products.filter(p => p.category === cat && (!selectedGender || p.gender === selectedGender || p.gender === 'unisex')).length}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SubCategory Filter - Only show when gender AND category selected */}
      {availableSubCategories.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <button
            onClick={() => toggleSection('subCategory')}
            className="flex items-center justify-between w-full text-left font-semibold text-gray-900"
          >
            Type
            {expandedSections.subCategory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {expandedSections.subCategory && (
            <div className="mt-3 space-y-1">
              {availableSubCategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(selectedSubCategory === sub ? null : sub as SubCategory)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedSubCategory === sub
                      ? 'bg-elitos-orange text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {subCategoryLabels[sub] || sub}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Size Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <button
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-900"
        >
          Size {selectedSizes.length > 0 && <span className="text-xs bg-elitos-orange text-white px-2 py-0.5 rounded-full ml-2">{selectedSizes.length}</span>}
          {expandedSections.size ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.size && (
          <div className="mt-3 flex flex-wrap gap-2">
            {availableSizes.map(size => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  selectedSizes.includes(size)
                    ? 'bg-elitos-orange text-white border-elitos-orange'
                    : 'border-gray-200 hover:border-elitos-orange text-gray-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-900"
        >
          Price
          {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.price && (
          <div className="mt-3">
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full accent-elitos-orange"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>₹0</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
            {/* Quick price buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[2000, 3000, 5000, 10000].map(price => (
                <button
                  key={price}
                  onClick={() => setPriceRange([0, price])}
                  className={`px-2 py-1 text-xs rounded border ${
                    priceRange[1] === price ? 'bg-elitos-orange text-white border-elitos-orange' : 'border-gray-200'
                  }`}
                >
                  Under ₹{price.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyBestseller}
            onChange={() => setOnlyBestseller(!onlyBestseller)}
            className="w-4 h-4 rounded text-elitos-orange focus:ring-elitos-orange"
          />
          <span className="text-sm font-medium">Best Sellers Only</span>
        </label>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full py-2 text-sm text-elitos-orange hover:text-elitos-red font-medium"
        >
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  // Handle Buy Now - go to cart page
  const handleBuyNow = (_product: Product, _size: string, _quantity: number) => {
    if (onBuyNow) {
      onBuyNow();
    }
  };

  // If a product is selected, show product detail page
  if (selectedProduct) {
    return (
      <ProductDetailPage
        product={selectedProduct}
        onClose={handleCloseProductDetail}
        onViewProduct={handleProductClick}
        onBuyNow={handleBuyNow}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <Header
        onWholesaleClick={onClose}
        onAdminClick={onClose}
        onBlogClick={onClose}
        onShopClick={() => {}}
        onViewProduct={handleProductClick}
        onHomeClick={onClose}
      />

      {/* Page Content */}
      <div className="container-custom py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={onClose} className="hover:text-elitos-orange">Home</button>
          <span>/</span>
          <span className="text-gray-900">Shop All</span>
          {selectedGender && (
            <>
              <span>/</span>
              <span className="text-gray-900 capitalize">{selectedGender}</span>
            </>
          )}
          {selectedCategory && (
            <>
              <span>/</span>
              <span className="text-gray-900 capitalize">{selectedCategory}</span>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-10 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium"
                >
                  <SlidersHorizontal size={18} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-elitos-orange text-white text-xs px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                </p>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-elitos-orange"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedGender && (
                  <span className="inline-flex items-center gap-1 bg-elitos-cream text-elitos-brown text-xs px-3 py-1.5 rounded-full capitalize">
                    {selectedGender}
                    <button onClick={() => setSelectedGender(null)}><X size={12} /></button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 bg-elitos-cream text-elitos-brown text-xs px-3 py-1.5 rounded-full capitalize">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory(null)}><X size={12} /></button>
                  </span>
                )}
                {selectedSubCategory && (
                  <span className="inline-flex items-center gap-1 bg-elitos-cream text-elitos-brown text-xs px-3 py-1.5 rounded-full">
                    {subCategoryLabels[selectedSubCategory] || selectedSubCategory}
                    <button onClick={() => setSelectedSubCategory(null)}><X size={12} /></button>
                  </span>
                )}
                {selectedSizes.map(size => (
                  <span key={size} className="inline-flex items-center gap-1 bg-elitos-cream text-elitos-brown text-xs px-3 py-1.5 rounded-full">
                    Size {size}
                    <button onClick={() => toggleSize(size)}><X size={12} /></button>
                  </span>
                ))}
                {onlyBestseller && (
                  <span className="inline-flex items-center gap-1 bg-elitos-cream text-elitos-brown text-xs px-3 py-1.5 rounded-full">
                    Best Sellers
                    <button onClick={() => setOnlyBestseller(false)}><X size={12} /></button>
                  </span>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <span className="inline-flex items-center gap-1 bg-elitos-cream text-elitos-brown text-xs px-3 py-1.5 rounded-full">
                    Under ₹{priceRange[1].toLocaleString()}
                    <button onClick={() => setPriceRange([0, 10000])}><X size={12} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Product Grid */}
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl">
                <p className="text-gray-500 mb-4">No products found</p>
                <button onClick={clearFilters} className="text-elitos-orange font-medium hover:underline">
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer onWholesaleClick={() => {}} onNavigate={handleNavigate} />

      {/* Mobile Filters Sheet */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-gray-50 rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between rounded-t-3xl">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <Sidebar isMobile />
            </div>
            <div className="sticky bottom-0 bg-white p-4 border-t flex gap-3">
              <button onClick={clearFilters} className="flex-1 py-3 border rounded-xl font-medium">
                Clear All
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3 bg-elitos-orange text-white rounded-xl font-medium"
              >
                Show {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal for Login Requirement */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);
  const discount = 15;

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.bestseller && (
            <span className="bg-elitos-orange text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
              Bestseller
            </span>
          )}
          {discount > 0 && (
            <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
              {discount}% OFF
            </span>
          )}
          {/* Gender badge */}
          <span className="bg-gray-800/70 text-white text-[10px] px-2 py-0.5 rounded-full font-medium capitalize">
            {product.gender}
          </span>
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
        >
          <Heart size={16} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-1 mb-1">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-500">4.5</span>
          <span className="text-xs text-gray-400 capitalize">• {product.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ₹{Math.round(product.price * 1.2).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
