import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Order } from '../types/Order';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface OrderItemProps {
  order: Order;
  index: number;
  onEdit: (order: Order) => void;
  onDelete: (id: string, name: string) => void;
  onDetail: (order: Order) => void;
  navigation: NativeStackNavigationProp<RootStackParamList, 'OrderScreen'>;
}

const OrderItem: React.FC<OrderItemProps> = ({
  order,
  index,
  onEdit,
  onDelete,
  onDetail,
    navigation,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleMenuPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'View Details', 'Edit', 'Delete'],
          destructiveButtonIndex: 3,
          cancelButtonIndex: 0,
          title: order.name?.trim() || 'Unnamed Order',
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            onEdit(order);
          } else if (buttonIndex === 2) {
            onDelete(order.id, order.name);
          }
        }
      );
    } else {
      setModalVisible(true);
    }
  };

  return (
    <View
      style={[
        styles.itemContainer,
        {
          backgroundColor:
            index % 2 === 0 ? 'rgba(255, 145, 0, 0.1)' : 'rgba(0, 128, 0, 0.1)',
        },
      ]}
    >
      <TouchableOpacity onPress={() => onDetail(order)}>
        <View style={styles.itemContent}>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>{order.name?.trim() || 'Unnamed Order'}</Text>
            <Text style={styles.itemDesc}>Address: {order.address}</Text>
            <Text style={styles.itemDesc}>Phone: {order.phone}</Text>
            <Text style={styles.itemDesc}>Status: {order.status}</Text>
            <Text style={styles.itemDesc}>
              Items: {order.items.map(item => `${item.itemName} (x${item.quantity})`).join(', ')}
            </Text>
            <Text
              style={[
                styles.itemDesc,
                order.customTotalPrice > 0 ? { textDecorationLine: 'line-through', color: 'red' } : {},
              ]}
            >
              Total: ${order.totalAmount.toFixed(2)}
            </Text>
            {order.customTotalPrice > 0 && (
              <Text style={[styles.itemDesc, { color: 'green' }]}>
                Special Total Price: ${order.customTotalPrice.toFixed(2)}
              </Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
              <Ionicons name="ellipsis-vertical" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Android Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                onEdit(order);
              }}
            >
              <Text style={styles.modalOptionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                onDelete(order.id, order.name);
              }}
            >
              <Text style={[styles.modalOptionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: 'stretch',
    minHeight: 70,
  },
  itemContent: {
    position:'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
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
  buttonContainer: {
    right: 0,
    top: 0,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'white',
    borderRadius: 30,
    opacity: 0.4
  },
  menuButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 10,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
  },
  deleteText: {
    color: '#FF3B30',
  },
});

export default OrderItem;