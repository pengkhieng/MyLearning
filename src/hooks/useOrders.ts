import { useEffect, useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeApiCall } from '../api/apiClient';
import { HttpMethod } from '../enum/HttpMethod';
import { ApiEndpoints } from '../constants/ApiEndpoints';

export interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  sellerId: string;
  name: string;
  address: string;
  phone: string;
  customTotalPrice: number;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      if (!forceRefresh) {
        const cachedOrders = await AsyncStorage.getItem('orders');
        if (cachedOrders) {
          setOrders(JSON.parse(cachedOrders));
          setLoading(false);
          return;
        }
      }

      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await makeApiCall<Order[]>({
        method: HttpMethod.GET,
        url: ApiEndpoints.ORDER.LIST,
        requiresHeader: true,
      });

      const data = response.data || [];
      setOrders(data);
      await AsyncStorage.setItem('orders', JSON.stringify(data));
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Failed to fetch orders';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addOrder = useCallback(async (order: { name: string; address: string; phone: string; customTotalPrice: number; items: { itemId: string; quantity: number }[] }) => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await makeApiCall<Order>({
        method: HttpMethod.POST,
        url: ApiEndpoints.ORDER.CREATE,
        requiresHeader: true,
        data: {
          name: order.name,
          address: order.address,
          phone: order.phone,
          customTotalPrice: order.customTotalPrice,
          items: order.items,
        },
      });

      if (!response.data) {
        throw new Error('Failed to create order: No data returned');
      }

      const newOrder: Order = response.data;
      setOrders((prevOrders) => {
        const updatedOrders = [...prevOrders, newOrder];
        AsyncStorage.setItem('orders', JSON.stringify(updatedOrders)).catch((err) =>
          console.error('Failed to update AsyncStorage:', err)
        );
        return updatedOrders;
      });
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Failed to add order';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const editOrder = useCallback(async (id: string, order: { name: string; address: string; phone: string; customTotalPrice: number; items: { itemId: string; quantity: number }[] }) => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await makeApiCall<Order>({
        method: HttpMethod.PUT,
        url: `${ApiEndpoints.ORDER.UPDATE}/${id}`,
        requiresHeader: true,
        data: {
          name: order.name,
          address: order.address,
          phone: order.phone,
          customTotalPrice: order.customTotalPrice,
          items: order.items,
        },
      });

      if (!response.data) {
        throw new Error('Failed to update order: No data returned');
      }

      const updatedOrder: Order = response.data;
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((ord) =>
          ord.id === id ? updatedOrder : ord
        );
        AsyncStorage.setItem('orders', JSON.stringify(updatedOrders)).catch((err) =>
          console.error('Failed to update AsyncStorage:', err)
        );
        return updatedOrders;
      });
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Failed to update order';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      await makeApiCall<void>({
        method: HttpMethod.DELETE,
        url: `${ApiEndpoints.ORDER.DELETE}/${id}`,
        requiresHeader: true,
      });

      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.filter((ord) => ord.id !== id);
        AsyncStorage.setItem('orders', JSON.stringify(updatedOrders)).catch((err) =>
          console.error('Failed to update AsyncStorage:', err)
        );
        return updatedOrders;
      });
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Failed to delete order';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, fetchOrders, addOrder, editOrder, deleteOrder };
};