import React from "react";
import { SafeAreaView, StatusBar, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { globalStyles } from "../../style/globalStyles";
import { RootStackParamList } from "../../navigation/AppNavigator";

type SettingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setting'>;

const SettingScreen = () => {
  const navigation = useNavigation<SettingScreenNavigationProp>();

  const handleLogout = () => {
    navigation.replace('Welcome');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={[globalStyles.paddingStatusBar, styles.container]}>
        <Text style={styles.title}>Welcome to My App 👋</Text>
        <Text style={styles.subtitle}>This is the Setting Screen</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  logoutButton: {
    padding: 15,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default SettingScreen;