'use server';
import { serverInstance } from '../instance';
import { safeApi } from '../safeApi';
import type { ApiResult } from '../result';
import * as T from './type';

export const postSignUp = async (
  body: T.CreateSignUpRequest
): Promise<ApiResult<T.CreateSignUpResponse>> =>
  safeApi(() => serverInstance.post<T.CreateSignUpResponse>('/users', body));

export const getMyUser = async (): Promise<ApiResult<T.GetMyUserResponse>> =>
  safeApi(() => serverInstance.get<T.GetMyUserResponse>('/users/me'));

export const patchMyUser = async (
  body: T.UpdateMyUserRequest
): Promise<ApiResult<T.UpdateMyUserResponse>> =>
  safeApi(() => serverInstance.patch<T.UpdateMyUserResponse>('/users/me', body));

export const postMyUserProfile = async (
  body: T.CreateUserImageRequest
): Promise<ApiResult<T.CreateUserImageResponse>> =>
  safeApi(() => {
    const formData = new FormData();
    formData.append('image', body.image);
    return serverInstance.post<T.CreateUserImageResponse>('/users/me/image', formData);
  });
