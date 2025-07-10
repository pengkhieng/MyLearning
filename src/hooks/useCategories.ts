import { useEffect, useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeApiCall } from '../api/apiClient';
import { HttpMethod } from '../enum/HttpMethod';
import { ApiEndpoints } from '../constants/ApiEndpoints';
import { Category } from '../types/categoryType';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      // Check for cached categories
      if (!forceRefresh) {
        const cachedCategories = await AsyncStorage.getItem('categories');
        if (cachedCategories) {
          setCategories(JSON.parse(cachedCategories));
          setLoading(false);
          return;
        }
      }

      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await makeApiCall<Category[]>({
        method: HttpMethod.GET,
        url: ApiEndpoints.CATEGORY.LIST,
        requiresHeader: true,
      });

      const data = response.data || [];
      setCategories(data);
      // Cache the categories
      await AsyncStorage.setItem('categories', JSON.stringify(data));
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Failed to fetch categories';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, fetchCategories };
};