export interface UserProfile {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSignUpRequest {
  email: string;
  nickname: string;
  password: string;
}

export type CreateSignUpResponse = UserProfile;

export type GetMyUserResponse = UserProfile;

export interface UpdateMyUserRequest {
  nickname?: string;
  profileImageUrl?: string;
  newPassword?: string;
}

export type UpdateMyUserResponse = UserProfile;

export interface CreateUserImageRequest {
  image: File;
}

export interface CreateUserImageResponse {
  profileImageUrl: string;
}
