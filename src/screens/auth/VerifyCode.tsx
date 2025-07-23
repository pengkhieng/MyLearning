import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../../hooks/useLogin';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../style/globalStyles';
import CustomButton from '../../components/CustomButton';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { KKey } from '../../constants/ApiEndpoints';

type VerifyCodeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyCode'>;
type VerifyCodeRouteProp = RouteProp<RootStackParamList, 'VerifyCode'>;

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const [isCodeFocused, setIsCodeFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { signUpUser, loading, error, data } = useLogin();
  const navigation = useNavigation<VerifyCodeNavigationProp>();
  const route = useRoute<VerifyCodeRouteProp>();
  const { user } = route.params;

  const isButtonDisabled = !code || loading;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('Invalid Code', 'Please enter a verification code.');
      return;
    }

    try {
      const response = await signUpUser(
        user?.username ?? '',
        user?.email ?? '',
        user?.password ?? '',
        code
      );

      if (response.data?.accessToken) {
        await AsyncStorage.setItem(KKey.ACCESS_TOKEN, response.data.accessToken);
      }
      if (response.data?.refreshToken) {
        await AsyncStorage.setItem(KKey.REFRESH_TOKEN, response.data.refreshToken);
      }
      if (response.data?.user) {
        await AsyncStorage.setItem(KKey.USER, JSON.stringify(response.data.user));
      }

      navigation.replace('Main');
    } catch (err) {
      Alert.alert('Verification Failed', error || 'An error occurred during verification.');
    }
  };

  const handleBackPress = () => navigation.goBack();

  return (
    <LinearGradient
      colors={[colors.gradientBackground.start, colors.gradientBackground.mid, colors.gradientBackground.end]}
      style={globalStyles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView contentContainerStyle={globalStyles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.contentWrapper}>
              <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Text style={styles.title}>Verify Your Email</Text>
                <Text style={styles.subtitle}>Enter the code sent to your email.</Text>
                <Text style={styles.label}>Verification Code</Text>
                <View style={[globalStyles.inputContainer, isCodeFocused && globalStyles.inputFocused]}>
                  <TextInput
                    style={[globalStyles.input, isCodeFocused && { borderColor: colors.primary }]}
                    placeholder="Enter code"
                    placeholderTextColor={colors.placeholderTxt}
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    onFocus={() => setIsCodeFocused(true)}
                    onBlur={() => setIsCodeFocused(false)}
                  />
                </View>

                {error && <Text style={styles.error}>{error}</Text>}
                {data && <Text style={styles.success}>{data.message}</Text>}

                <CustomButton
                  title={loading ? 'Verifying...' : 'Verify Code'}
                  onPress={handleVerifyCode}
                  animation="pulse"
                  duration={200}
                  isDisabled={isButtonDisabled}
                  buttonStyle={styles.button}
                />
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 40,
    textAlign: 'center',
  },
  label: {
    marginBottom: 10,
    color: colors.text,
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 60,
    padding: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 1,
  },
  button: {
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  success: {
    color: 'green',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default VerifyCode;