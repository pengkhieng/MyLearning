import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/auth/LoginScreen';
import MainScreen from '../screens/main/MainScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import DetailScreen from '../screens/home/DetailScreen';
import { Dashboard } from '../models/home/dashboard';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Welcome: undefined;
  Onboarding: undefined;
  Setting: undefined;
  Detail: {
    title: string;
    data: Dashboard['summary'] | Dashboard['topProducts'] | Dashboard['dailySales'];
    color: String;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const tokenExpiration = await AsyncStorage.getItem('tokenExpiration');

      if (token && tokenExpiration) {
        const expirationDate = new Date(parseInt(tokenExpiration));
        // Check if token is still valid
        if (expirationDate > new Date()) {
          // Optional: Verify token with server
          const isValid = await verifyToken(token);
          setIsLoggedIn(isValid);
        } else {
          // Clear expired token
          await AsyncStorage.multiRemove(['accessToken', 'tokenExpiration', 'refreshToken']);
          setIsLoggedIn(false);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async (token) => {
    try {
      const response = await fetch('https://khieng.online/api/protected', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  if (isLoading) {
    return null; // Or show a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Main' : 'Welcome'}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;