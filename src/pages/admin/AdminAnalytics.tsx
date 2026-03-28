import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Star } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useCustomers } from '../../context/CustomerContext';
import { useProducts } from '../../context/ProductContext';
import { useReviews } from '../../context/ReviewContext';

interface AdminAnalyticsProps {
  onBack: () => void;
}

const AdminAnalytics = ({ onBack }: AdminAnalyticsProps) => {
  const { orders } = useOrders();
  const { customers } = useCustomers();
  const { products } = useProducts();
  const { reviews } = useReviews();

  // Calculate real stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const deliveredRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
  
  // Today's stats
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

  // This week's stats
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekOrders = orders.filter(o => new Date(o.createdAt) >= weekAgo);
  const weekRevenue = weekOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue), change: '+18%', trend: 'up', icon: DollarSign },
    { label: 'Total Orders', value: orders.length.toString(), change: '+12%', trend: 'up', icon: ShoppingCart },
    { label: 'Total Customers', value: customers.length.toString(), change: '+25%', trend: 'up', icon: Users },
    { label: 'Avg. Order Value', value: orders.length > 0 ? formatPrice(totalRevenue / orders.length) : '₹0', change: '+5%', trend: 'up', icon: TrendingUp },
  ];

  // Top products by orders
  const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { name: item.name, sales: 0, revenue: 0 };
      }
      productSales[item.productId].sales += item.quantity;
      productSales[item.productId].revenue += item.price * item.quantity;
    });
  });
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // City-wise orders
  const cityOrders: Record<string, number> = {};
  orders.forEach(order => {
    const city = order.shippingAddress.city;
    cityOrders[city] = (cityOrders[city] || 0) + 1;
  });
  const topCities = Object.entries(cityOrders)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  function formatPrice(price: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Analytics & Reports</h2>
      </header>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-elitos-cream rounded-lg flex items-center justify-center">
                  <stat.icon size={24} className="text-elitos-orange" />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Overview */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Revenue Overview</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-xl font-bold text-green-600">{formatPrice(todayRevenue)}</p>
                <p className="text-xs text-gray-500">{todayOrders.length} orders</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-xl font-bold text-blue-600">{formatPrice(weekRevenue)}</p>
                <p className="text-xs text-gray-500">{weekOrders.length} orders</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-xl font-bold text-purple-600">{formatPrice(deliveredRevenue)}</p>
                <p className="text-xs text-gray-500">{deliveredOrders.length} orders</p>
              </div>
            </div>
            
            {/* Order Status Breakdown */}
            <h4 className="font-medium mb-3">Order Status</h4>
            <div className="space-y-2">
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => {
                const count = orders.filter(o => o.status === status).length;
                const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className="w-24 text-sm text-gray-600 capitalize">{status}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          status === 'delivered' ? 'bg-green-500' :
                          status === 'cancelled' ? 'bg-red-500' :
                          status === 'shipped' ? 'bg-orange-500' :
                          status === 'processing' ? 'bg-purple-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm font-medium text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package size={20} className="text-elitos-orange" />
                  <span className="text-gray-700">Products</span>
                </div>
                <span className="font-bold">{products.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star size={20} className="text-yellow-500" />
                  <span className="text-gray-700">Reviews</span>
                </div>
                <span className="font-bold">{reviews.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-blue-500" />
                  <span className="text-gray-700">Customers</span>
                </div>
                <span className="font-bold">{customers.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ShoppingCart size={20} className="text-green-500" />
                  <span className="text-gray-700">Orders</span>
                </div>
                <span className="font-bold">{orders.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sales data yet. Orders will appear here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b">
                    <th className="pb-4">Product</th>
                    <th className="pb-4">Sales</th>
                    <th className="pb-4">Revenue</th>
                    <th className="pb-4">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-elitos-cream rounded-full flex items-center justify-center text-sm font-medium text-elitos-orange">
                            {idx + 1}
                          </span>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4">{product.sales} units</td>
                      <td className="py-4 font-medium text-green-600">{formatPrice(product.revenue)}</td>
                      <td className="py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-elitos-orange h-2 rounded-full"
                            style={{ width: `${(product.sales / (topProducts[0]?.sales || 1)) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Customer Demographics */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Orders by City</h3>
          {topCities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No location data yet.</p>
          ) : (
            <div className="space-y-4">
              {topCities.map(([city, count], idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="w-32 text-gray-700">{city}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-elitos-orange h-2 rounded-full"
                      style={{ width: `${(count / (topCities[0]?.[1] || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="font-medium w-12 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
