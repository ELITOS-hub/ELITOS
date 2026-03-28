import { Home, Search, ShoppingBag, Grid, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onAuthClick: () => void;
}

const MobileBottomNav = ({ currentView, onNavigate, onAuthClick }: MobileBottomNavProps) => {
  const { cart } = useCart();
  const { auth } = useAuth();

  const navItems = [
    { 
      id: 'home', 
      icon: Home, 
      label: 'Home',
    },
    { 
      id: 'products', 
      icon: Grid, 
      label: 'Shop',
    },
    { 
      id: 'search', 
      icon: Search, 
      label: 'Search',
    },
    { 
      id: 'cart', 
      icon: ShoppingBag, 
      label: 'Cart',
      badge: cart.totalItems > 0 ? cart.totalItems : null
    },
    { 
      id: 'account', 
      icon: User, 
      label: auth.isAuthenticated ? 'Profile' : 'Login',
    },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'account') {
      if (auth.isAuthenticated) {
        onNavigate('account');
      } else {
        onAuthClick();
      }
    } else if (id === 'search') {
      // Search goes to products page with search focus - pass 'search' to trigger focus
      onNavigate('search');
    } else {
      onNavigate(id);
    }
  };

  // Don't show on admin dashboard
  if (currentView === 'admin') {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom shadow-lg">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = currentView === item.id || 
            (item.id === 'home' && currentView === 'home') ||
            (item.id === 'products' && (currentView === 'products' || currentView === 'search'));
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                isActive 
                  ? 'text-elitos-orange' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-elitos-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
