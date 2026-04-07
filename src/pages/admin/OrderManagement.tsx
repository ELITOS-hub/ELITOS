import { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, Search, Eye, Truck, CheckCircle, X, 
  Package, Clock, Download, MessageCircle, RefreshCw
} from 'lucide-react';
import { useOrders, Order, OrderItem } from '../../context/OrderContext';
import { adminAPI } from '../../services/api';

interface OrderManagementProps {
  onBack: () => void;
}

const OrderManagement = ({ onBack }: OrderManagementProps) => {
  const { orders, updateOrderStatus } = useOrders();
  const [apiOrders, setApiOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  // Load orders from API with auto-refresh
  const loadApiOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('elitos_token');
      console.log('Fetching orders... Token exists:', !!token);
      
      if (!token) {
        setError('Not authenticated. Please logout and login again.');
        setIsLoading(false);
        return;
      }
      
      const response = await adminAPI.getOrders({ limit: 100 });
      console.log('Orders response:', response);
      if (response.orders) {
        setApiOrders(response.orders);
        console.log('Loaded', response.orders.length, 'orders from API');
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err.message || err);
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError('Session expired. Please logout and login again with Google.');
      } else {
        setError(err.message || 'Failed to load orders');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApiOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadApiOrders, 30000);
    return () => clearInterval(interval);
  }, [loadApiOrders]);

  // Combine API orders with local orders
  const allOrders = apiOrders.length > 0 ? apiOrders.map((o: any) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    userId: o.userId || 'guest',
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    items: o.items?.map((item: any) => ({
      productId: item.productId,
      name: item.product?.name || 'Product',
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      image: item.product?.images?.[0] || '',
    })) || [],
    total: o.totalAmount,
    subtotal: o.subtotal,
    shippingCost: o.shippingCost,
    status: o.status?.toLowerCase() || 'pending',
    paymentStatus: o.paymentStatus?.toLowerCase(),
    paymentMethod: o.paymentMethod,
    shippingAddress: {
      street: o.shippingAddress1 || '',
      city: o.shippingCity || '',
      state: o.shippingState || '',
      pincode: o.shippingPincode || '',
    },
    trackingNumber: o.trackingNumber,
    trackingUrl: o.trackingUrl,
    createdAt: o.createdAt,
  })) : orders;

  const filteredOrders = allOrders.filter((o: any) => {
    const matchesSearch = (o.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (o.orderNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (o.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (o.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending' };
      case 'processing': return { icon: Package, color: 'bg-purple-100 text-purple-700', label: 'Processing' };
      case 'shipped': return { icon: Truck, color: 'bg-orange-100 text-orange-700', label: 'Shipped' };
      case 'delivered': return { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Delivered' };
      case 'cancelled': return { icon: X, color: 'bg-red-100 text-red-700', label: 'Cancelled' };
      default: return { icon: Clock, color: 'bg-gray-100 text-gray-700', label: status };
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Try API first
      await adminAPI.updateOrderStatus(orderId, { 
        status: newStatus.toUpperCase(),
        trackingNumber: trackingNumber || undefined,
        trackingUrl: trackingUrl || undefined,
      });
      
      // Refresh orders from API
      const response = await adminAPI.getOrders({ limit: 100 });
      if (response.orders) {
        setApiOrders(response.orders);
      }
    } catch (err) {
      console.log('API update failed, updating locally');
      updateOrderStatus(orderId, newStatus);
    }
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus, trackingNumber, trackingUrl });
    }
    setTrackingNumber('');
    setTrackingUrl('');
  };

  const handleRefresh = async () => {
    await loadApiOrders();
  };

  // Send WhatsApp message to CUSTOMER with order details
  const sendWhatsAppUpdate = (order: Order) => {
    // Get customer phone - remove any non-numeric characters except +
    const customerPhone = order.customerPhone?.replace(/[^0-9+]/g, '') || '';
    
    // Format phone for WhatsApp (add 91 if Indian number without country code)
    let whatsappPhone = customerPhone;
    if (customerPhone && !customerPhone.startsWith('+') && !customerPhone.startsWith('91')) {
      whatsappPhone = '91' + customerPhone;
    } else if (customerPhone.startsWith('+')) {
      whatsappPhone = customerPhone.substring(1); // Remove + for wa.me
    }

    // Get order items list
    const itemsList = order.items?.map((item: OrderItem) => 
      `• ${item.name}${item.size ? ` (Size: ${item.size})` : ''} x ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`
    ).join('\n') || 'Order items';

    // Calculate estimated delivery (5-7 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    const deliveryEndDate = new Date();
    deliveryEndDate.setDate(deliveryEndDate.getDate() + 7);
    const deliveryRange = `${deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${deliveryEndDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;

    // Build detailed message based on order status
    let statusMessage = '';
    switch (order.status) {
      case 'pending':
        statusMessage = `🎉 *Order Confirmed!*\n\nThank you for your order. We're processing it now.`;
        break;
      case 'processing':
        statusMessage = `📦 *Order Being Prepared*\n\nYour order is being packed with care and will be shipped soon.`;
        break;
      case 'shipped':
        statusMessage = `🚚 *Order Shipped!*\n\nGreat news! Your order is on its way.${order.trackingNumber ? `\n\n📍 Tracking: ${order.trackingNumber}` : ''}`;
        break;
      case 'delivered':
        statusMessage = `✅ *Order Delivered!*\n\nWe hope you love your purchase! Thank you for shopping with ELITOS.`;
        break;
      default:
        statusMessage = `📋 *Order Update*`;
    }

    const message = encodeURIComponent(
      `Hi ${order.customerName}! 👋\n\n` +
      `${statusMessage}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🛒 *Order Details*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `📝 Order ID: #${(order.orderNumber || order.id).slice(-8).toUpperCase()}\n\n` +
      `*Items:*\n${itemsList}\n\n` +
      `💰 *Total: ₹${order.total?.toLocaleString()}*\n` +
      `💳 Payment: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Paid'}\n\n` +
      `📍 *Delivery Address:*\n` +
      `${order.shippingAddress?.street || ''}\n` +
      `${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}\n\n` +
      `🗓️ *Expected Delivery:* ${deliveryRange}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Need help? Reply to this message!\n\n` +
      `Thank you for choosing *ELITOS* 🤍\n` +
      `_Premium Footwear & Winterwear_`
    );

    if (whatsappPhone) {
      window.open(`https://wa.me/${whatsappPhone}?text=${message}`, '_blank');
    } else {
      // Fallback: If no customer phone, alert admin
      alert('Customer phone number not available. Please contact customer via email: ' + (order.customerEmail || 'N/A'));
    }
  };

  // Order Detail Modal
  if (selectedOrder) {
    const status = getStatusConfig(selectedOrder.status);
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-bold">Order #{selectedOrder.id.slice(-6)}</h2>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.color}`}>
            <status.icon size={18} />
            <span className="font-medium capitalize">{status.label}</span>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Customer Details</h3>
                <p className="text-gray-700">
                  <strong>{selectedOrder.customerName}</strong><br />
                  {selectedOrder.customerEmail}<br />
                  <span className="text-elitos-orange">📞 {selectedOrder.customerPhone}</span>
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Shipping Address</h3>
                <p className="text-gray-700">
                  {selectedOrder.shippingAddress.street}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                  {selectedOrder.shippingAddress.pincode}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Order Date:</span> {formatDate(selectedOrder.createdAt)} | 
                <span className="font-medium ml-2">Payment:</span> {selectedOrder.paymentMethod}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.size && `Size: ${item.size} | `}Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between">
              <span className="font-semibold">Total Amount</span>
              <span className="font-bold text-xl text-elitos-orange">{formatPrice(selectedOrder.total)}</span>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Update Order Status</h3>
            
            {selectedOrder.status === 'pending' && (
              <div className="space-y-4">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                  className="w-full btn-primary"
                >
                  Start Processing
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg"
                >
                  Cancel Order
                </button>
              </div>
            )}

            {selectedOrder.status === 'processing' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    placeholder="https://tracking.example.com/..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
                  />
                </div>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                  className="w-full btn-primary"
                >
                  Mark as Shipped
                </button>
              </div>
            )}

            {selectedOrder.status === 'shipped' && (
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg"
              >
                Mark as Delivered
              </button>
            )}

            {(selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled') && (
              <p className="text-center text-gray-500">This order is {selectedOrder.status}.</p>
            )}

            {/* WhatsApp Update */}
            <button
              onClick={() => sendWhatsAppUpdate(selectedOrder)}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg"
            >
              <MessageCircle size={18} />
              Send WhatsApp Update
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Orders List
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm px-4 lg:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg lg:text-xl font-bold">Orders</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button className="hidden sm:flex btn-secondary items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
      </header>

      <div className="p-4 lg:p-6">
        {/* Stats - Scrollable on mobile */}
        <div className="flex lg:grid lg:grid-cols-5 gap-3 lg:gap-4 mb-6 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => {
            const count = status === 'all' 
              ? allOrders.length 
              : allOrders.filter((o: any) => o.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-shrink-0 p-3 lg:p-4 rounded-xl text-center transition-colors min-w-[80px] ${
                  filterStatus === status 
                    ? 'bg-elitos-orange text-white' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <p className="text-xl lg:text-2xl font-bold">{count}</p>
                <p className="text-xs lg:text-sm capitalize">{status}</p>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
            />
          </div>
        </div>

        {/* Orders - Mobile Cards / Desktop Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4">
                <img src="/logo.png" alt="Loading" className="w-full h-full object-contain animate-spin-slow" />
              </div>
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto text-red-300 mb-4" />
              <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Orders</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-elitos-orange text-white rounded-lg hover:bg-elitos-red"
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
              <p className="text-gray-500">Orders will appear here when customers place them.</p>
            </div>
          ) : (
            <>
              {/* Mobile View - Cards */}
              <div className="lg:hidden divide-y">
                {filteredOrders.map((order) => {
                  const status = getStatusConfig(order.status);
                  return (
                    <div key={order.id} className="p-4" onClick={() => setSelectedOrder(order)}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">#{(order.orderNumber || order.id).slice(-8)}</p>
                          <p className="text-sm text-gray-500">{order.customerName}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${status.color}`}>
                          <status.icon size={12} />
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-elitos-orange">{formatPrice(order.total)}</span>
                        <span className="text-gray-500">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View - Table */}
              <table className="w-full hidden lg:table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Order</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.map((order) => {
                    const status = getStatusConfig(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium">#{(order.orderNumber || order.id).slice(-8)}</p>
                          <p className="text-xs text-gray-500 uppercase">{order.paymentMethod}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.shippingAddress?.city || ''}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex -space-x-2">
                            {order.items?.slice(0, 2).map((item: OrderItem, idx: number) => (
                              <img 
                                key={idx}
                                src={item.image} 
                                alt=""
                                className="w-8 h-8 rounded border-2 border-white object-cover"
                              />
                            ))}
                            {order.items?.length > 2 && (
                              <div className="w-8 h-8 rounded bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                                +{order.items.length - 2}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${status.color}`}>
                            <status.icon size={12} />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => sendWhatsAppUpdate(order)}
                              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            >
                              <MessageCircle size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
