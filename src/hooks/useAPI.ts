// Custom hook for API calls with localStorage fallback
import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface UseAPIOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null);

  // Check if backend is available
  const checkBackend = useCallback(async (): Promise<boolean> => {
    if (isBackendAvailable !== null) return isBackendAvailable;
    
    try {
      const response = await fetch(`${API_URL.replace('/api', '')}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      const available = response.ok;
      setIsBackendAvailable(available);
      return available;
    } catch {
      setIsBackendAvailable(false);
      return false;
    }
  }, [isBackendAvailable]);

  // Generic API call with fallback
  const apiCall = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {},
    fallbackFn?: () => T | Promise<T>,
    opts?: UseAPIOptions
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('elitos_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const backendAvailable = await checkBackend();
      
      if (backendAvailable) {
        const response = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
          throw new Error(errorData.error || 'Request failed');
        }

        const data = await response.json();
        opts?.onSuccess?.(data);
        return data;
      } else if (fallbackFn) {
        // Use localStorage fallback
        const data = await fallbackFn();
        opts?.onSuccess?.(data);
        return data;
      } else {
        throw new Error('Backend not available');
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      opts?.onError?.(err as Error);
      
      // Try fallback on error
      if (fallbackFn) {
        try {
          const data = await fallbackFn();
          setError(null);
          opts?.onSuccess?.(data);
          return data;
        } catch {
          // Fallback also failed
        }
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [checkBackend]);

  return {
    apiCall,
    isLoading,
    error,
    isBackendAvailable,
    checkBackend,
  };
};

// Helper to get/set localStorage with type safety
export const localStorageHelper = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};
