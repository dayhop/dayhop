'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import instance from '@/lib/api/instance';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const syncAuthState = async () => {
      try {
        const response = await instance.get('/user/me');
        login(response.data);
      } catch (error) {}
    };

    syncAuthState();
  }, [login]);

  return <>{children}</>;
}
