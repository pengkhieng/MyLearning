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
} from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { formatToCambodiaTime12h } from '../../utils/helpers';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ReceiptScreenRouteProp = RouteProp<RootStackParamList, 'ReceiptScreen'>;

interface ReceiptScreenProps {
  route: ReceiptScreenRouteProp;
}

const ReceiptScreen: React.FC<ReceiptScreenProps> = ({ route }) => {
  const { data: order } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Calculate subtotal from items
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const handlePrint = () => {
    Alert.alert('Print Receipt', 'This feature is not implemented yet.');
    // Future implementation: Add logic to print or share the receipt
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Receipt</Text>
        <TouchableOpacity onPress={handlePrint}>
          <Text style={styles.buttonPrint}>Print</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerScroller}
      >
        {/* Receipt Container */}
        <View style={styles.receiptContainer}>
          {/* Store Info */}
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>FullFunc</Text>
            <Text style={styles.storeDetail}>123 Business St, City, Country</Text>
            <Text style={styles.storeDetail}>Phone: (555) 123-4567</Text>
            <Text style={styles.storeDetail}>
              Date: {formatToCambodiaTime12h(order.createdAt)}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <Text numberOfLines={1} style={styles.dividerText}>---------------------------------------</Text>
          </View>

          {/* Customer Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <Text style={styles.infoText}>Name: {order.name}</Text>
            <Text style={styles.infoText}>Address: {order.address}</Text>
            <Text style={styles.infoText}>Phone: {order.phone}</Text>
            <Text style={styles.infoText}>Status: {order.status}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <Text numberOfLines={1} style={styles.dividerText}>---------------------------------------</Text>
          </View>

          {/* Items List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items</Text>
            <View style={styles.itemHeader}>
              <Text style={[styles.itemHeaderText, { flex: 0.5 }]}>No.</Text>
              <Text style={[styles.itemHeaderText, { flex: 2, textAlign: 'center' }]}>Item</Text>
              <Text style={[styles.itemHeaderText, { flex: 1 }]}>Qty</Text>
              <Text style={[styles.itemHeaderText, { flex: 1, textAlign: 'center' }]}>Price</Text>
              <Text style={[styles.itemHeaderText, { flex: 1, textAlign: 'right' }]}>Total</Text>
            </View>
            {order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={[styles.itemText, { flex: 0.1 }]}>{index + 1}</Text>
                <Text style={[styles.itemText, { flex: 2, textAlign: 'center' }]}>{item.itemName}</Text>
                <Text style={[styles.itemText, { flex: 1, textAlign: 'center' }]}>{item.quantity}</Text>
                <Text style={[styles.itemText, { flex: 1, textAlign: 'center' }]}>
                  ${item.unitPrice.toFixed(2)}
                </Text>
                <Text style={[styles.itemText, { flex: 1, textAlign: 'right' }]}>
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <Text numberOfLines={1} style={styles.dividerText}>---------------------------------------</Text>
          </View>

          {/* Totals Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            {order.customTotalPrice > 0 && (
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: '#FF3B30' }]}>Original Total:</Text>
                <Text style={[styles.totalValue, { color: '#FF3B30', textDecorationLine: 'line-through' }]}>
                  ${order.totalAmount.toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, styles.finalTotalLabel]}>Total:</Text>
              <Text style={[styles.totalValue, styles.finalTotalValue]}>
                ${(order.customTotalPrice > 0 ? order.customTotalPrice : order.totalAmount).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReceiptScreen;

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 0,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  buttonPrint: {
    fontSize: 16,
    color: 'green',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  contentContainerScroller: {
    marginTop: 20,
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  receiptContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 100
  },
  storeInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  storeName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  storeDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  divider: {
    marginVertical: 12,
    alignItems: 'center',
  },
  dividerText: {
    fontSize: 14,
    color: '#999',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: '#333',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  finalTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: 'green',
  },
});