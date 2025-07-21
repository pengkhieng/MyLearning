import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../style/globalStyles';
import { useSummary } from '../../hooks/useSummary';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { summary, loading, error, fetchSummary } = useSummary();

  useFocusEffect(
    useCallback(() => {
      fetchSummary(true);
      return () => {};
    }, [fetchSummary])
  );

  const summaryItems = [
    { label: 'Total Categories', value: summary[0]?.totalCategories || 0 , colors: colors.dashboard[0]},
    { label: 'Total Items', value: summary[0]?.totalItems || 0 , colors: colors.dashboard[1]},
    { label: 'Total Stock', value: summary[0]?.totalStock || 0 , colors: colors.dashboard[2]},
    {
      label: 'Inventory Value $',
      value: (summary[0]?.totalInventoryValue != null
        ? Number(summary[0].totalInventoryValue).toFixed(2)
        : '0.00'), colors: colors.dashboard[3]},  
    { label: 'Low Stock Items', value: summary[0]?.lowStockItems || 0 , colors: colors.dashboard[4]},
    { label: 'Inactive Items', value: summary[0]?.inactiveItems || 0 , colors: colors.dashboard[5]},
  ];

  return (
    <View>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={globalStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.contentContainer}
      >
        {loading && <Text>Loading...</Text>}
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
        <View style={styles.cardGrid}>
          {summaryItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: item.colors }]}
            >
              <Text style={styles.cardText}>{item.label}</Text>
              <Text style={styles.cardText}>{item.value}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 40,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});