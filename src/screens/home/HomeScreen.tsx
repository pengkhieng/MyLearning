import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';


import { globalStyles } from '../../style/globalStyles';

const HomeScreen = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[globalStyles.paddingStatusBar, globalStyles.bodyContain]}>
        <Text style={styles.title}>Welcome to My App 👋</Text>
        <Text style={styles.subtitle}>This is the Home Screen</Text>
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
});
