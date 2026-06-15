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
import axios from 'axios';
import { getMyUser } from '@/lib/api/users';
import { User } from '@/types/api';

// 쿠키 관리를 위한 헬퍼 함수
function getCookie(name: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length >= 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : undefined;
  }
  return undefined;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; secure; samesite=lax`;
}

function deleteCookie(name: string) {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure; samesite=lax`;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (accessToken: string) => Promise<void>;
  logout: (options?: { redirect?: boolean }) => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(
    (options?: { redirect?: boolean }) => {
      if (typeof window !== 'undefined') {
        deleteCookie('accessToken');
      }
      setUser(null);
      if (options?.redirect !== false) {
        router.push('/');
      }
    },
    [router]
  );

  const fetchUser = useCallback(async () => {
    try {
      const userData = await getMyUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout({ redirect: false });
      }
    }
  }, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = getCookie('accessToken');
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
        setCookie('accessToken', accessToken, 60 * 15);
      }
      await fetchUser();
    },
    [fetchUser]
  );

  const refreshUser = useCallback(async () => {
    if (typeof window !== 'undefined' && getCookie('accessToken')) {
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
