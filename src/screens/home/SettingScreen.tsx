import React, { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../utils/colors';
import CustomButton from '../../components/CustomButton';
import { useProfile } from '../../hooks/useProfile';
import { globalStyles } from '../../style/globalStyles';
import ProfileImageWithEdit from '../../components/ProfileImageWithEdit';
import { KKey } from '../../constants/ApiEndpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setting'>;

const SettingScreen = () => {
  const navigation = useNavigation<SettingScreenNavigationProp>();
  const { user, loading, error, handleImageChange, getUser } = useProfile();

  useEffect(() => {
    console.log('Running useEffect to call getUser'); // Debug log
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: () => {} }]);
    }
  }, [error]);
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        KKey.ACCESS_TOKEN,
        KKey.REFRESH_TOKEN,
        KKey.TOKEN_EXPRIATION,
        KKey.USER,
      ]);
      navigation.replace('Welcome');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const settingsOptions = [
    { icon: 'bag', label: 'Brands', screen: 'Brands' },
    { icon: 'map', label: 'Zone', screen: 'Zone' },
    { icon: 'ticket', label: 'Promo Code', screen: 'PromoCode' },
    { icon: 'notifications', label: 'Notifications', screen: 'Notifications' },
    { icon: 'help', label: 'Help', screen: 'Help' },
    { icon: 'information', label: 'About', screen: 'About' },
  ] as const;

  return (
    <ScrollView
      style={globalStyles.scrollView}
      contentContainerStyle={globalStyles.contentContainer}
    >
      <View style={styles.profile}>
        {/* {loading && <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />} */}
        <ProfileImageWithEdit user={user} onImageChange={handleImageChange} />
        <Text style={styles.profileName}>Username: {user?.username ?? 'N/A'}</Text>
        <Text style={styles.profileEmail}>Email: {user?.email ?? 'N/A'}</Text>
        <Text style={styles.profileEmail}>
          {user?.roles && user.roles.length > 0 ? user.roles.join(', ') : 'No roles'}
        </Text>
      </View>
      {settingsOptions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          // onPress={() => navigation.navigate(item.screen)}
          disabled={loading}
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
    color: colors.orangeWithOpacity,
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
  loading: {
    marginBottom: 10,
  },
});

export default SettingScreen;