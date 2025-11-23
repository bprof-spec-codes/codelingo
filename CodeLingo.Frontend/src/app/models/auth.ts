export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  message?: string;
  userId?: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}