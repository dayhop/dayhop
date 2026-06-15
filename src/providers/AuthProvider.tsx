'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import instance from '@/lib/api/instance';

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

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const login = useAuthStore((state) => state.login);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    const syncAuthState = async () => {
      const token = getCookie('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await instance.get('/users/me'); // Note: API spec should match /users/me
        login(response.data);
      } catch {
        setIsLoading(false);
      }
    };

    syncAuthState();
  }, [login, setIsLoading]);

  return <>{children}</>;
}
