import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeApiCall } from '../api/apiClient';
import { HttpMethod } from '../enum/HttpMethod';
import { ApiEndpoints } from '../constants/ApiEndpoints';
import { KKey } from '../constants/ApiEndpoints';

export interface UseUploadImage {
  loading: boolean;
  error: string | null;
  uploadImage: (imageUri: string) => Promise<string | null>;
}

export const useUploadImage = (): UseUploadImage => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (imageUri: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem(KKey.ACCESS_TOKEN);
      if (!token) throw new Error('No access token found. Please log in.');

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'upload.jpeg',
      } as any);

      const response = await makeApiCall<{ url: string }>({
        method: HttpMethod.POST,
        url: ApiEndpoints.PROFILE.UPLOAD,
        data: formData,
        requiresHeader: true,
        contentType: 'multipart/form-data',
      });

      const uploadedUrl = response.data?.url;
      if (!uploadedUrl) throw new Error('Image upload failed. No URL returned.');

      return uploadedUrl;  // <-- returns the URL string here
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Image upload failed.';
      setError(errorMessage);
      return null; // return null on failure
    } finally {
      setLoading(false);
    }
  };


  return { loading, error, uploadImage };
};
