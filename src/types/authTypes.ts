import { BaseResponse } from "./BaseResponseTypes";
import { User } from "./User";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  code: string;
}

export interface LoginData {
  user: User;
  refreshToken: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export type LoginResponse = BaseResponse<LoginData>;
