import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeApiCall } from '../api/apiClient';
import { HttpMethod } from '../enum/HttpMethod';
import { ApiEndpoints } from '../constants/ApiEndpoints';
import { KKey } from '../constants/ApiEndpoints';
import UseProfileReturn from '../types/UseProfileReturn';
import { User } from '../types/User';

export const useProfile = (): UseProfileReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getUser = useCallback(async (): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching user from AsyncStorage'); // Debug log
      const userJson = await AsyncStorage.getItem(KKey.USER);
      console.log('Stored userJson:', userJson); // Debug stored data
      if (userJson) {
        const parsedUser = JSON.parse(userJson) as User;
        // Only update state if user data has changed
        setUser(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(parsedUser)) {
            console.log('Updating user state:', parsedUser); // Debug state update
            return parsedUser;
          }
          console.log('No change in user data, skipping state update'); // Debug no update
          return prev;
        });
        return parsedUser;
      }
      // Only update state if user is not already null
      setUser(prev => {
        if (prev !== null) {
          console.log('No user data found, setting user to null'); // Debug null state
          return null;
        }
        return prev;
      });
      return null;
    } catch (error) {
      console.error('Error retrieving user:', error);
      setError('Failed to retrieve user data');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array for stable reference

  async function storeUser(user: User): Promise<boolean> {
    try {
      const userJson = JSON.stringify(user);
      await AsyncStorage.setItem(KKey.USER, userJson);
      console.log('User stored successfully');
      return true;
    } catch (error) {
      console.error('Error storing user:', error);
      return false;
    }
  }

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
        url: ApiEndpoints.PROFILE.UPDATE,
        data: formData,
        requiresHeader: true,
        contentType: 'multipart/form-data',
      });

      if (!response.data) {
        throw new Error('Failed to update profile image: No data returned');
      }

      storeUser(response.data);

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

  return { user, loading, error, handleImageChange, getUser };
}