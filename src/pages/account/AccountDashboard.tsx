import { useState } from 'react';
import { Package, Heart, MapPin, Settings, LogOut, ChevronRight, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useWishlist } from '../../context/WishlistContext';
import MyOrders from './MyOrders';
import Wishlist from './Wishlist';
import SavedAddresses from './SavedAddresses';
import ProfileSettings from './ProfileSettings';

type AccountView = 'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'settings';

interface AccountDashboardProps {
  onClose: () => void;
  onNavigate?: (view: string) => void;
}

const AccountDashboard = ({ onClose, onNavigate }: AccountDashboardProps) => {
  const [currentView, setCurrentView] = useState<AccountView>('dashboard');
  const { auth, logout } = useAuth();
  const { orders, getOrdersByUser } = useOrders();
  const { wishlist } = useWishlist();

  // Get user's orders
  const userOrders = auth.user?.id ? getOrdersByUser(auth.user.id) : orders;
  const recentOrder = userOrders[0];

  // Get saved addresses count
  const savedAddresses = (() => {
    const saved = localStorage.getItem('elitos_addresses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  })();

  const handleLogout = () => {
    logout();
    onClose();
  };

  // Render sub-pages
  if (currentView === 'orders') {
    return <MyOrders onBack={() => setCurrentView('dashboard')} />;
  }
  if (currentView === 'wishlist') {
    return <Wishlist onBack={() => setCurrentView('dashboard')} />;
  }
  if (currentView === 'addresses') {
    return <SavedAddresses onBack={() => setCurrentView('dashboard')} />;
  }
  if (currentView === 'settings') {
    return <ProfileSettings onBack={() => setCurrentView('dashboard')} />;
  }

  const menuItems = [
    { id: 'orders', icon: Package, label: 'My Orders', desc: 'Track, return, or buy again', count: userOrders.length || undefined },
    { id: 'wishlist', icon: Heart, label: 'Wishlist', desc: 'Your saved items', count: wishlist.length || undefined },
    { id: 'addresses', icon: MapPin, label: 'Saved Addresses', desc: 'Manage delivery addresses' },
    { id: 'settings', icon: Settings, label: 'Account Settings', desc: 'Update your information' },
  ];

  // Quick stats
  const stats = [
    { label: 'Total Orders', value: userOrders.length.toString() },
    { label: 'Wishlist Items', value: wishlist.length.toString() },
    { label: 'Saved Addresses', value: savedAddresses.length.toString() },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'shipped': return 'text-orange-600';
      case 'processing': return 'text-purple-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="container-custom py-4 flex items-center justify-between">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            ← Back to Shop
          </button>
          <h1 className="font-semibold">My Account</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* User Info Card */}
        <div className="bg-gradient-to-r from-elitos-brown to-elitos-red rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              {auth.user?.avatar ? (
                <img src={auth.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={28} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{auth.user?.name || 'Guest User'}</h2>
              <p className="text-white/80">{auth.user?.email}</p>
              {auth.user?.role === 'wholesale' && (
                <span className="inline-block mt-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                  Wholesale Account
                </span>
              )}
              {auth.user?.role === 'admin' && (
                <span className="inline-block mt-1 text-xs bg-yellow-500/80 px-2 py-1 rounded-full">
                  👑 Admin
                </span>
              )}
            </div>
          </div>

          {/* Admin Dashboard Button - Only for admins */}
          {auth.user?.role === 'admin' && onNavigate && (
            <button
              onClick={() => onNavigate('admin')}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            >
              <Shield size={20} />
              <span className="font-semibold">Open Admin Dashboard</span>
            </button>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Order */}
        {recentOrder && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Order</h3>
              <button 
                onClick={() => setCurrentView('orders')}
                className="text-elitos-orange text-sm font-medium hover:underline"
              >
                View All
              </button>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex -space-x-2">
                {recentOrder.items.slice(0, 2).map((item, idx) => (
                  <img 
                    key={idx}
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 rounded-lg border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div className="flex-1">
                <p className="font-medium">Order #{recentOrder.id.slice(-6)}</p>
                <p className="text-sm text-gray-500">
                  {recentOrder.items.length} item{recentOrder.items.length > 1 ? 's' : ''} • {formatPrice(recentOrder.total)}
                </p>
              </div>
              <span className={`text-sm font-medium capitalize ${getStatusColor(recentOrder.status)}`}>
                {recentOrder.status === 'delivered' ? '✓ ' : ''}{recentOrder.status}
              </span>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {menuItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as AccountView)}
              className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                idx !== menuItems.length - 1 ? 'border-b' : ''
              }`}
            >
              <div className="w-12 h-12 bg-elitos-cream rounded-full flex items-center justify-center">
                <item.icon size={22} className="text-elitos-orange" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="bg-elitos-orange text-white text-xs px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-2">Need help with your account?</p>
          <a 
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="text-elitos-orange font-medium hover:underline"
          >
            Chat with us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
