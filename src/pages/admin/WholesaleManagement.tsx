import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Search, Phone, Mail, Building2, Trash2, Eye, MessageCircle, RefreshCw } from 'lucide-react';
import { adminAPI } from '../../services/api';

interface WholesaleInquiry {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  city?: string;
  expectedMonthlyQty?: string;
  status: 'new' | 'contacted' | 'converted' | 'rejected' | 'pending' | 'approved';
  createdAt: string;
  notes?: string;
}

interface WholesaleManagementProps {
  onBack: () => void;
}

const WholesaleManagement = ({ onBack }: WholesaleManagementProps) => {
  const [inquiries, setInquiries] = useState<WholesaleInquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<WholesaleInquiry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingAPI, setIsUsingAPI] = useState(false);

  // Load inquiries from API or localStorage
  const loadInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const applications = await adminAPI.getWholesaleApplications();
      if (applications && applications.length > 0) {
        const mapped: WholesaleInquiry[] = applications.map((a: any) => ({
          id: a.id,
          businessName: a.businessName,
          ownerName: a.ownerName,
          phone: a.phone,
          email: a.email,
          city: a.city,
          expectedMonthlyQty: a.expectedMonthlyQty,
          status: a.status?.toLowerCase() || 'pending',
          createdAt: a.createdAt,
          notes: a.notes,
        }));
        setInquiries(mapped);
        setIsUsingAPI(true);
        return;
      }
    } catch (err) {
      console.log('API not available for wholesale, using localStorage');
    }

    // Fallback to localStorage
    const saved = localStorage.getItem('elitos_wholesale_inquiries');
    if (saved) {
      try {
        setInquiries(JSON.parse(saved));
      } catch {
        setInquiries([]);
      }
    }
    setIsUsingAPI(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const saveInquiries = (updated: WholesaleInquiry[]) => {
    localStorage.setItem('elitos_wholesale_inquiries', JSON.stringify(updated));
    setInquiries(updated);
  };

  const updateStatus = async (id: string, status: WholesaleInquiry['status']) => {
    try {
      if (isUsingAPI) {
        await adminAPI.updateWholesaleApplication(id, { status });
        await loadInquiries();
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status });
        }
        return;
      }
    } catch (err) {
      console.error('API update failed:', err);
    }
    
    // Fallback to localStorage
    const updated = inquiries.map(i => i.id === id ? { ...i, status } : i);
    saveInquiries(updated);
    if (selectedInquiry?.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status });
    }
  };

  const deleteInquiry = async (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      // For now, only localStorage delete (API doesn't have delete endpoint)
      const updated = inquiries.filter(i => i.id !== id);
      saveInquiries(updated);
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    }
  };

  const openWhatsApp = (inquiry: WholesaleInquiry) => {
    const message = encodeURIComponent(
      `Hi ${inquiry.ownerName},\n\n` +
      `Thank you for your interest in ELITOS wholesale partnership!\n\n` +
      `Business: ${inquiry.businessName}\n` +
      `We would love to discuss pricing and terms with you.\n\n` +
      `Best regards,\nELITOS Team`
    );
    window.open(`https://wa.me/91${inquiry.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = 
      i.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'contacted': return 'bg-purple-100 text-purple-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'converted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new' || i.status === 'pending').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    converted: inquiries.filter(i => i.status === 'converted' || i.status === 'approved').length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Wholesale Inquiries</h1>
            <p className="text-gray-500 text-sm">{stats.total} total inquiries</p>
          </div>
          {isUsingAPI && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">API Connected</span>}
        </div>
        <button
          onClick={loadInquiries}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          title="Refresh"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </header>

      <div className="p-4 lg:p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-blue-600 text-sm">New</p>
            <p className="text-2xl font-bold text-blue-700">{stats.new}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4">
            <p className="text-yellow-600 text-sm">Contacted</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.contacted}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-green-600 text-sm">Converted</p>
            <p className="text-2xl font-bold text-green-700">{stats.converted}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="approved">Approved</option>
              <option value="converted">Converted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredInquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Business</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Contact</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">City</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{inquiry.businessName}</p>
                          <p className="text-sm text-gray-500">{inquiry.ownerName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <p className="flex items-center gap-1"><Phone size={12} /> {inquiry.phone}</p>
                          <p className="flex items-center gap-1 text-gray-500"><Mail size={12} /> {inquiry.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{inquiry.city || '-'}</td>
                      <td className="px-4 py-3">
                        <select
                          value={inquiry.status}
                          onChange={(e) => updateStatus(inquiry.id, e.target.value as WholesaleInquiry['status'])}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)} border-0 cursor-pointer`}
                        >
                          <option value="new">New</option>
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="approved">Approved</option>
                          <option value="converted">Converted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openWhatsApp(inquiry)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </button>
                          <button
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => deleteInquiry(inquiry.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No wholesale inquiries yet</p>
              <p className="text-sm text-gray-400 mt-1">Inquiries from the wholesale page will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg">Inquiry Details</h3>
              <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-gray-100 rounded-lg">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-elitos-cream rounded-full flex items-center justify-center">
                  <Building2 size={24} className="text-elitos-orange" />
                </div>
                <div>
                  <h4 className="font-semibold">{selectedInquiry.businessName}</h4>
                  <p className="text-sm text-gray-500">{selectedInquiry.ownerName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <a href={`tel:${selectedInquiry.phone}`} className="font-medium text-elitos-orange">{selectedInquiry.phone}</a>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${selectedInquiry.email}`} className="font-medium text-elitos-orange text-sm break-all">{selectedInquiry.email}</a>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">City</p>
                  <p className="font-medium">{selectedInquiry.city || '-'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInquiry.status)}`}>
                    {selectedInquiry.status}
                  </span>
                </div>
              </div>

              {selectedInquiry.expectedMonthlyQty && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Message / Expected Qty</p>
                  <p className="text-sm">{selectedInquiry.expectedMonthlyQty}</p>
                </div>
              )}

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Submitted On</p>
                <p className="font-medium">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => openWhatsApp(selectedInquiry)}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </button>
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="flex-1 bg-elitos-orange text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  Call
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WholesaleManagement;
