import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Platform, Dimensions, Alert, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCategories } from '../../hooks/useCategories';
import { globalStyles } from '../../style/globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors } from '../../utils/colors'

const CategoryScreen = () => {
  const { categories, loading, error, fetchCategories, addCategory, editCategory, deleteCategory } = useCategories();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchCategories(true);
      return () => {};
    }, [fetchCategories])
  );

  const handleAddCategory = () => {
    setEditingCategoryId(null);
    setName('');
    setDescription('');
    setModalVisible(true);
  };

  const handleEditCategory = (category: { id: string; name: string; description?: string }) => {
    setEditingCategoryId(category.id);
    setName(category.name);
    setDescription(category.description || '');
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Category name is required');
      return;
    }
    if (editingCategoryId) {
      editCategory(editingCategoryId, { name: name.trim(), description: description.trim() || '' });
    } else {
      addCategory({ name: name.trim(), description: description.trim() || '' });
    }
    setName('');
    setDescription('');
    setEditingCategoryId(null);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
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
      ],
      { cancelable: true }
    );
  };

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    if (currentScrollY <= 10) {
      setIsAddButtonVisible(true);
    } else {
      setIsAddButtonVisible(currentScrollY < lastScrollY);
    }
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  if (loading) {
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
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View style={[globalStyles.contentContainer, styles.centered]}>
        <Text style={styles.noDataText}>No categories available</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{editingCategoryId ? 'Edit Category' : 'Add New Category'}</Text>
              <TextInput
                style={styles.input}
                placeholder="Category Name"
                value={name}
                onChangeText={setName}
                autoFocus={true}
              />
              <TextInput
                style={styles.input}
                placeholder="Category Description (optional)"
                value={description}
                onChangeText={setDescription}
                multiline
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.addButtonModal]} onPress={handleSubmit}>
                  <Text style={styles.modalButtonText}>{editingCategoryId ? 'Save' : 'Add'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={globalStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.contentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {categories.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.itemContainer,
              {
                backgroundColor: index % 2 !== 0 ? 'rgba(255, 145, 0, 0.1)' : 'rgba(0, 128, 0, 0.1)',
              },
            ]}
          >
            <View style={styles.itemContent}>
              <View style={styles.textContainer}>
                <Text style={styles.itemText}>{item.name?.trim() || 'Unnamed Category'}</Text>
                {item.description ? (
                  <Text style={styles.itemDescription} numberOfLines={1} ellipsizeMode="tail">
                    {item.description}
                  </Text>
                ) : null}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={() => handleEditCategory(item)}
                >
                  <Ionicons name="pencil" size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleDeleteCategory(item.id, item.name)}
                >
                  <Ionicons name="trash" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {isAddButtonVisible && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingCategoryId ? 'Edit Category' : 'Add New Category'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={name}
              onChangeText={setName}
              autoFocus={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Category Description (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.addButtonModal]} onPress={handleSubmit}>
                <Text style={styles.modalButtonText}>{editingCategoryId ? 'Update' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  itemContainer: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: 'stretch',
    minHeight: 70,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  itemDescription: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  editIcon: {
    padding: 8,
  },
  deleteIcon: {
    padding: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'gray',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
  },
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
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
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  addButtonModal: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 6,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 6,
    marginBottom: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});