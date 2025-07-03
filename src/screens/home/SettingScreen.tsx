import React, { useRef } from "react";
import { SafeAreaView, StatusBar, View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { globalStyles } from "../../style/globalStyles";
import { RootStackParamList } from "../../navigation/AppNavigator";
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';


import { colors } from '../../utils/colors'

type SettingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setting'>;

const SettingScreen = () => {
  const buttonScale = useRef(new Animated.Value(1)).current;

  const navigation = useNavigation<SettingScreenNavigationProp>();

  const handleLogout = () => {
    navigation.replace('Welcome');
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={[globalStyles.paddingStatusBar, globalStyles.bodyContain]}>
        <View style={styles.profile}>
          <Ionicons name="person-circle-outline" size={150} color={colors.orangeWithOpacity} />

        </View>
        <View style={styles.contain_text}>
          <Text style={styles.title}>Welcome to My App 👋</Text>
          <Text style={styles.subtitle}>This is the Setting Screen</Text>
        </View>
        <View style={styles.space} />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          style={globalStyles.buttonContainer}
        >
          <Animated.View style={[globalStyles.button, { transform: [{ scale: buttonScale }] }]}>
            <LinearGradient
              colors={[colors.buttonRed.start, colors.button.end]}
              style={globalStyles.buttonGradient}
            >
              <Text style={globalStyles.buttonText}>Log Out</Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profile: {
    flex: 1,
    paddingTop: 20,

  },
  contain_text: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,

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
  space: {
    flex: 1
  },
});

export default SettingScreen;