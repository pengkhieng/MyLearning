import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import { globalStyles } from '../../style/globalStyles';
import { Dashboard } from '../../models/home/dashboard';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils/colors';

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
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
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
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[globalStyles.paddingStatusBar, globalStyles.bodyContain]}>
        <FlatList
          data={data}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ marginTop: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
  },
  card: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    width: '48%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  },
});
