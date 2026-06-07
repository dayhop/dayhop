'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { getMyUser } from '@/lib/api/users';
import { User } from '@/types/api/users';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (accessToken: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    setUser(null);
    router.push('/');
  }, [router]);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await getMyUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          await fetchUser();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [fetchUser]);

  const login = useCallback(
    async (accessToken: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
      }
      await fetchUser();
    },
    [fetchUser]
  );

  const refreshUser = useCallback(async () => {
    if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
      await fetchUser();
    }
  }, [fetchUser]);

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
