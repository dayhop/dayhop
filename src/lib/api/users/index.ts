'use server';
import { serverInstance } from '../instance';
import * as T from './type';

export const postSignUp = async (body: T.CreateSignUpRequest): Promise<T.CreateSignUpResponse> => {
  const { data } = await serverInstance.post<T.CreateSignUpResponse>('/users', body);
  return data;
};

export const getMyUser = async (): Promise<T.GetMyUserResponse> => {
  const { data } = await serverInstance.get<T.GetMyUserResponse>('/users/me');
  return data;
};

export const patchMyUser = async (body: T.UpdateMyUserRequest): Promise<T.UpdateMyUserResponse> => {
  const { data } = await serverInstance.patch<T.UpdateMyUserResponse>('/users/me', body);
  return data;
};

export const postMyUserProfile = async (
  body: T.CreateUserImageRequest
): Promise<T.CreateUserImageResponse> => {
  const formData = new FormData();
  formData.append('image', body.image);
  const { data } = await serverInstance.post<T.CreateUserImageResponse>(
    '/users/me/image',
    formData
  );
  return data;
};
