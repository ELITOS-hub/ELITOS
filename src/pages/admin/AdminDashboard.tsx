import { useState, useEffect, useCallback, lazy, Suspense, memo } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  Settings, LogOut, TrendingUp, DollarSign, Plus,
  BarChart3, Bell, Mail, Star, Menu, X, Home, Building2, RefreshCw,
  ChevronDown, User, Clock, CheckCircle, FileText
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { useCustomers } from '../../context/CustomerContext';
import { useReviews } from '../../context/ReviewContext';
import { useBlogs } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';

// Lazy load admin sub-pages
const ProductManagement = lazy(() => import('./ProductManagement'));
const OrderManagement = lazy(() => import('./OrderManagement'));
const CustomerManagement = lazy(() => import('./CustomerManagement'));
const AdminAnalytics = lazy(() => import('./AdminAnalytics'));
const SubscribersManagement = lazy(() => import('./SubscribersManagement'));
const ReviewsManagement = lazy(() => import('./ReviewsManagement'));
const WholesaleManagement = lazy(() => import('./WholesaleManagement'));
const BlogManagement = lazy(() => import('./BlogManagement'));

// Loading component for admin pages
const AdminPageLoader = memo(() => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4">
        <img src="/logo.png" alt="Loading" className="w-full h-full object-contain animate-spin-slow" />
      </div>
      <p className="text-gray-500 animate-pulse">Loading...</p>
    </div>
  </div>
));

