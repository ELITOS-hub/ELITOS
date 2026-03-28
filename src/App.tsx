import { useState, useEffect, lazy, Suspense, memo, useCallback } from 'react';
import Lenis from 'lenis';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { ReviewProvider } from './context/ReviewContext';
import { BlogProvider } from './context/BlogContext';
import { OrderProvider } from './context/OrderContext';
import { WishlistProvider } from './context/WishlistContext';
import { CustomerProvider } from './context/CustomerContext';
import SEO, { OrganizationSchema } from './components/SEO';
import { AnalyticsProvider } from './components/Analytics';
import { Product } from './types';

// Critical components - load immediately
import TopBar from './components/TopBar';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MobileBottomNav from './components/MobileBottomNav';
import AuthModal from './components/AuthModal';

// Lazy load non-critical homepage sections
const TrustStrip = lazy(() => import('./components/TrustStrip'));
const SocialProof = lazy(() => import('./components/SocialProof'));
const WhyUsSection = lazy(() => import('./components/WhyUsSection'));
const FeaturedCollections = lazy(() => import('./components/FeaturedCollections'));
const BestSellers = lazy(() => import('./components/BestSellers'));
const FootwearSection = lazy(() => import('./components/FootwearSection'));
const WinterwearSection = lazy(() => import('./components/WinterwearSection'));
const InstagramFeed = lazy(() => import('./components/InstagramFeed'));
const NewsletterSection = lazy(() => import('./components/NewsletterSection'));
const BrandPromise = lazy(() => import('./components/BrandPromise'));
const AboutUsSection = lazy(() => import('./components/AboutUs'));
const Footer = lazy(() => import('./components/Footer'));
const CartSummary = lazy(() => import('./components/CartSummary'));
const WhatsAppButton = lazy(() => import('./components/WhatsAppButton'));
const SystemStatus = lazy(() => import('./components/SystemStatus'));
const AuthStatus = lazy(() => import('./components/AuthStatus'));

