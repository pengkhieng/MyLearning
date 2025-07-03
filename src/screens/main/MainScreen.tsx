import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../home/HomeScreen';
import CategoryScreen from '../home/CategoryScreen';
import OrderScreen from '../home/OrderScreen';
import ProductScreen from '../home/ProductScreen';
import SettingScreen from '../home/SettingScreen';

const Tab = createBottomTabNavigator();

const MainScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconMap: {
            Home: string;
            Category: string;
            Product: string;
            Order: string;
            Setting: string;
          } = {
            Home: 'home-outline',
            Category: 'list-outline',
            Product: 'pricetag-outline',
            Order: 'cart-outline',
            Setting: 'settings-outline',
          };

          const iconName = iconMap[route.name as keyof typeof iconMap] || 'help-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FB5012',
        tabBarInactiveTintColor:   '#A0A0A0', 
        headerShown: false,
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: 'rgba(249, 116, 22, 0.3)',
          position: 'absolute',
          overflow: 'hidden',
          shadowColor: 'gray',
          shadowOffset: { width: 0, height: -3},
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 10,
          paddingTop: 10,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Category" component={CategoryScreen} />
      <Tab.Screen name="Product" component={ProductScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default MainScreen;