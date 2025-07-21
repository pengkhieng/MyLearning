import { BaseResponse } from "./BaseResponseTypes";

export interface Category {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type LoginResponse = BaseResponse<Category[]>;