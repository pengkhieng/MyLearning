import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { User } from "../types/authTypes";
import { colors, Colors } from '../utils/colors';

interface ProfileImageProps {
  user: User | null;
  onImageChange: (imageUri: string) => void;
}

const ProfileImageWithEdit: React.FC<ProfileImageProps> = ({ user, onImageChange }) => {
  const [imageUri, setImageUri] = useState<string | null>(user?.profileImage || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setImageUri(user?.profileImage || null);
  }, [user?.profileImage]);

  const handleEditImage = async () => {
    try {
      launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 1,
          includeBase64: false,
        },
        async (response) => {
          setIsLoading(true);
          try {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.errorCode) {
              Alert.alert('Error', `Failed to pick an image: ${response.errorMessage}`);
            } else if (response.assets && response.assets[0].uri) {
              const newImageUri = response.assets[0].uri;
              setImageUri(newImageUri);
              await onImageChange(newImageUri);
            }
          } catch (error) {
            Alert.alert('Error', `An unexpected error occurred: ${error.message}`);
          } finally {
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      Alert.alert('Error', `Failed to open image picker: ${error.message}`);
      setIsLoading(false); // Ensure loading is reset
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : imageUri ? (
        <View>
          <View style={styles.shadowView} />
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      ) : (
        <Ionicons name="person-circle-outline" size={80} color="#4CAF50" />
      )}
      <TouchableOpacity
        style={[styles.editButton, isLoading && styles.disabledButton]}
        onPress={handleEditImage}
        disabled={isLoading}
      >
        <Ionicons name="pencil" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  shadowView: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.orangeWithOpacity,
    opacity: 0.6,
    transform: [{ translateX: 2 }, { translateY: 4 }],
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    elevation: 5,
  },
  loadingContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.29)',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.orangeWithOpacity,
    borderRadius: 15,
    padding: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ProfileImageWithEdit;