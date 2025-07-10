import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Dashboard } from '../../models/home/dashboard';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../style/globalStyles'

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const dashboardData: Dashboard = {
    summary: {
      totalSales: 12500,
      totalOrders: 340,
      totalCustomers: 285,
      averageOrderValue: 36.76,
    },
    topProducts: [
      { id: '1', name: 'Coca-Cola', quantitySold: 120, revenue: 180 },
      { id: '2', name: 'French Fries', quantitySold: 95, revenue: 285 },
    ],
    dailySales: [
      { date: '2025-07-01', total: 2500 },
      { date: '2025-07-02', total: 4100 },
      { date: '2025-07-03', total: 3900 },
    ],
  };

  const data = [
    { title: 'Summary', key: 'summary', value: dashboardData.summary, colors: colors.customBlue },
    { title: 'Top Products', key: 'topProducts', value: dashboardData.topProducts, colors: colors.customGreen },
    { title: 'Daily Sales', key: 'dailySales', value: dashboardData.dailySales, colors: colors.customDarkBlue },
  ];

  return (
    <View>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={globalStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.contentContainer}>
        <View style={styles.cardGrid}>
          {data.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.card, { backgroundColor: item.colors }]}
              onPress={() =>
                navigation.navigate('Detail', {
                  title: item.title,
                  data: item.value,
                  color: item.colors,
                })
              }
            >
              <Text style={styles.cardText}>{item.title}</Text>
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
