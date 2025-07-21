import { useEffect, useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeApiCall } from '../api/apiClient';
import { HttpMethod } from '../enum/HttpMethod';
import { ApiEndpoints, KKey } from '../constants/ApiEndpoints';
import { Product } from '../types/Product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      if (!forceRefresh) {
        const cachedProducts = await AsyncStorage.getItem('products');
        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts));
          setLoading(false);
          return;
        }
      }

      const token = await AsyncStorage.getItem(KKey.ACCESS_TOKEN);
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await makeApiCall<Product[]>({
        method: HttpMethod.GET,
        url: ApiEndpoints.PRODUCT.LIST,
        requiresHeader: true,
      });

      const data = response.data || [];
      setProducts(data);
      await AsyncStorage.setItem('products', JSON.stringify(data));
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Failed to fetch products';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (product: { name: string; description: string; price: number; categoryId: string; stock: number; active?: boolean }) => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await makeApiCall<Product>({
        method: HttpMethod.POST,
        url: ApiEndpoints.PRODUCT.CREATE,
        requiresHeader: true,
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          stock: product.stock,
          active: product.active ?? true,
        },
      });

      if (!response.data) {
        throw new Error('Failed to create product: No data returned');
      }

      const newProduct: Product = response.data;
      setProducts((prevProducts) => {
        const updatedProducts = [...prevProducts, newProduct];
        AsyncStorage.setItem('products', JSON.stringify(updatedProducts)).catch((err) =>
          console.error('Failed to update AsyncStorage:', err)
        );
        return updatedProducts;
      });
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Failed to add product';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const editProduct = useCallback(async (id: string, product: { name: string; description: string; price: number; categoryId: string; stock: number; active?: boolean }) => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await makeApiCall<Product>({
        method: HttpMethod.PUT,
        url: `${ApiEndpoints.PRODUCT.UPDATE}/${id}`,
        requiresHeader: true,
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          stock: product.stock,
          active: product.active ?? true,
        },
      });

      if (!response.data) {
        throw new Error('Failed to update product: No data returned');
      }

      const updatedProduct: Product = response.data;
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.map((prod) =>
          prod.itemId === id ? updatedProduct : prod
        );
        AsyncStorage.setItem('products', JSON.stringify(updatedProducts)).catch((err) =>
          console.error('Failed to update AsyncStorage:', err)
        );
        return updatedProducts;
      });
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Failed to update product';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      await makeApiCall<void>({
        method: HttpMethod.DELETE,
        url: `${ApiEndpoints.PRODUCT.DELETE}/${id}`,
        requiresHeader: true,
      });

      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.filter((prod) => prod.itemId !== id);
        AsyncStorage.setItem('products', JSON.stringify(updatedProducts)).catch((err) =>
          console.error('Failed to update AsyncStorage:', err)
        );
        return updatedProducts;
      });
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Failed to delete product';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, fetchProducts, addProduct, editProduct, deleteProduct };
};