'use server';

import { cookies } from 'next/headers';
import * as T from '@/lib/api/auth/type';
import { postLogin } from '@/lib/api/auth';

export async function saveToken(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', accessToken, {
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  });

  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function loginAction(formData: T.LoginRequest) {
  try {
    const res = await postLogin(formData);
    const { accessToken, refreshToken, user } = res;
    if (!accessToken || !refreshToken || !user) throw new Error();
    await saveToken(res.accessToken, res.refreshToken);
    return { success: true, user };
  } catch {
    return { success: false, error: '로그인 실패' };
  }
}
