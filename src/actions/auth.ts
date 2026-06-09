'use server';

import { cookies } from 'next/headers';

export async function saveToken(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
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
