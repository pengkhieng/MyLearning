import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeApiCall } from '../api/apiClient';
import { HttpMethod } from '../enum/HttpMethod';
import { LoginResponse, LoginRequest ,LoginData, ResetPasswordRequest} from '../types/AuthTypes';
import { ApiEndpoints, KKey } from '../constants/ApiEndpoints';
import { User } from '../types/User';

export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LoginResponse | null>(null);

  // Store the User object in AsyncStorage
  async function storeUser(user: User | null | undefined): Promise<boolean> {
    try {
      if (!user) {
        console.warn('No user data to store');
        return false;
      }
      const userJson = JSON.stringify(user);
      await AsyncStorage.setItem(KKey.USER, userJson);
      console.log('User stored successfully');
      return true;
    } catch (error) {
      console.error('Error storing user:', error);
      return false;
    }
  }

  // Login function
  const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);

    try {
      const request: LoginRequest = { username, password };
      // Use LoginData as the generic type since makeApiCall returns BaseResponse<LoginData>
      const response = await makeApiCall<LoginData>({
        method: HttpMethod.POST,
        url: ApiEndpoints.AUTH.LOGIN,
        data: request,
      });

      // response.data is LoginData; response is BaseResponse<LoginData> (i.e., LoginResponse)
      const loginData = response.data;

      if (loginData) {
        const { accessToken, refreshToken, expiresIn, user } = loginData;

        // Store tokens and expiration
        await AsyncStorage.setItem(KKey.ACCESS_TOKEN, accessToken);
        await AsyncStorage.setItem(KKey.REFRESH_TOKEN, refreshToken);
        const expirationDate = Date.now() + expiresIn * 1000;
        await AsyncStorage.setItem(KKey.TOKEN_EXPRIATION, expirationDate.toString());

        // Store user
        await storeUser(user);

        setData(response);
      } else {
        throw new Error('Invalid response structure');
      }

      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      // Clear all stored data on error
      await AsyncStorage.clear();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Refresh token function
  const refreshAccessToken = async (): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);

    try {
      const storedRefreshToken = await AsyncStorage.getItem(KKey.REFRESH_TOKEN);
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      // Use LoginData as the generic type
      const response = await makeApiCall<LoginData>({
        method: HttpMethod.POST,
        url: ApiEndpoints.AUTH.REFRESH,
        data: { refreshToken: storedRefreshToken },
      });

      // response.data is LoginData; response is BaseResponse<LoginData>
      const loginData = response.data;

      if (loginData) {
        const { accessToken, refreshToken, expiresIn, user } = loginData;

        // Store tokens and expiration
        await AsyncStorage.setItem(KKey.ACCESS_TOKEN, accessToken);
        await AsyncStorage.setItem(KKey.REFRESH_TOKEN, refreshToken);
        const expirationDate = Date.now() + expiresIn * 1000;
        await AsyncStorage.setItem(KKey.TOKEN_EXPRIATION, expirationDate.toString());

        // Store user
        await storeUser(user);

        setData(response);
      } else {
        throw new Error('Invalid response structure');
      }

      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Token refresh failed';
      setError(errorMessage);
      // Clear all stored data on error
      await AsyncStorage.clear();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const signUpUser = async (username: string, email: string, password: string,verificationCode: string ): Promise<LoginResponse> => {

    setLoading(true);
    setError(null);

    try {
      const request = { username, email , password , verificationCode};
      
      // Use LoginData as the generic type since makeApiCall returns BaseResponse<LoginData>
      const response = await makeApiCall<LoginData>({
        method: HttpMethod.POST,
        url: ApiEndpoints.AUTH.REGISTER,
        data: request,
      });

      // response.data is LoginData; response is BaseResponse<LoginData> (i.e., LoginResponse)
      const loginData = response.data;

      if (loginData) {
        const { accessToken, refreshToken, expiresIn, user } = loginData;

        // Store tokens and expiration
        await AsyncStorage.setItem(KKey.ACCESS_TOKEN, accessToken);
        await AsyncStorage.setItem(KKey.REFRESH_TOKEN, refreshToken);
        const expirationDate = Date.now() + expiresIn * 1000;
        await AsyncStorage.setItem(KKey.TOKEN_EXPRIATION, expirationDate.toString());

        // Store user
        await storeUser(user);

        setData(response);
      } else {
        throw new Error('Invalid response structure');
      }

      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      // Clear all stored data on error
      await AsyncStorage.clear();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const requestVerification = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
  
    try {
      const request = { email };
  
      const response = await makeApiCall({
        method: HttpMethod.POST,
        url: ApiEndpoints.AUTH.REQUEST_VERIFICATION,
        data: request,
        requiresHeader: false,
      });
  
      // Assuming response is of type BaseResponse<LoginData>
      console.log('Response:', response);
  
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Sent code failed';
      setError(errorMessage);
  
      // Clear all stored data on error
      await AsyncStorage.clear();
  
      return false; // You don't need to throw if you're returning a boolean
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
  
    try {
      const request = { email };
  
      const response = await makeApiCall({
        method: HttpMethod.POST,
        url: ApiEndpoints.AUTH.RESEND_VERIFICATION,
        data: request,
        requiresHeader: false,
      });
  
      // Assuming response is of type BaseResponse<LoginData>
      console.log('Response:', response);
  
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Sent code failed';
      setError(errorMessage);
  
      // Clear all stored data on error
      await AsyncStorage.clear();
  
      return false; // You don't need to throw if you're returning a boolean
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
  
    try {
      const request = { email };
  
      const response = await makeApiCall({
        method: HttpMethod.POST,
        url: ApiEndpoints.AUTH.FORGOT_PASSWORD,
        data: request,
        requiresHeader: false,
      });
  
      // Assuming response is of type BaseResponse<LoginData>
      console.log('Response:', response);
  
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Sent code failed';
      setError(errorMessage);
  
      // Clear all stored data on error
      await AsyncStorage.clear();
  
      return false; // You don't need to throw if you're returning a boolean
    } finally {
      setLoading(false);
    }
  };
  

  const resetPassword = async (email: string, password, code: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
  
    try {
      const request: ResetPasswordRequest = { email, password , code};
  
      const response = await makeApiCall({
        method: HttpMethod.POST,
        url: ApiEndpoints.AUTH.RESET_PASSWORD,
        data: request,
        requiresHeader: false,
      });
  
      // Assuming response is of type BaseResponse<LoginData>
      console.log('Response:', response);
  
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Sent code failed';
      setError(errorMessage);
  
      // Clear all stored data on error
      await AsyncStorage.clear();
  
      return false; // You don't need to throw if you're returning a boolean
    } finally {
      setLoading(false);
    }
  };
  
  

  return { loginUser, refreshAccessToken, signUpUser,resendVerification, requestVerification,forgotPassword, resetPassword, loading, error, data };
};