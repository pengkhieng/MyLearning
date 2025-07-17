import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeApiCall } from '../api/apiClient';
import { HttpMethod } from '../enum/HttpMethod';
import { User } from '../types/authTypes';
import { ApiEndpoints } from '../constants/ApiEndpoints';


export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (newImageUri: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      const formData = new FormData();
      formData.append('image', {
        uri: newImageUri,
        type: 'image/png',
        name: 'profile.png',
      } as any); // React Native FormData workaround

      const response = await makeApiCall<User>({
        method: HttpMethod.PUT,
        url: ApiEndpoints.PROFILE.UPDATE,  // or ApiEndpoints.FILE.UPDATE_PROFILE
        data: formData,
        requiresHeader: true,
        contentType: 'multipart/form-data',
      });

      if (!response.data) {
        throw new Error('Failed to update profile image: No data returned');
      }

      setUser(prev => prev ? { ...prev, profileImage: response.data?.profileImage ?? '' } : response.data);
    } catch (err: any) {
      const errorMessage =
        err?.status === 401
          ? 'Unauthorized. Please log in again.'
          : err?.message || 'Failed to upload profile image';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, handleImageChange };
};
