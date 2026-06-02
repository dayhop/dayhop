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

export type GetUsersResponse = User;

export interface UpdateUsersRequest {
  nickname?: string;
  profileImageUrl?: string;
  newPassword?: string;
}

export type UpdateUsersResponse = User;

export interface CreateUsersImageRequest {
  image: File;
}

export interface CreateUsersImageResponse {
  profileImageUrl: string;
}
