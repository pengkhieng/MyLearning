import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Platform, Dimensions, Alert, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useOrders } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProduct';
import { globalStyles } from '../../style/globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../utils/colors'
import { Order } from '../../types/Order';
import { Product } from '../../types/Product';

const OrderScreen = () => {
  const { orders, loading, error, fetchOrders, addOrder, editOrder, deleteOrder } = useOrders();
  const { products, fetchProducts } = useProducts();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [customTotalPrice, setCustomTotalPrice] = useState('');
  const [items, setItems] = useState<{ itemId: string; quantity: number }[]>([{ itemId: '', quantity: 1 }]);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders(true);
      fetchProducts(true); // Fetch products for item dropdown
      return () => {};
    }, [fetchOrders, fetchProducts])
  );

  const handleAddOrder = () => {
    setEditingOrderId(null);
    setName('');
    setAddress('');
    setPhone('');
    setCustomTotalPrice('0');
    setItems([{ itemId: products.length > 0 ? products[0].itemId : '', quantity: 1 }]);
    setModalVisible(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrderId(order.id);
    setName(order.name);
    setAddress(order.address);
    setPhone(order.phone);
    setCustomTotalPrice(order.customTotalPrice.toString());
    setItems(order.items.map(item => ({ itemId: item.itemId, quantity: item.quantity })));
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (!name.trim() || !address.trim() || !phone.trim() || items.some(item => !item.itemId || item.quantity <= 0)) {
      Alert.alert('Error', 'Customer name, address, phone, and at least one valid item with quantity are required');
      return;
    }
    const customTotalPriceNum = parseFloat(customTotalPrice) || 0;
    const orderData = {
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
      customTotalPrice: customTotalPriceNum,
      items: items.filter(item => item.itemId && item.quantity > 0),
    };
    if (editingOrderId) {
      editOrder(editingOrderId, orderData);
    } else {
      addOrder(orderData);
    }
    setName('');
    setAddress('');
    setPhone('');
    setCustomTotalPrice('');
    setItems([{ itemId: '', quantity: 1 }]);
    setEditingOrderId(null);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setName('');
    setAddress('');
    setPhone('');
    setCustomTotalPrice('');
    setItems([{ itemId: '', quantity: 1 }]);
    setEditingOrderId(null);
    setModalVisible(false);
  };

  const handleDeleteOrder = (id: string, name: string) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete the order for "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteOrder(id),
        },
      ],
      { cancelable: true }
    );
  };

  const handleAddItem = () => {
    setItems([...items, { itemId: products.length > 0 ? products[0].itemId : '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: 'itemId' | 'quantity', value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
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

  if (orders.length === 0) {
    return (
      <View style={[globalStyles.contentContainer, styles.centered]}>
        <Text style={styles.noDataText}>No orders available</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddOrder}>
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
              <Text style={styles.modalTitle}>{editingOrderId ? 'Edit Order' : 'Add New Order'}</Text>
              <TextInput
                style={styles.input}
                placeholder="Customer Name"
                value={name}
                onChangeText={setName}
                autoFocus={true}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Custom Total Price"
                value={customTotalPrice}
                onChangeText={setCustomTotalPrice}
                keyboardType="numeric"
              />
              <Text style={styles.itemSectionTitle}>Items</Text>
              {items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={item.itemId}
                      onValueChange={(value) => handleItemChange(index, 'itemId', value)}
                      style={styles.picker}
                    >
                      {products.length > 0 ? (
                        products.map((product: Product) => (
                          <Picker.Item key={product.itemId} label={product.name} value={product.itemId} />
                        ))
                      ) : (
                        <Picker.Item label="No products available" value="" />
                      )}
                    </Picker>
                  </View>
                  <TextInput
                    style={[styles.input, styles.quantityInput]}
                    placeholder="Quantity"
                    value={item.quantity.toString()}
                    onChangeText={(value) => handleItemChange(index, 'quantity', parseInt(value) || 1)}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.removeItemButton}
                    onPress={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                  >
                    <Ionicons name="trash" size={20} color={items.length === 1 ? '#ccc' : '#FF3B30'} />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addItemButton} onPress={handleAddItem}>
                <Text style={styles.addItemButtonText}>Add Item</Text>
              </TouchableOpacity>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.addButtonModal]} onPress={handleSubmit}>
                  <Text style={styles.modalButtonText}>{editingOrderId ? 'Update' : 'Add'}</Text>
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
        {orders.map((order, index) => (
          <View
            key={order.id}
            style={[
              styles.itemContainer,
              index % 2 === 0 ? styles.itemContainerEven : styles.itemContainerOdd,
            ]}
          >
            <View style={styles.itemContent}>
              <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>
                  {order.name}
                </Text>
                <Text style={styles.itemDesc}>Address: {order.address}</Text>
                <Text style={styles.itemDesc}>Phone: {order.phone}</Text>
                <Text style={styles.itemDesc}>Status: {order.status}</Text>
                <Text style={styles.itemDesc}>Items: {order.items.map(item => `${item.itemName} (x${item.quantity})`).join(', ')}</Text>
                <Text style={[
                  styles.itemDesc,
                  order.customTotalPrice > 0 ? { textDecorationLine: 'line-through', color: 'red' } : {}
                ]}>
                  Total: ${order.totalAmount.toFixed(2)}
                </Text>
                {order.customTotalPrice > 0 && (
                  <Text style={[styles.itemDesc, { color: 'green' }]}>
                    Special Total Price: ${order.customTotalPrice.toFixed(2)}
                  </Text>
                )}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={() => handleEditOrder(order)}
                >
                  <Ionicons name="pencil" size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleDeleteOrder(order.id, order.name)}
                >
                  <Ionicons name="trash" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {isAddButtonVisible && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddOrder}>
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
            <Text style={styles.modalTitle}>{editingOrderId ? 'Edit Order' : 'Add New Order'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Customer Name"
              value={name}
              onChangeText={setName}
              autoFocus={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Custom Total Price"
              value={customTotalPrice}
              onChangeText={setCustomTotalPrice}
              keyboardType="numeric"
            />
            <Text style={styles.itemSectionTitle}>Items</Text>
            {items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={item.itemId}
                    onValueChange={(value) => handleItemChange(index, 'itemId', value)}
                    style={styles.picker}
                  >
                    {products.length > 0 ? (
                      products.map((product: Product) => (
                        <Picker.Item key={product.itemId} label={product.name} value={product.itemId} />
                      ))
                    ) : (
                      <Picker.Item label="No products available" value="" />
                    )}
                  </Picker>
                </View>
                <TextInput
                  style={[styles.input, styles.quantityInput]}
                  placeholder="Quantity"
                  value={item.quantity.toString()}
                  onChangeText={(value) => handleItemChange(index, 'quantity', parseInt(value) || 1)}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.removeItemButton}
                  onPress={() => handleRemoveItem(index)}
                  disabled={items.length === 1}
                >
                  <Ionicons name="trash" size={20} color={items.length === 1 ? '#ccc' : '#FF3B30'} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addItemButton} onPress={handleAddItem}>
              <Text style={styles.addItemButtonText}>Add Item</Text>
            </TouchableOpacity>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.addButtonModal]} onPress={handleSubmit}>
                <Text style={styles.modalButtonText}>{editingOrderId ? 'Update' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrderScreen;

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
    width: '60%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 150 : 50,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  quantityInput: {
    width: '25%',
    marginLeft: 10,
  },
  removeItemButton: {
    marginLeft: 10,
    padding: 5,
  },
  itemSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  addItemButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  addItemButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  deleteIcon: {
    padding: 8,
  },
});