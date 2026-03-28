import { useState, useEffect } from 'react';
import { Mail, Trash2, Download, Search, ChevronLeft } from 'lucide-react';

interface Subscriber {
  email: string;
  subscribedAt: string;
}

interface SubscribersManagementProps {
  onBack: () => void;
}

const SubscribersManagement = ({ onBack }: SubscribersManagementProps) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('newsletter_subscribers');
    if (saved) {
      setSubscribers(JSON.parse(saved));
    }
  }, []);

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (email: string) => {
    const updated = subscribers.filter(s => s.email !== email);
    setSubscribers(updated);
    localStorage.setItem('newsletter_subscribers', JSON.stringify(updated));
  };

  const handleExport = () => {
    const csv = 'Email,Subscribed At\n' + subscribers.map(s => `${s.email},${s.subscribedAt}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Newsletter Subscribers</h1>
              <p className="text-sm text-gray-500">{subscribers.length} total subscribers</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-elitos-orange text-white rounded-lg hover:bg-elitos-red transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
            />
          </div>
        </div>

        {/* Subscribers List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredSubscribers.length === 0 ? (
            <div className="p-12 text-center">
              <Mail size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No subscribers yet</h3>
              <p className="text-gray-500">Subscribers will appear here when users sign up for the newsletter.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Subscribed At</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSubscribers.map((subscriber, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-elitos-orange/10 rounded-full flex items-center justify-center">
                          <Mail size={14} className="text-elitos-orange" />
                        </div>
                        <span className="font-medium text-gray-900">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {formatDate(subscriber.subscribedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(subscriber.email)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscribersManagement;
