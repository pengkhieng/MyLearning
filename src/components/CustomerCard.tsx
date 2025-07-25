import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomerCard = ({ order, formatToCambodiaTime12h }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.customerInfo}>
          <Image
            style={styles.profile}
            source={{ uri: order.profileImage || 'https://i.sstatic.net/l60Hf.png' }}
          />
          <View style={styles.textContainer}>
            <View style={styles.rowName}>
              <Text style={styles.customerName}>{order.name}</Text>
              <Text style={styles.customerStatus}>{order.status || 'PENDING'}</Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Ionicons name="call" size={18} color="#fff" />
              <Text style={styles.callButtonText}>{order.phone}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.duration}>{formatToCambodiaTime12h(order.createdAt)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profile: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textContainer: {
    flex: 1,
  },
  rowName: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  customerStatus: {
    fontSize: 14,
    color: '#888',
    fontWeight: '400',
  },
  callButton: {
    backgroundColor: '#FF9500',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  callButtonText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
  },
  duration: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textAlign: 'right',
  },
});

export default CustomerCard;