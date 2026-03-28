import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Search, Eye, Mail, Phone, ShoppingBag, Users, UserCheck, RefreshCw } from 'lucide-react';
import { useCustomers, Customer } from '../../context/CustomerContext';
import { adminAPI } from '../../services/api';

interface CustomerManagementProps {
  onBack: () => void;
}

interface ApiCustomer {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  businessName: string | null;
  isApproved: boolean;
  createdAt: string;
  _count: { orders: number };
}

const CustomerManagement = ({ onBack }: CustomerManagementProps) => {
  const { customers: localCustomers } = useCustomers();
  const [apiCustomers, setApiCustomers] = useState<ApiCustomer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch customers from API
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminAPI.getCustomers();
      setApiCustomers(data);
    } catch (err) {
      console.log('Using local customers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Use API customers if available, otherwise local
  const customers: Customer[] = apiCustomers.length > 0 
    ? apiCustomers.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || '',
        totalOrders: c._count?.orders || 0,
        totalSpent: 0, // Will be calculated from orders
        createdAt: c.createdAt,
        lastOrderAt: '',
        provider: c.role === 'WHOLESALE' ? 'wholesale' : 'email',
      }))
    : localCustomers;

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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

  const stats = [
    { label: 'Total Customers', value: customers.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Orders', value: customers.reduce((sum, c) => sum + c.totalOrders, 0), icon: ShoppingBag, color: 'bg-green-500' },
    { label: 'Total Revenue', value: formatPrice(customers.reduce((sum, c) => sum + c.totalSpent, 0)), icon: UserCheck, color: 'bg-purple-500' },
  ];

  // Customer Detail
  if (selectedCustomer) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSelectedCustomer(null)} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold">Customer Details</h2>
        </header>

        <div className="p-6 max-w-4xl mx-auto space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-elitos-cream rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-elitos-orange">
                  {selectedCustomer.name[0]}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selectedCustomer.name}</h2>
                <div className="flex items-center gap-6 text-gray-600">
                  <span className="flex items-center gap-2">
                    <Mail size={16} />
                    {selectedCustomer.email}
                  </span>
                  {selectedCustomer.phone && (
                    <span className="flex items-center gap-2">
                      <Phone size={16} />
                      {selectedCustomer.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-3xl font-bold text-elitos-orange">{selectedCustomer.totalOrders}</p>
              <p className="text-gray-500">Total Orders</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-3xl font-bold text-green-600">{formatPrice(selectedCustomer.totalSpent)}</p>
              <p className="text-gray-500">Total Spent</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">
                {selectedCustomer.totalOrders > 0 
                  ? formatPrice(selectedCustomer.totalSpent / selectedCustomer.totalOrders)
                  : '₹0'}
              </p>
              <p className="text-gray-500">Avg. Order Value</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingBag size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Last Order</p>
                  <p className="text-sm text-gray-500">
                    {selectedCustomer.lastOrderAt ? formatDate(selectedCustomer.lastOrderAt) : 'No orders yet'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Joined ELITOS</p>
                  <p className="text-sm text-gray-500">{formatDate(selectedCustomer.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <a
              href={`mailto:${selectedCustomer.email}`}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <Mail size={18} />
              Send Email
            </a>
            {selectedCustomer.phone && (
              <a
                href={`https://wa.me/91${selectedCustomer.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Customer List
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm px-4 lg:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg lg:text-xl font-bold">Customers</h2>
        </div>
        <button 
          onClick={fetchCustomers}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </header>

      <div className="p-4 lg:p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm p-4 lg:p-6 flex items-center gap-4">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold">{stat.value}</p>
                <p className="text-gray-500 text-xs lg:text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
            />
          </div>
        </div>

        {/* Customers - Mobile Cards / Desktop Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No customers yet</h3>
              <p className="text-gray-500">Customers will appear here when they register or place orders.</p>
            </div>
          ) : (
            <>
              {/* Mobile View - Cards */}
              <div className="lg:hidden divide-y">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="p-4" onClick={() => setSelectedCustomer(customer)}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-elitos-cream rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-semibold text-elitos-orange text-lg">{customer.name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{customer.name}</p>
                        <p className="text-sm text-gray-500 truncate">{customer.email}</p>
                        {customer.phone && (
                          <p className="text-sm text-elitos-orange flex items-center gap-1">
                            <Phone size={12} />
                            {customer.phone}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>{customer.totalOrders} orders</span>
                          <span>{formatPrice(customer.totalSpent)}</span>
                        </div>
                      </div>
                      <Eye size={18} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View - Table */}
              <table className="w-full hidden lg:table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Orders</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Total Spent</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Joined</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-elitos-cream rounded-full flex items-center justify-center">
                            <span className="font-semibold text-elitos-orange">{customer.name[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-gray-500">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {customer.phone ? (
                          <a 
                            href={`tel:${customer.phone}`}
                            className="text-elitos-orange hover:underline flex items-center gap-1"
                          >
                            <Phone size={14} />
                            {customer.phone}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium">{customer.totalOrders}</td>
                      <td className="px-6 py-4 font-medium text-green-600">{formatPrice(customer.totalSpent)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(customer.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
