import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  Dimensions,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import PropTypes from 'prop-types';
import { useCategories } from '../../hooks/useCategories';
import { useUploadImage } from '../../hooks/useUploadImage';
import { globalStyles } from '../../style/globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CategoryItem from '../../components/CategoryItem';
import { colors } from '../../utils/colors';

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface CategoryModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
  editingCategoryId: string | null;
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  imageUri: string | null;
  onSelectImage: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  editingCategoryId,
  name,
  setName,
  description,
  setDescription,
  imageUri,
  onSelectImage,
}) => (
  <Modal
    animationType="fade"
    transparent
    visible={visible}
    onRequestClose={onCancel}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>
          {editingCategoryId ? 'Edit Category' : 'Add New Category'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Category Name"
          value={name}
          onChangeText={setName}
          autoFocus
        />
        <TextInput
          style={styles.input}
          placeholder="Category Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity
          style={[styles.modalButton, styles.imageButton]}
          onPress={onSelectImage}
        >
          <Text style={styles.modalButtonText}>
            {imageUri ? 'Change Image' : 'Choose Image (Optional)'}
          </Text>
        </TouchableOpacity>
        {imageUri && <Text style={styles.imageSelectedText}>Image selected</Text>}

        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.addButtonModal]}
            onPress={onSubmit}
          >
            <Text style={styles.modalButtonText}>
              {editingCategoryId ? 'Update' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

CategoryModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editingCategoryId: PropTypes.string,
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  setDescription: PropTypes.func.isRequired,
  imageUri: PropTypes.string,
  onSelectImage: PropTypes.func.isRequired,
};

const CategoryScreen: React.FC = () => {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    editCategory,
    deleteCategory,
  } = useCategories();

  const { uploadImage, loading: uploadLoading, error: uploadError } = useUploadImage();

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchCategories(true);
    }, [fetchCategories])
  );

  const handleAddCategory = () => {
    setEditingCategoryId(null);
    setName('');
    setDescription('');
    setImageUri(null);
    setModalVisible(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setName(category.name);
    setDescription(category.description || '');
    setImageUri(category.imageUrl || null);
    setModalVisible(true);
  };

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', `Image picker error: ${response.errorMessage}`);
      } else if (response.assets?.[0]?.uri) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Category name is required');
      return;
    }

    try {
      let imageUrl: string | undefined;
      if (imageUri) {
        const uploadedUrl = await uploadImage(imageUri);
        if (!uploadedUrl) {
          Alert.alert('Error', uploadError || 'Failed to upload image');
          return;
        }
        imageUrl = uploadedUrl;
      }

      const categoryData = {
        name: name.trim(),
        description: description.trim(),
      };

      if (editingCategoryId) {
        await editCategory(editingCategoryId, categoryData, imageUrl);
      } else {
        await addCategory(categoryData, imageUrl);
      }

      handleCancel();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save category');
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setImageUri(null);
    setEditingCategoryId(null);
    setModalVisible(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete the category "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCategory(id),
        },
      ]
    );
  };

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      setIsAddButtonVisible(currentScrollY <= 10 || currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    },
    [lastScrollY]
  );

  const renderContent = () => {
    if (loading || uploadLoading) {
      return (
        <View style={[globalStyles.contentContainer, styles.centered]}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[globalStyles.contentContainer, styles.centered]}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={() => fetchCategories(true)}
          >
            <Text style={styles.tryAgainText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <ScrollView
          style={globalStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={globalStyles.contentContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {categories.length === 0 ? (
            <Text style={styles.noDataText}>No categories available</Text>
          ) : (
            categories.map((item, index) => (
              <CategoryItem
                key={item.id}
                item={item}
                index={index}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            ))
          )}
        </ScrollView>
        {isAddButtonVisible && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      <CategoryModal
        visible={modalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        editingCategoryId={editingCategoryId}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        imageUri={imageUri}
        onSelectImage={handleSelectImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: 'gray' },
  errorText: { fontSize: 16, color: 'red' },
  noDataText: { fontSize: 16, color: 'gray' },
  tryAgainButton: {
    alignItems: 'center',
    marginTop: 60,
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tryAgainText: { color: 'white', fontWeight: 'bold' },
  addButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    backgroundColor: colors.orangeWithOpacity,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: { backgroundColor: '#FF3B30' },
  addButtonModal: { backgroundColor: '#007AFF' },
  imageButton: {
    backgroundColor: colors.orangeWithOpacity,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: '100%',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    flexShrink: 1,
  },
  imageSelectedText: {
    fontSize: 14,
    color: 'green',
    marginBottom: 10,
  },
});

export default CategoryScreen;
