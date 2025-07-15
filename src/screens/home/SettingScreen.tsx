import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../../navigation/AppNavigator";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../utils/colors'
import CustomButton from "../../components/CustomButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "../../types/authTypes";
import { globalStyles } from "../../style/globalStyles";


type SettingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setting'>;

const SettingScreen = () => {

  const buttonScale = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<SettingScreenNavigationProp>();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userString = await AsyncStorage.getItem("user");
      const userData: User | null = userString ? JSON.parse(userString) : null;
      setUser(userData);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'tokenExpiration', 'refreshToken', 'userId', 'username', 'email', 'roles']);
      navigation.replace('Welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
    <ScrollView
      style={globalStyles.scrollView}
      contentContainerStyle={globalStyles.contentContainer}
    >
      <View style={styles.profile}>

      {user?.profileImage && user.profileImage !== "" && user.profileImage !== null ? (
          <Image
            source={{ uri: user?.profileImage }}
            style={styles.image}
          />
        ) : (
          <Ionicons name="person-circle-outline" size={80} color="#4CAF50" />
        )}


        <Text style={styles.profileName}>{user?.username ?? ""}</Text>
        <Text style={styles.profileEmail}>{user?.email ?? ""}</Text>
        <Text style={styles.profileEmail}>
          {(user?.roles && user.roles.length > 0) ? user.roles.join('\n') : ''}
        </Text>

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
      <CustomButton
        title="Log Out"
        onPress={handleLogout}
        gradientColors={[colors.buttonRed.start, colors.buttonRed.end]}
        containerStyle={{ paddingTop: 20 }}
      />
    </ScrollView>
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
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
});

export default SettingScreen;