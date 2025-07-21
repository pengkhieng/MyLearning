import { useCallback, useEffect, useState } from "react";
import { Summary } from "../types/Summary";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiEndpoints, KKey } from "../constants/ApiEndpoints";
import { makeApiCall } from "../api/apiClient";
import { HttpMethod } from "../enum/HttpMethod";

export const useSummary = () => {
  const [summary, setSummary] = useState<Summary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      if (!forceRefresh) {
        const cachedSummary = await AsyncStorage.getItem(KKey.SUMMARY);
        if (cachedSummary) {
          setSummary(JSON.parse(cachedSummary));
          setLoading(false);
          return;
        }
      }

      const token = await AsyncStorage.getItem(KKey.ACCESS_TOKEN);
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await makeApiCall<Summary>({
        method: HttpMethod.GET,
        url: ApiEndpoints.DASHBOARD.SUMMARY,
        requiresHeader: true,
      });

      if (!response.data) {
        throw new Error('Failed to fetch summary: No data returned');
      }

      const newSummary: Summary = response.data;

      setSummary([newSummary]);
      await AsyncStorage.setItem(KKey.SUMMARY, JSON.stringify([newSummary]));
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Failed to fetch summary';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, fetchSummary };
};