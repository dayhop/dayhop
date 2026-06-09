export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: AuthUser;
  refreshToken: string;
  accessToken: string;
}

export interface TokenResponse {
  refreshToken: string;
  accessToken: string;
}
