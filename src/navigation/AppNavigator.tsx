import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import LoginScreen from '../screens/auth/LoginScreen';
import MainScreen from '../screens/main/MainScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import DetailScreen from '../screens/home/DetailScreen';
import { Dashboard } from '../models/home/dashboard';
import { useLogin } from '../hooks/useLogin'; // ✅ Correct import

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Welcome: undefined;
  Onboarding: undefined;
  Setting: undefined;
  Detail: {
    title: string;
    data: Dashboard['summary'] | Dashboard['topProducts'] | Dashboard['dailySales'];
    color: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { refreshToken } = useLogin(); // ✅ Use refreshToken from hook

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const tokenExpiration = await AsyncStorage.getItem('tokenExpiration');
      const refreshTokenValue = await AsyncStorage.getItem('refreshToken');

      if (token && tokenExpiration && refreshTokenValue) {
        const expirationDate = new Date(parseInt(tokenExpiration));
        const now = new Date();
        const bufferTime = 10 * 1000;

        if (now.getTime() > expirationDate.getTime() + bufferTime) {
          try {
            const refreshResponse = await refreshToken(); // ✅ Just call it
            if (refreshResponse.data?.accessToken) {
              setIsLoggedIn(true);
            } else {
              await AsyncStorage.multiRemove(['accessToken', 'tokenExpiration', 'refreshToken']);
              setIsLoggedIn(false);
            }
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
            await AsyncStorage.multiRemove(['accessToken', 'tokenExpiration', 'refreshToken']);
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(true);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default AppNavigator;
