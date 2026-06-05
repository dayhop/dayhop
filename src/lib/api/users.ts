import instance from '@/lib/api/instance';
import {
  CreateSignUpRequest,
  CreateSignUpResponse,
  GetMyUserResponse,
  UpdateMyUserRequest,
  UpdateMyUserResponse,
  CreateUserImageRequest,
  CreateUserImageResponse,
} from '@/types/api/users';

export const postSignUp = async (body: CreateSignUpRequest): Promise<CreateSignUpResponse> => {
  const { data } = await instance.post<CreateSignUpResponse>('/users', body);
  return data;
};

export const getMyUser = async (): Promise<GetMyUserResponse> => {
  const { data } = await instance.get<GetMyUserResponse>('/users/me');
  return data;
};

export const patchMyUser = async (body: UpdateMyUserRequest): Promise<UpdateMyUserResponse> => {
  const { data } = await instance.patch<UpdateMyUserResponse>('/users/me', body);
  return data;
};

export const postMyUserProfile = async (
  body: CreateUserImageRequest
): Promise<CreateUserImageResponse> => {
  const formData = new FormData();
  formData.append('image', body.image);
  const { data } = await instance.post<CreateUserImageResponse>('/users/me/image', formData);
  return data;
};
