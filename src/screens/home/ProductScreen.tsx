import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Platform, Dimensions, Alert, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useProducts, Product } from '../../hooks/useProduct';
import { useCategories } from '../../hooks/useCategories';
import { Category } from '../../types/categoryType';
import { globalStyles } from '../../style/globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

import { colors } from '../../utils/colors'

const ProductScreen = () => {
  const { products, loading, error, fetchProducts, addProduct, editProduct, deleteProduct } = useProducts();
  const { categories, fetchCategories } = useCategories();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stock, setStock] = useState('');
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts(true);
      fetchCategories(true); // Fetch categories to populate dropdown
      return () => {};
    }, [fetchProducts, fetchCategories])
  );

  const handleAddProduct = () => {
    setEditingProductId(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId(categories.length > 0 ? categories[0].id : ''); // Default to first category
    setStock('');
    setModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.itemId);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setCategoryId(product.categoryId);
    setStock(product.stock.toString());
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (!name.trim() || !price.trim() || !categoryId.trim() || !stock.trim()) {
      Alert.alert('Error', 'Name, price, category, and stock are required');
      return;
    }
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);
    if (isNaN(priceNum) || isNaN(stockNum)) {
      Alert.alert('Error', 'Price and stock must be valid numbers');
      return;
    }
    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      categoryId: categoryId.trim(),
      stock: stockNum,
    };
    if (editingProductId) {
      editProduct(editingProductId, productData);
    } else {
      addProduct(productData);
    }
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId('');
    setStock('');
    setEditingProductId(null);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId('');
    setStock('');
    setEditingProductId(null);
    setModalVisible(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete the product "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProduct(id),
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

  if (products.length === 0) {
    return (
      <View style={[globalStyles.contentContainer, styles.centered]}>
        <Text style={styles.noDataText}>No products available</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
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
              <Text style={styles.modalTitle}>{editingProductId ? 'Edit Product' : 'Add New Product'}</Text>
              <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={name}
                onChangeText={setName}
                autoFocus={true}
              />
              <TextInput
                style={styles.input}
                placeholder="Product Description"
                value={description}
                onChangeText={setDescription}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={categoryId}
                  onValueChange={(value) => setCategoryId(value)}
                  style={styles.picker}
                >
                  {categories.length > 0 ? (
                    categories.map((category: Category) => (
                      <Picker.Item key={category.id} label={category.name} value={category.id} />
                    ))
                  ) : (
                    <Picker.Item label="No categories available" value="" />
                  )}
                </Picker>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Stock"
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.addButtonModal]} onPress={handleSubmit}>
                  <Text style={styles.modalButtonText}>{editingProductId ? 'Save' : 'Add'}</Text>
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
        {products.map((item, index) => (
          <View
            key={item.itemId}
            style={[
              styles.itemContainer,
              index % 2 === 0 ? styles.itemContainerEven : styles.itemContainerOdd,
            ]}
          >
            <View style={styles.itemContent}>
              <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemDesc} numberOfLines={1} ellipsizeMode="tail">
                  {item.description}
                </Text>
                <Text style={styles.itemDesc}>Price: ${item.price}</Text>
                <Text style={styles.itemDesc}>Stock: {item.stock}</Text>
                <Text style={styles.itemDesc}>
                  Category: {categories.find((cat) => cat.id === item.categoryId)?.name || item.categoryId}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={() => handleEditProduct(item)}
                >
                  <Ionicons name="pencil" size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleDeleteProduct(item.itemId, item.name)}
                >
                  <Ionicons name="trash" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {isAddButtonVisible && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
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
            <Text style={styles.modalTitle}>{editingProductId ? 'Edit Product' : 'Add New Product'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={name}
              onChangeText={setName}
              autoFocus={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Product Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={categoryId}
                onValueChange={(value) => setCategoryId(value)}
                style={styles.picker}
              >
                {categories.length > 0 ? (
                  categories.map((category: Category) => (
                    <Picker.Item key={category.id} label={category.name} value={category.id} />
                  ))
                ) : (
                  <Picker.Item label="No categories available" value="" />
                )}
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Stock"
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.addButtonModal]} onPress={handleSubmit}>
                <Text style={styles.modalButtonText}>{editingProductId ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductScreen;

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
  itemContainerEven: {
    backgroundColor: 'rgba(255, 145, 0, 0.1)', // Light orange
  },
  itemContainerOdd: {
    backgroundColor: 'rgba(0, 128, 0, 0.1)', // Light green
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
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  itemDesc: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
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
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 150 : 50,
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
  editIcon: {
    padding: 8,
  },
  // delete below to avoid the cutoff:

  deleteIcon: {
    padding: 8,
  },
});