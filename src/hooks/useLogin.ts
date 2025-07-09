import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse, LoginData } from '../types/authTypes';
import { HttpMethod } from '../enum/HttpMethod';
import { makeApiCall } from '../api/apiClient';
import { ApiEndpoints } from '../constants/ApiEndpoints';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LoginResponse | null>(null);

  const loginUser = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeApiCall<LoginData>({
        method: HttpMethod.POST,
        url: ApiEndpoints.AUTH.LOGIN,
        data: { username, password },
      });
      setData(response);

      if (response.data?.accessToken) {
        await AsyncStorage.setItem('accessToken', response.data.accessToken);
      }
      if (response.data?.refreshToken) {
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      }
      if (response.data?.expiresIn) {
        const expirationDate = new Date().getTime() + response.data.expiresIn * 1000;
        await AsyncStorage.setItem('tokenExpiration', expirationDate.toString());
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await makeApiCall<LoginData>({
        method: HttpMethod.POST,
        url: ApiEndpoints.AUTH.REFRESH,
        data: { refreshToken: storedRefreshToken },
      });

      if (response.data?.accessToken) {
        await AsyncStorage.setItem('accessToken', response.data.accessToken);
      }
      if (response.data?.refreshToken) {
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      }
      if (response.data?.expiresIn) {
        const expirationDate = new Date().getTime() + response.data.expiresIn * 1000;
        await AsyncStorage.setItem('tokenExpiration', expirationDate.toString());
      }

      setData(response);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Token refresh failed';
      setError(errorMessage);
      // Clear tokens on refresh failure
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'tokenExpiration']);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, refreshToken, loading, error, data };
};