import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const AuthStatus = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { auth } = useAuth();

  if (auth.isAuthenticated) {
    return null; // Don't show if user is already logged in
  }

  return (
    <>
      {/* Call-to-Action for Authentication */}
      <div className="bg-gradient-to-r from-elitos-orange to-elitos-red text-white py-3 px-4 text-center">
        <div className="container-custom">
          <p className="text-sm">
            <span className="font-medium">Join ELITOS today!</span>
            {' '}Sign up for exclusive deals and early access to new collections.
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="ml-2 underline hover:no-underline font-medium"
            >
              Get Started →
            </button>
          </p>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signup"
      />
    </>
  );
};

export default AuthStatus;