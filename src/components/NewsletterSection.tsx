import { useState } from 'react';
import { Mail, CheckCircle, Gift } from 'lucide-react';
import { newsletterAPI } from '../services/api';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Try API first
      await newsletterAPI.subscribe(email);
      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      // Fallback to localStorage
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      subscribers.push({
        email,
        subscribedAt: new Date().toISOString(),
      });
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      setIsSubscribed(true);
      setEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-r from-elitos-brown to-elitos-red">
      <div className="container-custom">
        <div className="max-w-xl mx-auto text-center text-white">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift size={24} className="text-white" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Get 10% Off Your First Order
          </h2>
          <p className="text-white/80 text-sm mb-6">
            Subscribe for exclusive deals and new arrivals.
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2 bg-white/20 rounded-xl p-4">
              <CheckCircle size={20} className="text-green-300" />
              <span className="font-medium">You're in! Check your email for the code.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-elitos-orange text-sm"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="bg-elitos-orange hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 whitespace-nowrap text-sm"
              >
                {isLoading ? 'Subscribing...' : 'Get 10% Off'}
              </button>
            </form>
          )}

          {error && <p className="text-red-300 text-sm mt-2">{error}</p>}
          <p className="text-xs text-white/50 mt-3">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
