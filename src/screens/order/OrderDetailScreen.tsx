import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Platform,
  Alert,
  FlatList,
} from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { formatToCambodiaTime12h } from '../../utils/helpers';
import { Order } from '../../types/Order';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomerCard from '../../components/CustomerCard';
import ItemCard from '../../components/ItemCard';

type OrderDetailScreenRouteProp = RouteProp<RootStackParamList, 'OrderDetailScreen'>;

interface OrderDetailScreenProps {
  route: OrderDetailScreenRouteProp;
}

const OrderDetailScreen: React.FC<OrderDetailScreenProps> = ({ route }) => {
  const { data: order } = route.params; // Lowercase 'order' for consistency
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Calculate subtotal from items
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const handleReceipt = (order: Order) => {
    if (!order || !order.id) {
      Alert.alert('Error', 'Invalid order data');
      return;
    }
    navigation.navigate('ReceiptScreen', { data: order });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Order Detail</Text>
        <TouchableOpacity onPress={() => handleReceipt(order)}>
          <Text style={styles.buttonPrint}>Receipt</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        {/* Customer Info Header */}
        <CustomerCard order={order} formatToCambodiaTime12h={formatToCambodiaTime12h} />

        {/* Item Details */}
        <Text style={styles.itemDetailsHeader}>Item Details [{order.items.length}]</Text>
        <FlatList
          data={order.items}
          renderItem={({ item }) => <ItemCard item={item} />}
          keyExtractor={(item) => item.itemId}
          scrollEnabled={false}
        />

        <View style={styles.subtotalContainer}>
          {/* Left Side: Labels */}
          <View>
            <Text style={styles.subtotalLabel}>Total:</Text>
            {order.customTotalPrice > 0 && (
              <Text style={[styles.subtotalLabel, { marginTop: 10 }]}>Special Total Price:</Text>
            )}
          </View>

          {/* Right Side: Values */}
          <View style={{ alignItems: 'flex-end' }}>
            <Text
              style={[
                styles.subtotalValue,
                order.customTotalPrice > 0 && { textDecorationLine: 'line-through', color: 'red' },
              ]}
            >
              ${order.totalAmount.toFixed(2)}
            </Text>
            {order.customTotalPrice > 0 && (
              <Text style={[styles.subtotalValue, { color: 'green', marginTop: 10 }]}>
                ${order.customTotalPrice.toFixed(2)}
              </Text>
            )}
          </View>
        </View>


      </ScrollView>
    </View>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  buttonPrint: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  itemDetailsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginVertical: 12,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  subtotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  subtotalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
});