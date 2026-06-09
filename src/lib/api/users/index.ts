import instance from '../instance';
import type {
  CreateSignUpRequest,
  CreateSignUpResponse,
  GetMyUserResponse,
  UpdateMyUserRequest,
  UpdateMyUserResponse,
  CreateUserImageRequest,
  CreateUserImageResponse,
} from './type';

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
