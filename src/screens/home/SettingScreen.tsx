import React, { useRef } from "react";
import { SafeAreaView, StatusBar, View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { globalStyles } from "../../style/globalStyles";
import { RootStackParamList } from "../../navigation/AppNavigator";
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../utils/colors'

type SettingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setting'>;

const SettingScreen = () => {

  const buttonScale = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<SettingScreenNavigationProp>();
  const handleLogout = () => {
    navigation.replace('Welcome');
  };

  const settingsOptions = [
    { icon: 'bag', label: 'Brands', screen: 'Brands' },
    { icon: 'map', label: 'Zone', screen: 'Zone' },
    { icon: 'ticket', label: 'Promo Code', screen: 'PromoCode' },
    { icon: 'notifications', label: 'Notifications', screen: 'Notifications' },
    { icon: 'help', label: 'Help', screen: 'Help' },
    { icon: 'information', label: 'About', screen: 'About' },
  ];

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={[globalStyles.bodyContain,globalStyles.paddingTop]}>
        <View style={styles.profile}>
          <Ionicons name="person-circle-outline" size={80} color="#4CAF50" />
          <Text style={styles.profileName}>Khieng11</Text>
          <Text style={styles.profileEmail}>Khieng11@gmail.com</Text>
        </View>
        {settingsOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
          // onPress={() => navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={24} color="#000" />
            <Text style={styles.optionText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={24} color="#007AFF" />
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          style={[globalStyles.buttonContainer, { paddingTop: 20, paddingHorizontal: 20 }]}
        >
          <Animated.View style={[globalStyles.button, { transform: [{ scale: buttonScale }] }]}>
            <LinearGradient
              colors={
                [colors.buttonRed.start, colors.buttonRed.end]
              }
              style={globalStyles.buttonGradient}
            >
              <Text style={globalStyles.buttonText}>Log Out</Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profile: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 14,
    color: '#757575',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
});

export default SettingScreen;