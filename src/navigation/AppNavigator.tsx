import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
