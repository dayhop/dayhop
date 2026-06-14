'use server';

import { cookies } from 'next/headers';
import { serverInstance } from '../instance';
import * as T from './type';

export const postLogin = async (body: T.LoginRequest): Promise<T.LoginResponse> => {
  const { data } = await serverInstance.post<T.LoginResponse>('/auth/login', body);

  (await cookies()).set('accessToken', data.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  });

  (await cookies()).set('refreshToken', data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return data;
};

export const postRefreshToken = async (): Promise<T.TokenResponse> => {
  const { data } = await serverInstance.post<T.TokenResponse>('/auth/tokens');
  (await cookies()).set('accessToken', data.accessToken, {
    httpOnly: true,
    secure: true,
    path: '/',
  });

  return data;
};
