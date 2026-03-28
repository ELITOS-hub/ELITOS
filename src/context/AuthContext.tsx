import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';
import { User, AuthState, AuthContextType, LoginCredentials, SignupCredentials } from '../types/auth';
import { authAPI } from '../services/api';
import { supabase, isSupabaseConfigured } from '../config/supabase';

// Admin emails list - centralized
const ADMIN_EMAILS = [
  'admin@elitos.com', 
  'elitos.contact@gmail.com', 
  'elitosofficial02@gmail.com', 
  'ragsproai@gmail.com'
];

// Initial auth state
const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true
  error: null,
};

// Auth actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_LOADED' }
  | { type: 'CLEAR_ERROR' };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false, error: null };
    case 'AUTH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'AUTH_LOGOUT':
      return { ...state, user: null, isAuthenticated: false, isLoading: false, error: null };
    case 'AUTH_LOADED':
      return { ...state, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, dispatch] = useReducer(authReducer, initialAuthState);
  const initializedRef = useRef(false);
  const processingGoogleLoginRef = useRef(false);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authAPI.login(credentials);
      
      localStorage.setItem('elitos_token', response.token);
      
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        phone: response.user.phone,
        role: response.user.role.toLowerCase() as 'customer' | 'wholesale' | 'admin',
        provider: 'email',
        createdAt: new Date(response.user.createdAt),
        preferences: { newsletter: true, notifications: true },
      };
      
      localStorage.setItem('elitos_user', JSON.stringify(user));
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error: any) {
      const errorMessage = error.message || 'Invalid email or password';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      const response = await authAPI.register({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name,
        phone: credentials.phone,
      });
      
      localStorage.setItem('elitos_token', response.token);
      
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role.toLowerCase() as 'customer' | 'wholesale' | 'admin',
        provider: 'email',
        createdAt: new Date(),
        preferences: { newsletter: true, notifications: true },
      };
      
      localStorage.setItem('elitos_user', JSON.stringify(user));
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
    }
  };

  const loginWithGoogle = async () => {
    dispatch({ type: 'AUTH_START' });
    
    if (!isSupabaseConfigured()) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Google login not configured. Please add Supabase credentials.' });
      return;
    }
    
    try {
      processingGoogleLoginRef.current = true;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) {
        processingGoogleLoginRef.current = false;
        dispatch({ type: 'AUTH_ERROR', payload: error.message });
      }
    } catch (error) {
      processingGoogleLoginRef.current = false;
      dispatch({ type: 'AUTH_ERROR', payload: 'Failed to login with Google' });
    }
  };

  const loginWithApple = async () => {
    // Apple login removed
  };

  const logout = async () => {
    // Sign out from Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.log('Supabase signout error:', e);
      }
    }
    
    localStorage.removeItem('elitos_token');
    localStorage.removeItem('elitos_user');
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const updateProfile = async (data: Partial<User>) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      if (auth.user) {
        const updatedUser = { ...auth.user, ...data };
        localStorage.setItem('elitos_user', JSON.stringify(updatedUser));
        dispatch({ type: 'AUTH_SUCCESS', payload: updatedUser });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Failed to update profile' });
    }
  };

  const resetPassword = async (email: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authAPI.forgotPassword(email);
      dispatch({ type: 'CLEAR_ERROR' });
      return { success: true, message: response.message };
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message || 'Failed to send reset email' });
      return { success: false };
    }
  };

  // Helper to create user from Supabase session and sync with backend
  const createUserFromSupabase = async (supaUser: any): Promise<User> => {
    const isAdminEmail = ADMIN_EMAILS.includes(supaUser.email?.toLowerCase() || '');
    
    // Sync with backend to get JWT token
    try {
      const response = await authAPI.googleSync({
        email: supaUser.email || '',
        name: supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
        googleId: supaUser.id,
        avatar: supaUser.user_metadata?.avatar_url || supaUser.user_metadata?.picture,
      });
      
      // Save backend JWT token
      localStorage.setItem('elitos_token', response.token);
      
      return {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        phone: response.user.phone || '',
        avatar: supaUser.user_metadata?.avatar_url || supaUser.user_metadata?.picture,
        role: response.user.role.toLowerCase() as 'customer' | 'wholesale' | 'admin',
        provider: 'google',
        createdAt: new Date(response.user.createdAt),
        preferences: { newsletter: true, notifications: true },
      };
    } catch (error) {
      console.error('Backend sync failed:', error);
      // Fallback to Supabase-only user (won't have backend API access)
      return {
        id: supaUser.id,
        email: supaUser.email || '',
        name: supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
        phone: supaUser.phone || '',
        avatar: supaUser.user_metadata?.avatar_url || supaUser.user_metadata?.picture,
        role: isAdminEmail ? 'admin' : 'customer',
        provider: 'google',
        createdAt: new Date(supaUser.created_at),
        preferences: { newsletter: true, notifications: true },
      };
    }
  };

  // Initialize auth on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initAuth = async () => {
      // First check localStorage for existing session
      const storedUser = localStorage.getItem('elitos_user');
      const storedToken = localStorage.getItem('elitos_token');
      
      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          
          // If it's a Google user, verify with Supabase
          if (user.provider === 'google' && isSupabaseConfigured()) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              // Session still valid
              dispatch({ type: 'AUTH_SUCCESS', payload: user });
              return;
            }
            // Session expired, clear storage
            localStorage.removeItem('elitos_token');
            localStorage.removeItem('elitos_user');
            dispatch({ type: 'AUTH_LOADED' });
            return;
          }
          
          // For email users, try to verify with backend
          try {
            const userData = await authAPI.getMe();
            const verifiedUser: User = {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              phone: userData.phone,
              role: userData.role.toLowerCase() as 'customer' | 'wholesale' | 'admin',
              provider: 'email',
              createdAt: new Date(userData.createdAt),
              preferences: { newsletter: true, notifications: true },
            };
            localStorage.setItem('elitos_user', JSON.stringify(verifiedUser));
            dispatch({ type: 'AUTH_SUCCESS', payload: verifiedUser });
          } catch {
            // Backend verification failed, use stored user
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
          }
          return;
        } catch {
          localStorage.removeItem('elitos_token');
          localStorage.removeItem('elitos_user');
        }
      }
      
      // Check for Supabase session (for Google OAuth redirect)
      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const user = await createUserFromSupabase(session.user);
          localStorage.setItem('elitos_user', JSON.stringify(user));
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
          return;
        }
      }
      
      dispatch({ type: 'AUTH_LOADED' });
    };

    initAuth();

    // Listen for Supabase auth changes (for Google login)
    let subscription: { unsubscribe: () => void } | null = null;
    
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Supabase auth event:', event);
        
        // Only handle SIGNED_IN after OAuth redirect (not INITIAL_SESSION)
        if (event === 'SIGNED_IN' && session?.user && processingGoogleLoginRef.current) {
          processingGoogleLoginRef.current = false;
          const user = await createUserFromSupabase(session.user);
          localStorage.setItem('elitos_user', JSON.stringify(user));
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        }
        
        // Handle token refresh silently
        if (event === 'TOKEN_REFRESHED' && session?.user) {
          localStorage.setItem('elitos_token', session.access_token);
        }
        
        // Ignore INITIAL_SESSION - we handle this in initAuth
        if (event === 'INITIAL_SESSION') {
          return;
        }
        
        // Only handle SIGNED_OUT if user explicitly logged out
        if (event === 'SIGNED_OUT') {
          const currentUser = localStorage.getItem('elitos_user');
          if (currentUser) {
            try {
              const user = JSON.parse(currentUser);
              if (user.provider === 'google') {
                localStorage.removeItem('elitos_token');
                localStorage.removeItem('elitos_user');
                dispatch({ type: 'AUTH_LOGOUT' });
              }
            } catch {}
          }
        }
      });
      subscription = data.subscription;
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const contextValue: AuthContextType = {
    auth,
    login,
    signup,
    loginWithGoogle,
    loginWithApple,
    logout,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
