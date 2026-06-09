import type { User } from '@/types/api';
export type { User };

export interface CreateSignUpRequest {
  email: string;
  nickname: string;
  password: string;
}

export type CreateSignUpResponse = User;

export type GetMyUserResponse = User;

export interface UpdateMyUserRequest {
  nickname?: string;
  profileImageUrl?: string;
  newPassword?: string;
}

export type UpdateMyUserResponse = User;

export interface CreateUserImageRequest {
  image: File;
}

export interface CreateUserImageResponse {
  profileImageUrl: string;
}
