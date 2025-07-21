import AsyncStorage from '@react-native-async-storage/async-storage';
import { HttpMethod } from '../enum/HttpMethod';
import { BaseResponse } from '../types/BaseResponseTypes';
import { ApiEndpoints, KKey } from '../constants/ApiEndpoints';

const TIMEOUT = 10000;
const ENABLE_LOGS = true;

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
  contentType?: string; // e.g., 'application/json' or 'multipart/form-data'
}

export const makeApiCall = async <T>({
  method = HttpMethod.GET,
  url,
  data,
  requiresHeader = false,
  contentType = 'application/json',
}: ApiRequestOptions): Promise<BaseResponse<T>> => {
  const headers: Record<string, string> = {
    accept: '*/*',
  };

  // Only add Content-Type for JSON; skip for multipart/form-data so fetch can set boundary automatically
  if (contentType === 'application/json') {
    headers['Content-Type'] = 'application/json';
  }

  if (requiresHeader) {
    const token = await AsyncStorage.getItem(KKey.ACCESS_TOKEN);
    if (!token) {
      throw new ApiError('No access token found', 401);
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (ENABLE_LOGS) {
    console.group(`🌐 API Request: ${method} ${url}`);
    console.table({ Method: method, URL: url, Headers: headers });
    if (data && method !== HttpMethod.GET) {
      if (contentType === 'application/json') {
        console.log('📤 Request Body:', JSON.stringify(data, null, 2));
      } else if (contentType === 'multipart/form-data') {
        console.log('📤 Request Body: FormData');
      }
    }
    console.groupEnd();
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const baseUrl = ApiEndpoints.BASE_URL.endsWith('/')
      ? ApiEndpoints.BASE_URL.slice(0, -1)
      : ApiEndpoints.BASE_URL;
    const endpoint = url.startsWith('/') ? url : `/${url}`;
    const fullUrl = baseUrl + endpoint;

    const body =
      contentType === 'application/json' && data && method !== HttpMethod.GET
        ? JSON.stringify(data)
        : data && method !== HttpMethod.GET
        ? data
        : undefined;

    const response = await fetch(fullUrl, {
      method,
      headers,
      body,
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
