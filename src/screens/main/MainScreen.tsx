import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
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
        tabBarIcon: ({ color, size, focused }) => {
          const iconMap: Record<string, string> = {
            Home: 'home-outline',
            Category: 'list-outline',
            Product: 'pricetag-outline',
            Order: 'cart-outline',
            Setting: 'settings-outline',
          };

          const iconName = iconMap[route.name] || 'help-circle-outline';

          // Animatable icon
          const AnimatedIcon = Animatable.createAnimatableComponent(Ionicons);
          const animation = focused ? 'bounceIn' : undefined;

          return (
            <AnimatedIcon
              name={iconName}
              color={color}
              size={size}
              animation={animation}
              duration={500}
              useNativeDriver
            />
          );
        },
        tabBarActiveTintColor: '#FB5012',
        tabBarInactiveTintColor: 'black',
        headerShown: false,
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: 'rgba(249, 116, 22, 0.3)',
          position: 'absolute',
          overflow: 'hidden',
          shadowColor: 'gray',
          shadowOffset: { width: 0, height: -3 },
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
