import { useEffect, useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeApiCall } from '../api/apiClient';
import { HttpMethod } from '../enum/HttpMethod';
import { ApiEndpoints, KKey } from '../constants/ApiEndpoints';
import { Category } from '../types/CategoryType';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      if (!forceRefresh) {
        const cachedCategories = await AsyncStorage.getItem(KKey.CATEGORY);
        if (cachedCategories) {
          setCategories(JSON.parse(cachedCategories));
          setLoading(false);
          return;
        }
      }

      const token = await AsyncStorage.getItem(KKey.ACCESS_TOKEN);
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
      await AsyncStorage.setItem(KKey.CATEGORY, JSON.stringify(data));
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

  const addCategory = useCallback(async (category: { name: string; description?: string }) => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem(KKey.ACCESS_TOKEN);
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await makeApiCall<Category>({
        method: HttpMethod.POST,
        url: ApiEndpoints.CATEGORY.CREATE,
        requiresHeader: true,
        data: {
          name: category.name,
          description: category.description || '',
        },
      });

      if (!response.data) {
        throw new Error('Failed to create category: No data returned');
      }

      const newCategory: Category = response.data;
      setCategories((prevCategories) => {
        const updatedCategories = [...prevCategories, newCategory];
        AsyncStorage.setItem(KKey.CATEGORY, JSON.stringify(updatedCategories)).catch((err) =>
          console.error('Failed to update AsyncStorage:', err)
        );
        return updatedCategories;
      });
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Failed to add category';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const editCategory = useCallback(async (id: string, category: { name: string; description?: string }) => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem(KKey.ACCESS_TOKEN);
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await makeApiCall<Category>({
        method: HttpMethod.PUT,
        url: `${ApiEndpoints.CATEGORY.UPDATE}/${id}`,
        requiresHeader: true,
        data: {
          name: category.name,
          description: category.description || '',
        },
      });

      if (!response.data) {
        throw new Error('Failed to update category: No data returned');
      }

      const updatedCategory: Category = response.data;
      setCategories((prevCategories) => {
        const updatedCategories = prevCategories.map((cat) =>
          cat.id === id ? updatedCategory : cat
        );
        AsyncStorage.setItem(KKey.CATEGORY, JSON.stringify(updatedCategories)).catch((err) =>
          console.error('Failed to update AsyncStorage:', err)
        );
        return updatedCategories;
      });
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Failed to update category';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem(KKey.ACCESS_TOKEN);
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      await makeApiCall<void>({
        method: HttpMethod.DELETE,
        url: `${ApiEndpoints.CATEGORY.DELETE}/${id}`,
        requiresHeader: true,
      });

      setCategories((prevCategories) => {
        const updatedCategories = prevCategories.filter((cat) => cat.id !== id);
        AsyncStorage.setItem(KKey.CATEGORY, JSON.stringify(updatedCategories)).catch((err) =>
          console.error('Failed to update AsyncStorage:', err)
        );
        return updatedCategories;
      });
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Failed to delete category';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, fetchCategories, addCategory, editCategory, deleteCategory };
};