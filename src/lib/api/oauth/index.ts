'use server';
import { cookies } from 'next/headers';
import { serverInstance } from '../instance';
import { safeApi } from '../safeApi';
import type { ApiResult } from '../result';
import * as T from './type';

const setAuthCookies = async (accessToken: string, refreshToken: string) => {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  });
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const postOauthApp = async (
  body: T.CreateOauthAppRequest
): Promise<ApiResult<T.CreateOauthAppResponse>> =>
  safeApi(() => serverInstance.post<T.CreateOauthAppResponse>('/oauth/apps', body));

export const postOauthSignUp = async (
  provider: T.OauthProvider,
  body: T.SignUpWithOauthRequest
): Promise<ApiResult<T.SignUpWithOauthResponse>> => {
  const result = await safeApi(() =>
    serverInstance.post<T.SignUpWithOauthResponse>(`/oauth/sign-up/${provider}`, body)
  );
  if (result.success) {
    await setAuthCookies(result.data.accessToken, result.data.refreshToken);
  }
  return result;
};

export const postOauthSignIn = async (
  provider: T.OauthProvider,
  body: T.SignInWithOauthRequest
): Promise<ApiResult<T.SignInWithOauthResponse>> => {
  const result = await safeApi(() =>
    serverInstance.post<T.SignInWithOauthResponse>(`/oauth/sign-in/${provider}`, body)
  );
  if (result.success) {
    await setAuthCookies(result.data.accessToken, result.data.refreshToken);
  }
  return result;
};
