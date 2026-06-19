'use server';
import { serverInstance } from '../instance';
import { safeApi } from '../safeApi';
import type { ApiResult } from '../result';
import * as T from './type';

export const postOauthApp = async (
  body: T.CreateOauthAppRequest
): Promise<ApiResult<T.CreateOauthAppResponse>> =>
  safeApi(() => serverInstance.post<T.CreateOauthAppResponse>('/oauth/apps', body));

export const postOauthSignUp = async (
  provider: T.OauthProvider,
  body: T.SignUpWithOauthRequest
): Promise<ApiResult<T.SignUpWithOauthResponse>> =>
  safeApi(() => serverInstance.post<T.SignUpWithOauthResponse>(`/oauth/sign-up/${provider}`, body));

export const postOauthSignIn = async (
  provider: T.OauthProvider,
  body: T.SignInWithOauthRequest
): Promise<ApiResult<T.SignInWithOauthResponse>> =>
  safeApi(() => serverInstance.post<T.SignInWithOauthResponse>(`/oauth/sign-in/${provider}`, body));
