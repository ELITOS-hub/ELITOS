import { useState, useEffect } from 'react';
import { AlertCircle, X, Database, CreditCard } from 'lucide-react';

interface SystemStatus {
  api: boolean;
  database: boolean;
  payments: boolean;
  email: boolean;
  mode: 'production' | 'demo';
}

const SystemStatus = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const user = localStorage.getItem('elitos_user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setIsAdmin(parsed.role === 'admin');
      } catch {}
    }

    // Fetch system status
    const checkStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://elitosbackend.vercel.app/api';
        // Use /health endpoint (remove /api suffix as health is at root)
        const baseUrl = apiUrl.replace('/api', '');
        const response = await fetch(`${baseUrl}/health`);
        if (response.ok) {
          const data = await response.json();
          setStatus({
            api: true,
            database: data.database === 'connected',
            payments: data.razorpay === 'configured',
            email: data.email === 'configured',
            mode: data.database === 'connected' ? 'production' : 'demo'
          });
        }
      } catch {
        setStatus(null);
      }
    };

    checkStatus();
  }, []);

  // Only show to admins and only if there are critical issues
  if (!isAdmin || dismissed || !status) return null;
  
  // Don't show if database is connected (main requirement)
  // Payments warning only shows if database is connected but payments aren't
  if (status.database && status.mode === 'production') {
    // In production mode with database, only show if payments not configured
    if (status.payments) return null;
  }
  
  // If database not connected, that's critical
  if (!status.database) {
    // Show database error
  }

  const issues = [];
  if (!status.database) issues.push({ icon: Database, text: 'Database not connected - running in demo mode' });
  if (status.database && !status.payments) issues.push({ icon: CreditCard, text: 'Razorpay LIVE keys not configured' });

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className={`${!status.database ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border rounded-lg shadow-lg p-4`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className={`w-5 h-5 ${!status.database ? 'text-red-600' : 'text-amber-600'} flex-shrink-0 mt-0.5`} />
            <div>
              <p className={`font-medium ${!status.database ? 'text-red-800' : 'text-amber-800'} text-sm`}>
                {!status.database ? 'Demo Mode Active' : 'Payment Setup Required'}
              </p>
              <p className={`text-xs ${!status.database ? 'text-red-700' : 'text-amber-700'} mt-1`}>
                {!status.database 
                  ? 'Database not connected. Check Supabase project status.'
                  : 'Add Razorpay LIVE keys to accept real payments.'
                }
              </p>
              <ul className="mt-2 space-y-1">
                {issues.map((issue, i) => (
                  <li key={i} className={`flex items-center gap-2 text-xs ${!status.database ? 'text-red-700' : 'text-amber-700'}`}>
                    <issue.icon size={12} />
                    {issue.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button 
            onClick={() => setDismissed(true)}
            className={`${!status.database ? 'text-red-600 hover:text-red-800' : 'text-amber-600 hover:text-amber-800'}`}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
