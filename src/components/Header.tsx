import { useState, useEffect } from 'react';
import { Menu, X, Search, User, Heart, Shield } from 'lucide-react';
import CartIcon from './CartIcon';
import UserProfile from './UserProfile';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { Product } from '../types';

interface HeaderProps {
  onWholesaleClick?: () => void;
  onAdminClick?: () => void;
  onBlogClick?: () => void;
  onShopClick?: () => void;
  onViewProduct?: (product: Product) => void;
  onHomeClick?: () => void;
  onAccountClick?: () => void;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
}

const Header = ({ onWholesaleClick, onAdminClick, onBlogClick, onShopClick, onViewProduct, onHomeClick, onAccountClick, onCartClick, onWishlistClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const { auth } = useAuth();
  const { products } = useProducts();
  const { wishlist } = useWishlist();

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search products with grouping
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.subCategory?.toLowerCase().includes(query) ||
        p.gender?.toLowerCase().includes(query) ||
        p.tags?.some(t => t.toLowerCase().includes(query)) ||
        p.description?.toLowerCase().includes(query)
      ).slice(0, 8);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  // Group search results by category
  const groupedResults = searchResults.reduce((acc, product) => {
    const key = `${product.gender} ${product.category}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {} as Record<string, typeof searchResults>);

  const handleProductClick = (product: Product) => {
    setShowSearch(false);
    setSearchQuery('');
    onViewProduct?.(product);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      {/* Floating Glass Navbar */}
      <header className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'top-3 py-2' : 'top-6 py-3'
      }`}>
        <div className="container-custom">
          <nav className={`relative flex items-center justify-between h-14 px-6 transition-all duration-500 ${
            isScrolled 
              ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 rounded-2xl border border-white/20' 
              : 'bg-white/60 backdrop-blur-md rounded-2xl border border-white/30'
          }`}>
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => {
                if (onHomeClick) {
                  onHomeClick();
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <img 
                src="/logo.png" 
                alt="ELITOS" 
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-xl font-bold text-elitos-brown">
                ELITOS
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { label: 'Shop All', action: onShopClick },
                { label: 'Wholesale', action: onWholesaleClick },
                { label: 'Blog', action: onBlogClick },
              ].map((item) => (
                <button 
                  key={item.label}
                  onClick={item.action}
                  className="relative px-4 py-2 text-gray-700 font-medium text-sm transition-all duration-300 hover:text-elitos-orange group"
                >
                  {item.label}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-elitos-orange rounded-full transition-all duration-300 group-hover:w-6" />
                </button>
              ))}
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-1">
              <button 
                onClick={() => setShowSearch(true)}
                className="p-2.5 text-gray-600 hover:text-elitos-orange hover:bg-elitos-orange/10 rounded-xl transition-all duration-300"
              >
                <Search size={18} />
              </button>
              
              {auth.user?.role === 'admin' && (
                <button 
                  onClick={onAdminClick}
                  className="p-2.5 text-gray-600 hover:text-elitos-orange hover:bg-elitos-orange/10 rounded-xl transition-all duration-300"
                  title="Admin Dashboard"
                >
                  <Shield size={18} />
                </button>
              )}
              
              {auth.isAuthenticated ? (
                <UserProfile 
                  onMyOrders={onAccountClick}
                  onWishlist={onAccountClick}
                  onAccountSettings={onAccountClick}
                  onAdminDashboard={onAdminClick}
                />
              ) : (
                <button 
                  onClick={() => openAuthModal('login')}
                  className="p-2.5 text-gray-600 hover:text-elitos-orange hover:bg-elitos-orange/10 rounded-xl transition-all duration-300"
                >
                  <User size={18} />
                </button>
              )}
              
              <button 
                onClick={onWishlistClick}
                className="p-2.5 text-gray-600 hover:text-elitos-orange hover:bg-elitos-orange/10 rounded-xl transition-all duration-300 relative"
              >
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {wishlist.length > 9 ? '9+' : wishlist.length}
                  </span>
                )}
              </button>
              <CartIcon onViewCart={onCartClick} />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-elitos-orange hover:bg-elitos-orange/10 rounded-xl transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 container-custom">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-slide-up">
              <nav className="py-2">
                {[
                  { label: 'Shop All', action: () => { onShopClick?.(); setIsMenuOpen(false); } },
                  { label: 'Collections', action: () => scrollToSection('collections') },
                  { label: 'Wholesale', action: () => { onWholesaleClick?.(); setIsMenuOpen(false); } },
                  { label: 'Blog', action: () => { onBlogClick?.(); setIsMenuOpen(false); } },
                  { label: 'About', action: () => scrollToSection('about') },
                ].map((item) => (
                  <button 
                    key={item.label}
                    onClick={item.action}
                    className="block w-full text-left px-5 py-3 text-gray-700 hover:bg-elitos-orange/10 hover:text-elitos-orange transition-all duration-200 font-medium"
                  >
                    {item.label}
                  </button>
                ))}
                
                {/* Admin Dashboard Button - Mobile */}
                {auth.user?.role === 'admin' && (
                  <button 
                    onClick={() => { onAdminClick?.(); setIsMenuOpen(false); }}
                    className="block w-full text-left px-5 py-3 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-all duration-200 font-semibold border-t border-b border-yellow-200"
                  >
                    <span className="flex items-center gap-2">
                      <Shield size={18} />
                      Admin Dashboard
                    </span>
                  </button>
                )}
                
                {/* Mobile Authentication */}
                {!auth.isAuthenticated && (
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          openAuthModal('login');
                          setIsMenuOpen(false);
                        }}
                        className="flex-1 py-2.5 px-4 border-2 border-elitos-brown text-elitos-brown rounded-xl font-medium text-sm hover:bg-elitos-brown hover:text-white transition-all duration-300"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          openAuthModal('signup');
                          setIsMenuOpen(false);
                        }}
                        className="flex-1 py-2.5 px-4 bg-elitos-orange text-white rounded-xl font-medium text-sm hover:bg-elitos-red transition-all duration-300"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Mobile Icons */}
                <div className="flex items-center justify-center space-x-4 py-3 border-t border-gray-100">
                  <button 
                    onClick={() => { setShowSearch(true); setIsMenuOpen(false); }}
                    className="p-2.5 text-gray-600 hover:text-elitos-orange hover:bg-elitos-orange/10 rounded-xl transition-all duration-300"
                  >
                    <Search size={20} />
                  </button>
                  
                  {auth.isAuthenticated ? (
                    <UserProfile 
                      onMyOrders={onAccountClick}
                      onWishlist={onAccountClick}
                      onAccountSettings={onAccountClick}
                      onAdminDashboard={onAdminClick}
                    />
                  ) : (
                    <button 
                      onClick={() => {
                        openAuthModal('login');
                        setIsMenuOpen(false);
                      }}
                      className="p-2.5 text-gray-600 hover:text-elitos-orange hover:bg-elitos-orange/10 rounded-xl transition-all duration-300"
                    >
                      <User size={20} />
                    </button>
                  )}
                  
                  <button 
                    onClick={() => { onWishlistClick?.(); setIsMenuOpen(false); }}
                    className="p-2.5 text-gray-600 hover:text-elitos-orange hover:bg-elitos-orange/10 rounded-xl transition-all duration-300 relative"
                  >
                    <Heart size={20} />
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                        {wishlist.length > 9 ? '9+' : wishlist.length}
                      </span>
                    )}
                  </button>
                  <CartIcon onViewCart={onCartClick} />
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
      
      {/* Spacer for fixed header */}
      <div className="h-20" />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-scale-in overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-12 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-elitos-orange text-lg"
                  autoFocus
                />
                <button 
                  onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {searchResults.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {Object.entries(groupedResults).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {category}
                    </div>
                    {items.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-500 capitalize">{product.subCategory || product.category}</p>
                          <p className="text-elitos-orange font-semibold">₹{product.price.toLocaleString()}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="p-8 text-center text-gray-500">
                No products found for "{searchQuery}"
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                Start typing to search products...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
