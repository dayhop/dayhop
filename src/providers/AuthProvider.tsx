'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import instance, { getCookie } from '@/lib/api/instance';

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
