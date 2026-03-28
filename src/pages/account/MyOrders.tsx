import { useState, useCallback } from 'react';
import { Package, Truck, CheckCircle, Clock, X, ChevronRight, Eye, RefreshCw, ExternalLink } from 'lucide-react';
import { CONTACT, WHATSAPP_MESSAGES } from '../../config/contact';
import { useOrders, Order } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600 bg-yellow-50', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-600 bg-blue-50', label: 'Confirmed' },
  processing: { icon: Package, color: 'text-purple-600 bg-purple-50', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-orange-600 bg-orange-50', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-600 bg-green-50', label: 'Delivered' },
  cancelled: { icon: X, color: 'text-red-600 bg-red-50', label: 'Cancelled' },
};

interface MyOrdersProps {
  onBack: () => void;
}

const MyOrders = ({ onBack }: MyOrdersProps) => {
  const { orders, getOrdersByUser, refreshOrders } = useOrders();
  const { auth } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshOrders();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshOrders]);

  // Get user's orders
  const userOrders = auth.user?.id 
    ? getOrdersByUser(auth.user.id)
    : orders; // Show all if no user (for demo)

  const filteredOrders = filter === 'all' 
    ? userOrders 
    : userOrders.filter(o => o.status === filter);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (selectedOrder) {
    const status = statusConfig[selectedOrder.status];
    const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStepIndex = statusSteps.indexOf(selectedOrder.status);

    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container-custom py-8">
          <button 
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            ← Back to Orders
          </button>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order #{selectedOrder.id.slice(-6)}</h1>
                <p className="text-gray-500">Placed on {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.color}`}>
                <status.icon size={18} />
                <span className="font-medium capitalize">{status.label}</span>
              </div>
            </div>

            {/* Order Timeline */}
            {selectedOrder.status !== 'cancelled' && (
              <div className="mb-8">
                <h3 className="font-semibold mb-4">Order Timeline</h3>
                <div className="flex items-center justify-between">
                  {statusSteps.map((step, idx) => {
                    const stepConfig = statusConfig[step as keyof typeof statusConfig];
                    const isCompleted = currentStepIndex >= idx;
                    return (
                      <div key={step} className="flex-1 flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                          <stepConfig.icon size={16} />
                        </div>
                        {idx < 3 && (
                          <div className={`flex-1 h-1 ${currentStepIndex > idx ? 'bg-green-500' : 'bg-gray-200'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Pending</span>
                  <span>Processing</span>
                  <span>Shipped</span>
                  <span>Delivered</span>
                </div>
              </div>
            )}

            {/* Tracking Info */}
            {selectedOrder.trackingNumber && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-800 mb-2">Tracking Information</h3>
                <p className="text-blue-700">Tracking Number: <span className="font-mono">{selectedOrder.trackingNumber}</span></p>
                {selectedOrder.trackingUrl && (
                  <a 
                    href={selectedOrder.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-2"
                  >
                    <ExternalLink size={14} />
                    Track Your Order
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      {item.size && `Size: ${item.size} | `}Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">Shipping Address</h3>
              <p className="text-gray-700">
                {selectedOrder.customerName}<br />
                {selectedOrder.shippingAddress.street}<br />
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                {selectedOrder.shippingAddress.pincode}<br />
                Phone: {selectedOrder.customerPhone}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Total Amount</span>
                  <span className="font-bold text-elitos-orange">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <a 
              href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.orderHelp(selectedOrder.id.slice(-6)))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Need Help?
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-custom py-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Back to Account
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-elitos-brown">My Orders</h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            title="Refresh orders"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'bg-elitos-orange text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <div 
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order.id.slice(-6)}</h3>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${status.color}`}>
                      <status.icon size={14} />
                      <span className="capitalize">{status.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <img 
                          key={idx}
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 rounded-lg border-2 border-white object-cover"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-elitos-orange">{formatPrice(order.total)}</p>
                      <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <button className="flex items-center gap-1 text-elitos-orange text-sm font-medium hover:underline">
                      <Eye size={16} />
                      View Details
                    </button>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
