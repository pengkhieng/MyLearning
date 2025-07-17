import { BaseResponse } from "./baseResponseTypes";

// Sent in the login request
export interface LoginRequest {
  username: string;
  password: string;
}

// Represents the authenticated user
export interface User {
  id: string;
  username: string;
  email: string | null;
  profileImage: string | null;
  roles: string[];
}

// Returned from the login API
export interface LoginData {
  user: User;
  refreshToken: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

// Full API response type
export type LoginResponse = BaseResponse<LoginData>;
