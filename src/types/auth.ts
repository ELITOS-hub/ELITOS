// Authentication types for ELITOS

export type UserRole = 'customer' | 'wholesale' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  provider: 'email' | 'google' | 'apple';
  createdAt: Date;
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
  };
  wholesaleApproved?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface AuthContextType {
  auth: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string } | void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}