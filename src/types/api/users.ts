export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

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
