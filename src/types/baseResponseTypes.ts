export interface BaseResponse<T> {
  status: string;
  message: string;
  data: T | null;
}