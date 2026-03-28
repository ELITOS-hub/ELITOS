import { useState } from 'react';
import { User, LogOut, Settings, Heart, Package, ChevronDown, Shield, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfileProps {
  onMyOrders?: () => void;
  onWishlist?: () => void;
  onAccountSettings?: () => void;
  onAdminDashboard?: () => void;
}

const UserProfile = ({ onMyOrders, onWishlist, onAccountSettings, onAdminDashboard }: UserProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, logout } = useAuth();

  if (!auth.isAuthenticated || !auth.user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleMyOrders = () => {
    onMyOrders?.();
    setIsOpen(false);
  };

  const handleWishlist = () => {
    onWishlist?.();
    setIsOpen(false);
  };

  const handleAccountSettings = () => {
    onAccountSettings?.();
    setIsOpen(false);
  };

  const handleAdminDashboard = () => {
    onAdminDashboard?.();
    setIsOpen(false);
  };

  const isAdmin = auth.user.role === 'admin';

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        {auth.user.avatar ? (
          <img
            src={auth.user.avatar}
            alt={auth.user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-elitos-orange text-white rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
        )}
        <span className="hidden lg:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
          {auth.user.name}
        </span>
        <ChevronDown size={16} className="hidden lg:block text-gray-400" />
      </button>

      {/* Dropdown Menu - Mobile Fullscreen / Desktop Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/50 md:bg-transparent"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu - Mobile: Bottom Sheet, Desktop: Dropdown */}
          <div className="fixed md:absolute inset-x-0 bottom-0 md:inset-auto md:right-0 md:top-full md:mt-2 w-full md:w-72 bg-white md:rounded-xl rounded-t-3xl shadow-2xl md:shadow-xl border z-50 max-h-[85vh] md:max-h-none overflow-y-auto animate-slide-up md:animate-none">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-3xl">
              <h3 className="font-semibold text-lg">My Account</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Info */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                {auth.user.avatar ? (
                  <img
                    src={auth.user.avatar}
                    alt={auth.user.name}
                    className="w-14 h-14 md:w-12 md:h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 md:w-12 md:h-12 bg-elitos-orange text-white rounded-full flex items-center justify-center">
                    <User size={24} className="md:w-5 md:h-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{auth.user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{auth.user.email}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-elitos-cream text-elitos-brown">
                      {auth.user.provider === 'email' ? 'Email' : 
                       auth.user.provider === 'google' ? 'Google' : 'Apple ID'}
                    </span>
                    {isAdmin && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Dashboard - Only for admins */}
            {isAdmin && (
              <div className="p-2 border-b">
                <button 
                  onClick={handleAdminDashboard}
                  className="w-full flex items-center space-x-3 px-4 py-3 md:py-2 text-base md:text-sm text-purple-700 hover:bg-purple-50 transition-colors font-medium rounded-xl"
                >
                  <Shield size={20} className="md:w-4 md:h-4" />
                  <span>Admin Dashboard</span>
                </button>
              </div>
            )}

            {/* Menu Items */}
            <div className="p-2">
              <button 
                onClick={handleMyOrders}
                className="w-full flex items-center space-x-3 px-4 py-3 md:py-2 text-base md:text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-xl"
              >
                <Package size={20} className="md:w-4 md:h-4" />
                <span>My Orders</span>
              </button>
              
              <button 
                onClick={handleWishlist}
                className="w-full flex items-center space-x-3 px-4 py-3 md:py-2 text-base md:text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-xl"
              >
                <Heart size={20} className="md:w-4 md:h-4" />
                <span>Wishlist</span>
              </button>
              
              <button 
                onClick={handleAccountSettings}
                className="w-full flex items-center space-x-3 px-4 py-3 md:py-2 text-base md:text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-xl"
              >
                <Settings size={20} className="md:w-4 md:h-4" />
                <span>Account Settings</span>
              </button>
            </div>

            {/* Logout */}
            <div className="border-t p-2 pb-6 md:pb-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 md:py-2 text-base md:text-sm text-red-600 hover:bg-red-50 transition-colors rounded-xl"
              >
                <LogOut size={20} className="md:w-4 md:h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;