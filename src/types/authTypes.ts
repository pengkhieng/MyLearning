import { BaseResponse } from "./baseResponseTypes";
import { User } from "./User";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginData {
  user: User;
  refreshToken: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export type LoginResponse = BaseResponse<LoginData>;
