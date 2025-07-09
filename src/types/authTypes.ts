import { BaseResponse } from "./baseResponseTypes";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string | null;
  roles: string[];
}

export interface LoginData {
  user: User;
  refreshToken: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export type LoginResponse = BaseResponse<LoginData>;