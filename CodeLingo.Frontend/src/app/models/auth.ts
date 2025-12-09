export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  message?: string;
  userId?: string;
  isAdmin: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}