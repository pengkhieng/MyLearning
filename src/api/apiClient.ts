import AsyncStorage from '@react-native-async-storage/async-storage';
import { HttpMethod } from '../enum/HttpMethod';
import { BaseResponse } from '../types/baseResponseTypes';

const BASE_URL = 'https://khieng.online/api';
const TIMEOUT = 10000;
const ENABLE_LOGS = true;

interface FetchOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface ApiRequestOptions {
  method?: HttpMethod;
  url: string;
  data?: any;
  requiresHeader?: boolean;
}

export const makeApiCall = async <T>({
  method = HttpMethod.GET,
  url,
  data,
  requiresHeader = false,
}: ApiRequestOptions): Promise<BaseResponse<T>> => {
  const headers: Record<string, string> = {
    accept: '*/*',
    'Content-Type': 'application/json',
  };

  if (requiresHeader) {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new ApiError('No access token found', 401);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  if (ENABLE_LOGS) {
    console.group(`🌐 API Request: ${method} ${url}`);
    console.table({ Method: method, URL: url, Headers: headers });
    if (data && method !== HttpMethod.GET) {
      console.log('📤 Request Body:', JSON.stringify(data, null, 2));
    }
    console.groupEnd();
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const fullUrl = `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
    const response = await fetch(fullUrl, {
      method,
      headers,
      body: data && method !== HttpMethod.GET ? JSON.stringify(data) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let responseBody: BaseResponse<T>;
    try {
      responseBody = await response.json();
    } catch (e) {
      throw new ApiError('Invalid JSON response', response.status);
    }

    if (ENABLE_LOGS) {
      console.group('✅ API Response');
      console.log('Status       :', response.status);
      console.log('Status Text  :', responseBody.status);
      console.log('Message      :', responseBody.message);
      console.log('📊 Body      :', JSON.stringify(responseBody, null, 2));
      console.groupEnd();
    }

    if (!response.ok) {
      throw new ApiError(responseBody.message || `HTTP error! Status: ${response.status}`, response.status);
    }

    return responseBody;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (ENABLE_LOGS) {
      console.error('❌ API Error:', error.message, error.status ? `(Status: ${error.status})` : '');
    }

    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out', 408);
    }

    throw error instanceof ApiError ? error : new ApiError(error.message || 'Network error');
  }
};