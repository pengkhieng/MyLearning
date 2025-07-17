import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeApiCall } from '../api/apiClient';
import { HttpMethod } from '../enum/HttpMethod';
import { LoginData, LoginResponse } from '../types/authTypes';
import { ApiEndpoints } from '../constants/ApiEndpoints';

export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LoginResponse | null>(null);

  const loginUser = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await makeApiCall<LoginResponse>({
        method: HttpMethod.POST,
        url: ApiEndpoints.AUTH.LOGIN,
        data: { username, password },
      });

      const loginData = response.data;

      if (loginData) {
       const accessToken = loginData.data?.accessToken;
        const refreshToken  = loginData.data?.refreshToken;
        const expiresIn  = loginData.data?.expiresIn;

        if (accessToken) {
          await AsyncStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
          await AsyncStorage.setItem('refreshToken', refreshToken);
        }
        if (expiresIn) {
          const expirationDate = Date.now() + expiresIn * 1000;
          await AsyncStorage.setItem('tokenExpiration', expirationDate.toString());
        }

        setData(response.data);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }
  
      const response = await makeApiCall<LoginResponse>({
        method: HttpMethod.POST,
        url: ApiEndpoints.AUTH.REFRESH,
        data: { refreshToken: storedRefreshToken },
      });
  
      const loginData = response.data;
  
      if (loginData) {
        const accessToken = loginData.data?.accessToken;
        const newRefreshToken = loginData.data?.refreshToken;
        const expiresIn = loginData.data?.expiresIn;
  
        if (accessToken) {
          await AsyncStorage.setItem('accessToken', accessToken);
        }
        if (newRefreshToken) {
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
        }
        if (expiresIn) {
          const expirationDate = Date.now() + expiresIn * 1000;
          await AsyncStorage.setItem('tokenExpiration', expirationDate.toString());
        }
  
        setData(response.data);
      }
  
      return response;
    } catch (err: any) {
      const errorMessage = err?.message || 'Token refresh failed';
      setError(errorMessage);
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'tokenExpiration']);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return { loginUser, refreshAccessToken, loading, error, data };
};