type AdminView = 'dashboard' | 'products' | 'orders' | 'customers' | 'analytics' | 'subscribers' | 'reviews' | 'wholesale' | 'blogs' | 'settings';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  recentOrders: any[];
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [apiStats, setApiStats] = useState<DashboardStats | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const { products } = useProducts();
  const { orders } = useOrders();
  const { customers } = useCustomers();
  const { reviews } = useReviews();
  const { blogs } = useBlogs();
  const { auth } = useAuth();
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [wholesaleCount, setWholesaleCount] = useState(0);

  // Fetch stats from API with auto-refresh
  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const stats = await adminAPI.getStats();
      setApiStats(stats);
    } catch (err) {
      console.log('API stats not available, using local data');
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  useEffect(() => {
    const saved = localStorage.getItem('newsletter_subscribers');
    if (saved) {
      setSubscriberCount(JSON.parse(saved).length);
    }
    const wholesale = localStorage.getItem('elitos_wholesale_inquiries');
    if (wholesale) {
      setWholesaleCount(JSON.parse(wholesale).length);
    }
  }, [currentView]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [currentView]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Use API stats if available, otherwise fallback to context
  const totalRevenue = apiStats?.totalRevenue ?? orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = apiStats?.pendingOrders ?? orders.filter(o => o.status === 'pending').length;
  const totalOrdersCount = apiStats?.totalOrders ?? orders.length;
  const totalCustomersCount = apiStats?.totalCustomers ?? customers.length;
  const totalProductsCount = apiStats?.totalProducts ?? products.length;
  
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt).toDateString();
    return orderDate === new Date().toDateString();
  });
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'products', icon: Package, label: 'Products', badge: products.length },
    { id: 'orders', icon: ShoppingCart, label: 'Orders', badge: pendingOrders || undefined },
    { id: 'customers', icon: Users, label: 'Customers', badge: customers.length || undefined },
    { id: 'wholesale', icon: Building2, label: 'Wholesale', badge: wholesaleCount || undefined },
    { id: 'subscribers', icon: Mail, label: 'Subscribers', badge: subscriberCount || undefined },
    { id: 'reviews', icon: Star, label: 'Reviews', badge: reviews.length || undefined },
    { id: 'blogs', icon: FileText, label: 'Blogs', badge: blogs.length || undefined },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const dashboardStats = [
    { label: "Today's Revenue", value: `₹${todayRevenue.toLocaleString()}`, change: '+12%', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Total Orders', value: totalOrdersCount.toString(), change: '+8%', icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Total Customers', value: totalCustomersCount.toString(), change: '+15%', icon: Users, color: 'bg-purple-500' },
    { label: 'Total Products', value: totalProductsCount.toString(), change: '+5%', icon: Package, color: 'bg-orange-500' },
  ];

  // Use API recent orders if available
  const recentOrders = apiStats?.recentOrders?.length 
    ? apiStats.recentOrders.map((o: any) => ({
        id: o.id,
        customerName: o.customerName || o.user?.name || 'Guest',
        total: o.totalAmount,
        status: o.status?.toLowerCase() || 'pending',
      }))
    : orders.slice(0, 5);



  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get pending orders for notifications
  const pendingOrdersList = apiStats?.recentOrders?.filter((o: any) => o.status?.toLowerCase() === 'pending') 
    || orders.filter(o => o.status === 'pending');

  // Admin info
  const adminName = auth.user?.name || 'Admin';
  const adminEmail = auth.user?.email || 'admin@elitos.com';

  if (currentView === 'products') return <Suspense fallback={<AdminPageLoader />}><ProductManagement onBack={() => setCurrentView('dashboard')} /></Suspense>;
  if (currentView === 'orders') return <Suspense fallback={<AdminPageLoader />}><OrderManagement onBack={() => setCurrentView('dashboard')} /></Suspense>;
  if (currentView === 'customers') return <Suspense fallback={<AdminPageLoader />}><CustomerManagement onBack={() => setCurrentView('dashboard')} /></Suspense>;
  if (currentView === 'subscribers') return <Suspense fallback={<AdminPageLoader />}><SubscribersManagement onBack={() => setCurrentView('dashboard')} /></Suspense>;
  if (currentView === 'reviews') return <Suspense fallback={<AdminPageLoader />}><ReviewsManagement onBack={() => setCurrentView('dashboard')} /></Suspense>;
  if (currentView === 'wholesale') return <Suspense fallback={<AdminPageLoader />}><WholesaleManagement onBack={() => setCurrentView('dashboard')} /></Suspense>;
  if (currentView === 'blogs') return <Suspense fallback={<AdminPageLoader />}><BlogManagement onBack={() => setCurrentView('dashboard')} /></Suspense>;
  if (currentView === 'analytics') return <Suspense fallback={<AdminPageLoader />}><AdminAnalytics onBack={() => setCurrentView('dashboard')} /></Suspense>;
  
  // Settings View
  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm px-4 lg:px-6 py-4 flex items-center gap-4">
          <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Settings</h2>
        </header>
        <div className="p-4 lg:p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <User size={20} className="text-elitos-orange" />
              Admin Profile
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-elitos-orange rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-lg">{adminName}</p>
                  <p className="text-gray-500">{adminEmail}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Admin</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Settings size={20} className="text-elitos-orange" />
              Store Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Store Name</p>
                  <p className="text-sm text-gray-500">ELITOS - Premium Leather</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Contact Email</p>
                  <p className="text-sm text-gray-500">contactus.elitos@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-sm text-gray-500">+91 98117 36143</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Store Address</p>
                  <p className="text-sm text-gray-500">A-111 Amar Colony, Lajpat Nagar 4, New Delhi 110024</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Clock size={20} className="text-elitos-orange" />
              System Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Total Products</span>
                <span className="font-medium">{totalProductsCount}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Total Orders</span>
                <span className="font-medium">{totalOrdersCount}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Total Customers</span>
                <span className="font-medium">{totalCustomersCount}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Database Status</span>
                <span className="font-medium text-green-600 flex items-center gap-1">
                  <CheckCircle size={14} />
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-64 bg-elitos-brown text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="p-4 lg:p-6 border-b border-white/10 flex items-center justify-between">
          <h1 className="font-bold text-xl lg:text-2xl">ELITOS Admin</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-2 border-b border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg">
            <Home size={20} />
            <span>Back to Site</span>
          </button>
        </div>

        <nav className="flex-1 p-2 lg:p-4 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as AdminView)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 ${currentView === item.id ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <item.icon size={20} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-elitos-orange text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-2 lg:p-4 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto min-h-screen">
        <header className="bg-white shadow-sm px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-500 text-sm hidden sm:block">Welcome back, {adminName}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <button 
              onClick={fetchStats} 
              disabled={isLoadingStats}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Refresh stats"
            >
              <RefreshCw size={20} className={isLoadingStats ? 'animate-spin' : ''} />
            </button>
            
            {/* Notification Dropdown */}
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Bell size={20} />
                {pendingOrders > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{pendingOrders}</span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Bell size={16} className="text-elitos-orange" />
                      Notifications
                    </h3>
                  </div>
                  <div className="divide-y">
                    {pendingOrdersList.length > 0 ? (
                      pendingOrdersList.slice(0, 5).map((order: any) => (
                        <div 
                          key={order.id} 
                          className="p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => { setCurrentView('orders'); setShowNotifications(false); }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Clock size={14} className="text-yellow-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">New Order #{(order.id || '').slice(-6)}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {order.customerName || order.user?.name || 'Guest'} - ₹{(order.totalAmount || order.total || 0).toLocaleString()}
                              </p>
                              <p className="text-xs text-yellow-600 mt-1">Pending</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
                        <p className="text-sm">All caught up!</p>
                        <p className="text-xs">No pending orders</p>
                      </div>
                    )}
                  </div>
                  {pendingOrdersList.length > 0 && (
                    <div className="p-3 border-t">
                      <button 
                        onClick={() => { setCurrentView('orders'); setShowNotifications(false); }}
                        className="w-full text-center text-sm text-elitos-orange font-medium hover:underline"
                      >
                        View All Orders
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-elitos-orange rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-elitos-orange rounded-full flex items-center justify-center text-white font-semibold">
                        {adminName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{adminName}</p>
                        <p className="text-xs text-gray-500 truncate">{adminEmail}</p>
                      </div>
                    </div>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Admin</span>
                  </div>
                  <div className="py-2">
                    <button 
                      onClick={() => { setCurrentView('settings'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentView('analytics'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <BarChart3 size={16} />
                      <span>Analytics</span>
                    </button>
                  </div>
                  <div className="border-t py-2">
                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
            {dashboardStats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2 lg:mb-4">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon size={20} className="text-white" />
                  </div>
                  <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                    <TrendingUp size={12} />
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-lg lg:text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-500 text-xs lg:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 lg:p-6 border-b flex items-center justify-between">
                <h3 className="font-semibold text-base lg:text-lg">Recent Orders</h3>
                <button onClick={() => setCurrentView('orders')} className="text-elitos-orange text-sm font-medium">View All</button>
              </div>
              <div className="p-4 lg:p-6 overflow-x-auto">
                {recentOrders.length > 0 ? (
                  <div className="min-w-[500px] lg:min-w-0">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-500 text-xs lg:text-sm">
                          <th className="pb-3">Order</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-t">
                            <td className="py-3 font-medium text-sm">#{order.id.slice(-6)}</td>
                            <td className="py-3 text-sm">{order.customerName}</td>
                            <td className="py-3 text-sm">{formatPrice(order.total)}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>{order.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No orders yet</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <h3 className="font-semibold text-base lg:text-lg mb-4 lg:mb-6">Quick Actions</h3>
              <div className="space-y-2 lg:space-y-3">
                <button onClick={() => setCurrentView('products')} className="w-full flex items-center gap-3 p-3 lg:p-4 bg-elitos-cream rounded-lg hover:bg-elitos-orange hover:text-white transition-colors group">
                  <Plus size={18} className="text-elitos-orange group-hover:text-white" />
                  <span className="font-medium text-sm lg:text-base">Add Product</span>
                </button>
                <button onClick={() => setCurrentView('orders')} className="w-full flex items-center gap-3 p-3 lg:p-4 bg-blue-50 rounded-lg hover:bg-blue-500 hover:text-white transition-colors group">
                  <ShoppingCart size={18} className="text-blue-500 group-hover:text-white" />
                  <span className="font-medium text-sm lg:text-base">Process Orders</span>
                </button>
                <button onClick={() => setCurrentView('analytics')} className="w-full flex items-center gap-3 p-3 lg:p-4 bg-purple-50 rounded-lg hover:bg-purple-500 hover:text-white transition-colors group">
                  <BarChart3 size={18} className="text-purple-500 group-hover:text-white" />
                  <span className="font-medium text-sm lg:text-base">View Reports</span>
                </button>
              </div>

              <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2 lg:mb-3 text-sm">Quick Summary</h4>
                <div className="space-y-2 text-xs lg:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Revenue</span>
                    <span className="font-medium">{formatPrice(totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pending Orders</span>
                    <span className="font-medium text-yellow-600">{pendingOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subscribers</span>
                    <span className="font-medium">{subscriberCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
