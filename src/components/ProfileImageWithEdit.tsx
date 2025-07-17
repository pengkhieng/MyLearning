import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { User } from "../types/authTypes";

interface ProfileImageProps {
  user: User | null;
  onImageChange: (imageUri: string) => void;
}

const ProfileImageWithEdit: React.FC<ProfileImageProps> = ({ user, onImageChange }) => {
  const [imageUri, setImageUri] = useState<string | null>(user?.profileImage || null);

  // Sync local imageUri when user prop changes (e.g., after upload)
  useEffect(() => {
    setImageUri(user?.profileImage || null);
  }, [user?.profileImage]);

  const handleEditImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('Error', 'Failed to pick an image: ' + response.errorMessage);
        } else if (response.assets && response.assets[0].uri) {
          const newImageUri = response.assets[0].uri;
          setImageUri(newImageUri);
          onImageChange(newImageUri);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Ionicons name="person-circle-outline" size={80} color="#4CAF50" />
      )}
      <TouchableOpacity style={styles.editButton} onPress={handleEditImage}>
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
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 5,
  },
});

export default ProfileImageWithEdit;
