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
import { useLogin } from '../hooks/useLogin';
import SignUp from '../screens/auth/SignUp';
import { KKey } from '../constants/ApiEndpoints';
import ForgotPassword from '../screens/auth/ForgotPassword';
import VerifyCode from '../screens/auth/VerifyCode';
import UserModel from '../types/UserModel';
import ResetPassword from '../screens/auth/ResetPassword';
import { Order } from '../types/Order';
import OrderDetailScreen from '../screens/home/OrderDetailScreen';
import OrderScreen from '../screens/home/OrderScreen';

export type RootStackParamList = {
  Login: { user?: UserModel };
  Main: undefined;
  Welcome: undefined;
  Onboarding: undefined;
  Setting: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  VerifyCode: { user?: UserModel };
  ResetPassword: { email: string };
  Detail: {
    title: string;
    data: Dashboard['summary'] | Dashboard['topProducts'] | Dashboard['dailySales'];
    color: string;
  };
  OrderScreen: undefined;
  OrderDetailScreen: {data: Order};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { refreshAccessToken } = useLogin();
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem(KKey.ACCESS_TOKEN);
      const tokenExpiration = await AsyncStorage.getItem(KKey.TOKEN_EXPRIATION);
      const refreshTokenValue = await AsyncStorage.getItem(KKey.REFRESH_TOKEN);

      if (token && tokenExpiration && refreshTokenValue) {
        const expirationDate = new Date(parseInt(tokenExpiration));
        const now = new Date();
        const bufferTime = 10 * 1000;

        if (now.getTime() > expirationDate.getTime() + bufferTime) {
          try {
            const refreshResponse = await refreshAccessToken();
            if (refreshResponse.data?.accessToken) {
              setIsLoggedIn(true);
            } else {
              await AsyncStorage.clear();
              setIsLoggedIn(false);
            }
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
            await AsyncStorage.clear();
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
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerifyCode" component={VerifyCode} options={{ headerShown: false }} />  
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />   
        <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} options={{ headerShown: false }} />        
        <Stack.Screen name="OrderScreen" component={OrderScreen} options={{ headerShown: false }} />        
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
