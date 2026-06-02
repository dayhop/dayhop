export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  refreshToken: string;
  accessToken: string;
}

export interface TokenResponse {
  refreshToken: string;
  accessToken: string;
}