// Lazy load pages - only when needed
const AccountDashboard = lazy(() => import('./pages/account/AccountDashboard'));
const Wishlist = lazy(() => import('./pages/account/Wishlist'));
const Wholesale = lazy(() => import('./pages/Wholesale'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const Blog = lazy(() => import('./pages/Blog'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ShippingReturns = lazy(() => import('./pages/ShippingReturns'));
const SizeGuide = lazy(() => import('./pages/SizeGuide'));
const WhyBuyFromUs = lazy(() => import('./pages/WhyBuyFromUs'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const Contact = lazy(() => import('./pages/Contact'));
const AboutUsPage = lazy(() => import('./pages/AboutUs'));

type AppView = 'home' | 'account' | 'wholesale' | 'admin' | 'blog' | 'products' | 'cart' | 'shipping' | 'size-guide' | 'why-us' | 'contact' | 'reviews' | 'privacy' | 'terms' | 'refund' | 'about' | 'wishlist';

interface ProductsViewState {
  category?: string;
  search?: string;
  focusSearch?: boolean;
}

// Loading skeleton for pages
const PageLoader = memo(() => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4">
        <img src="/logo.png" alt="Loading" className="w-full h-full object-contain animate-spin-slow" />
      </div>
      <p className="text-gray-500 animate-pulse">Loading...</p>
    </div>
  </div>
));

// Section loader for homepage sections
const SectionLoader = memo(() => (
  <div className="py-8 flex justify-center">
    <div className="w-10 h-10">
      <img src="/logo.png" alt="Loading" className="w-full h-full object-contain animate-spin-slow" />
    </div>
  </div>
));

// Global Lenis instance
let lenisInstance: Lenis | null = null;

function AppContent() {
  const getInitialView = (): AppView => {
    const saved = localStorage.getItem('elitos_current_view');
    if (saved && ['home', 'account', 'wholesale', 'admin', 'blog', 'products', 'cart', 'shipping', 'size-guide', 'why-us', 'contact', 'reviews', 'privacy', 'terms', 'refund', 'about', 'wishlist'].includes(saved)) {
      return saved as AppView;
    }
    return 'home';
  };

  const [currentView, setCurrentView] = useState<AppView>(getInitialView);
  const [productsViewState, setProductsViewState] = useState<ProductsViewState>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const { auth } = useAuth();
  const { cart } = useCart();
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  // Save current view to localStorage
  useEffect(() => {
    localStorage.setItem('elitos_current_view', currentView);
  }, [currentView]);

  // Check if user is still authenticated for protected views
  useEffect(() => {
    if (!auth.isAuthenticated && (currentView === 'account' || currentView === 'admin')) {
      setCurrentView('home');
    }
  }, [auth.isAuthenticated, currentView]);
  
  // Lenis smooth scroll - initialize once
  useEffect(() => {
    if (!lenisInstance) {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        lenisInstance?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
    lenisInstance?.scrollTo(0, { immediate: true });
  }, [currentView]);

  // Memoized callbacks
  const handleViewProduct = useCallback((product: Product) => {
    if (!auth.isAuthenticated) {
      setPendingProduct(product);
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedProduct(product);
    setCurrentView('products');
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (auth.isAuthenticated && pendingProduct) {
      setSelectedProduct(pendingProduct);
      setCurrentView('products');
      setPendingProduct(null);
    }
  }, [auth.isAuthenticated, pendingProduct]);

  const handleAccountClick = useCallback(() => {
    if (auth.isAuthenticated) {
      setCurrentView('account');
    } else {
      setIsAuthModalOpen(true);
    }
  }, [auth.isAuthenticated]);

  const handleCheckout = useCallback(() => {
    if (!auth.isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (cart.items.length === 0) return;
    setIsCheckoutOpen(true);
  }, [auth.isAuthenticated, cart.items.length]);

  const handleOrderSuccess = useCallback((orderId: string) => {
    setIsCheckoutOpen(false);
    setOrderSuccess(orderId);
  }, []);

  const handleViewAllProducts = useCallback((category?: string) => {
    setProductsViewState({ category });
    setCurrentView('products');
  }, []);

  const handleNavigate = useCallback((page: string) => {
    setCurrentView(page as AppView);
  }, []);

  const handleMobileNavigation = useCallback((view: string) => {
    if (view === 'search') {
      setProductsViewState({ focusSearch: true });
      setCurrentView('products');
    } else {
      setCurrentView(view as AppView);
    }
  }, []);

  // Render page based on current view
  const renderPage = () => {
    switch (currentView) {
      case 'admin':
        return (
          <Suspense fallback={<PageLoader />}>
            <AdminDashboard onLogout={() => setCurrentView('home')} />
          </Suspense>
        );

      case 'account':
        return (
          <>
            <Suspense fallback={<PageLoader />}>
              <AccountDashboard onClose={() => setCurrentView('home')} onNavigate={handleMobileNavigation} />
            </Suspense>
            <MobileBottomNav currentView={currentView} onNavigate={handleMobileNavigation} onAuthClick={handleAccountClick} />
          </>
        );

      case 'products':
        return (
          <>
            <Suspense fallback={<PageLoader />}>
              <ProductsPage 
                onClose={() => { setSelectedProduct(null); setProductsViewState({}); setCurrentView('home'); }}
                onViewProduct={handleViewProduct}
                onBuyNow={() => setCurrentView('cart')}
                initialCategory={productsViewState.category}
                initialSearch={productsViewState.search}
                initialProduct={selectedProduct}
                focusSearch={productsViewState.focusSearch}
              />
            </Suspense>
            <MobileBottomNav currentView={currentView} onNavigate={handleMobileNavigation} onAuthClick={handleAccountClick} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          </>
        );

      case 'cart':
        return (
          <>
            <Suspense fallback={<PageLoader />}>
              <CartPage 
                onBack={() => setCurrentView('home')}
                onCheckout={() => { if (!auth.isAuthenticated) { setIsAuthModalOpen(true); return; } setIsCheckoutOpen(true); }}
                onViewProduct={(productId) => { setCurrentView('products'); setProductsViewState({}); const product = cart.items.find(item => item.id === productId); if (product) setSelectedProduct(product as unknown as Product); }}
              />
            </Suspense>
            <MobileBottomNav currentView={currentView} onNavigate={handleMobileNavigation} onAuthClick={handleAccountClick} />
            {isCheckoutOpen && <Suspense fallback={<PageLoader />}><Checkout onClose={() => setIsCheckoutOpen(false)} onSuccess={handleOrderSuccess} /></Suspense>}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            {orderSuccess && <Suspense fallback={<PageLoader />}><OrderSuccess orderId={orderSuccess} onClose={() => { setOrderSuccess(null); setCurrentView('account'); }} onContinueShopping={() => { setOrderSuccess(null); setCurrentView('home'); }} /></Suspense>}
          </>
        );

      case 'wholesale':
        return (
          <>
            <Suspense fallback={<PageLoader />}><Wholesale onClose={() => setCurrentView('home')} /></Suspense>
            <MobileBottomNav currentView={currentView} onNavigate={handleMobileNavigation} onAuthClick={handleAccountClick} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          </>
        );

      case 'blog':
        return (
          <>
            <Suspense fallback={<PageLoader />}><Blog onClose={() => setCurrentView('home')} /></Suspense>
            <MobileBottomNav currentView={currentView} onNavigate={handleMobileNavigation} onAuthClick={handleAccountClick} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          </>
        );

      case 'reviews':
        return (
          <>
            <Suspense fallback={<PageLoader />}><ReviewsPage onClose={() => setCurrentView('home')} /></Suspense>
            <MobileBottomNav currentView={currentView} onNavigate={handleMobileNavigation} onAuthClick={handleAccountClick} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          </>
        );

      case 'shipping':
      case 'size-guide':
      case 'why-us':
        const PageComponent = currentView === 'shipping' ? ShippingReturns : currentView === 'size-guide' ? SizeGuide : WhyBuyFromUs;
        return (
          <>
            <div className="min-h-screen bg-white pb-20 md:pb-0">
              <Header onWholesaleClick={() => setCurrentView('wholesale')} onAdminClick={() => setCurrentView('admin')} onBlogClick={() => setCurrentView('blog')} onShopClick={() => handleViewAllProducts()} onAccountClick={() => setCurrentView('account')} onCartClick={() => setCurrentView('cart')} onWishlistClick={() => setCurrentView('wishlist')} />
              <button onClick={() => setCurrentView('home')} className="fixed top-20 left-4 z-40 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">← Back</button>
              <Suspense fallback={<PageLoader />}>
                <PageComponent />
              </Suspense>
              <Suspense fallback={<SectionLoader />}><Footer onWholesaleClick={() => setCurrentView('wholesale')} onNavigate={handleNavigate} /></Suspense>
            </div>
            <MobileBottomNav currentView={currentView} onNavigate={handleMobileNavigation} onAuthClick={handleAccountClick} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          </>
        );

      case 'wishlist':
        return (
          <>
            <div className="min-h-screen bg-white pb-20 md:pb-0">
              <Header onWholesaleClick={() => setCurrentView('wholesale')} onAdminClick={() => setCurrentView('admin')} onBlogClick={() => setCurrentView('blog')} onShopClick={() => handleViewAllProducts()} onAccountClick={() => setCurrentView('account')} onCartClick={() => setCurrentView('cart')} onWishlistClick={() => setCurrentView('wishlist')} />
              <Suspense fallback={<PageLoader />}>
                <Wishlist onBack={() => setCurrentView('account')} />
              </Suspense>
              <Suspense fallback={<SectionLoader />}><Footer onWholesaleClick={() => setCurrentView('wholesale')} onNavigate={handleNavigate} /></Suspense>
            </div>
            <MobileBottomNav currentView={currentView} onNavigate={handleMobileNavigation} onAuthClick={handleAccountClick} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          </>
        );

      case 'privacy':
        return (<><Suspense fallback={<PageLoader />}><PrivacyPolicy onClose={() => setCurrentView('home')} /></Suspense><MobileBottomNav currentView={currentView} onNavigate={handleMobileNavigation} onAuthClick={handleAccountClick} /><AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} /></>);

      case 'terms':
        return (<><Suspense fallback={<PageLoader />}><TermsConditions onClose={() => setCurrentView('home')} /></Suspense><MobileBottomNav currentView={currentView} onNavigate={handleMobileNavigation} onAuthClick={handleAccountClick} /><AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} /></>);

      case 'refund':
        return (<><Suspense fallback={<PageLoader />}><RefundPolicy onClose={() => setCurrentView('home')} /></Suspense><MobileBottomNav currentView={currentView} onNavigate={handleMobileNavigation} onAuthClick={handleAccountClick} /><AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} /></>);

      case 'contact':
        return (<><Suspense fallback={<PageLoader />}><Contact onClose={() => setCurrentView('home')} /></Suspense><MobileBottomNav currentView={currentView} onNavigate={handleMobileNavigation} onAuthClick={handleAccountClick} /><AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} /></>);

      case 'about':
        return (<><Suspense fallback={<PageLoader />}><AboutUsPage onClose={() => setCurrentView('home')} /></Suspense><MobileBottomNav currentView={currentView} onNavigate={handleMobileNavigation} onAuthClick={handleAccountClick} /><AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} /></>);

      default:
        return null;
    }
  };

  // Non-home pages
  if (currentView !== 'home') {
    return renderPage();
  }

  // Main Homepage - optimized with lazy loading
  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <SEO />
      <OrganizationSchema />
      <div className="hidden md:block"><TopBar onWholesaleClick={() => setCurrentView('wholesale')} /></div>
      
      <Header 
        onWholesaleClick={() => setCurrentView('wholesale')}
        onAdminClick={() => setCurrentView('admin')}
        onBlogClick={() => setCurrentView('blog')}
        onShopClick={() => handleViewAllProducts()}
        onViewProduct={handleViewProduct}
        onAccountClick={() => setCurrentView('account')}
        onCartClick={() => setCurrentView('cart')}
        onWishlistClick={() => setCurrentView('wishlist')}
      />
      
      <Suspense fallback={null}><AuthStatus /></Suspense>
      
      <main>
        {/* Critical - loads immediately */}
        <HeroSection />
        
        {/* Lazy loaded sections */}
        <Suspense fallback={<SectionLoader />}><TrustStrip /></Suspense>
        <Suspense fallback={<SectionLoader />}><SocialProof onViewAllReviews={() => setCurrentView('reviews')} /></Suspense>
        <Suspense fallback={<SectionLoader />}><WhyUsSection /></Suspense>
        <Suspense fallback={<SectionLoader />}><FeaturedCollections onViewAll={handleViewAllProducts} /></Suspense>
        <Suspense fallback={<SectionLoader />}><BestSellers onViewProduct={handleViewProduct} onViewAll={() => handleViewAllProducts()} /></Suspense>
        <Suspense fallback={<SectionLoader />}><FootwearSection onViewProduct={handleViewProduct} onViewAll={() => handleViewAllProducts('footwear')} /></Suspense>
        <Suspense fallback={<SectionLoader />}><WinterwearSection onViewProduct={handleViewProduct} onViewAll={() => handleViewAllProducts('winterwear')} /></Suspense>
        <Suspense fallback={<SectionLoader />}><InstagramFeed /></Suspense>
        <Suspense fallback={<SectionLoader />}><NewsletterSection /></Suspense>
        <Suspense fallback={<SectionLoader />}><BrandPromise /></Suspense>
        <Suspense fallback={<SectionLoader />}><AboutUsSection /></Suspense>
      </main>
      
      <Suspense fallback={<SectionLoader />}><Footer onWholesaleClick={() => setCurrentView('wholesale')} onNavigate={handleNavigate} /></Suspense>
      
      {/* Floating Elements - lazy loaded */}
      <Suspense fallback={null}><CartSummary onCheckout={handleCheckout} /></Suspense>
      <Suspense fallback={null}><WhatsAppButton /></Suspense>
      <Suspense fallback={null}><SystemStatus /></Suspense>
      
      <MobileBottomNav currentView={currentView} onNavigate={handleMobileNavigation} onAuthClick={handleAccountClick} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {isCheckoutOpen && <Suspense fallback={<PageLoader />}><Checkout onClose={() => setIsCheckoutOpen(false)} onSuccess={handleOrderSuccess} /></Suspense>}
      {orderSuccess && <Suspense fallback={<PageLoader />}><OrderSuccess orderId={orderSuccess} onClose={() => { setOrderSuccess(null); setCurrentView('account'); }} onContinueShopping={() => setOrderSuccess(null)} /></Suspense>}
    </div>
  );
}

function App() {
  return (
    <AnalyticsProvider>
      <AuthProvider>
        <ProductProvider>
          <ReviewProvider>
            <BlogProvider>
            <OrderProvider>
              <CustomerProvider>
                <WishlistProvider>
                  <CartProvider>
                    <AppContent />
                  </CartProvider>
                </WishlistProvider>
              </CustomerProvider>
            </OrderProvider>
            </BlogProvider>
          </ReviewProvider>
        </ProductProvider>
      </AuthProvider>
    </AnalyticsProvider>
  );
}

export default App;
