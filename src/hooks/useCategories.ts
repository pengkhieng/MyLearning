import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeApiCall } from '../api/apiClient';
import { HttpMethod } from '../enum/HttpMethod';
import { ApiEndpoints } from '../constants/ApiEndpoints';
import { Category } from '../types/categoryType';


export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await makeApiCall<Category[]>({
        method: HttpMethod.GET,
        url: ApiEndpoints.CATEGORY.LIST,
        requiresHeader: true,
      });
      
      setCategories(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error };
};
