import { useAuth } from '../context/AuthContext';

const WelcomeMessage = () => {
  const { auth } = useAuth();

  if (!auth.isAuthenticated || !auth.user) {
    return null;
  }

  return (
    <div className="bg-elitos-cream border-l-4 border-elitos-orange p-4 mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-elitos-orange text-white rounded-full flex items-center justify-center">
            👋
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-elitos-brown">
            Welcome back, {auth.user.name}!
          </p>
          <p className="text-xs text-gray-600">
            Continue shopping your favorite premium styles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;