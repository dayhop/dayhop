'use server';
import { serverInstance } from '../instance';
import * as T from './type';

export const postOauthApp = async (
  body: T.CreateOauthAppRequest
): Promise<T.CreateOauthAppResponse> => {
  const { data } = await serverInstance.post<T.CreateOauthAppResponse>('/oauth/apps', body);
  return data;
};

export const postOauthSignUp = async (
  provider: T.OauthProvider,
  body: T.SignUpWithOauthRequest
): Promise<T.SignUpWithOauthResponse> => {
  const { data } = await serverInstance.post<T.SignUpWithOauthResponse>(
    `/oauth/sign-up/${provider}`,
    body
  );
  return data;
};

export const postOauthSignIn = async (
  provider: T.OauthProvider,
  body: T.SignInWithOauthRequest
): Promise<T.SignInWithOauthResponse> => {
  const { data } = await serverInstance.post<T.SignInWithOauthResponse>(
    `/oauth/sign-in/${provider}`,
    body
  );
  return data;
};
