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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../../hooks/useLogin';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../style/globalStyles';
import CustomButton from '../../components/CustomButton';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { KKey } from '../../constants/ApiEndpoints';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [username, setUsername] = useState('khieng');
  const [password, setPassword] = useState('password');
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { loginUser, loading, error, data } = useLogin();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const isDisable = username === '' || password === '';

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogin = async () => {
    try {
      const response = await loginUser(username, password);
      await AsyncStorage.setItem(KKey.ACCESS_TOKEN, response.data?.accessToken ?? '');
      await AsyncStorage.setItem(KKey.REFRESH_TOKEN, response.data?.refreshToken ?? '');

      if (response.data?.user != null) {
        await AsyncStorage.setItem(KKey.USER, JSON.stringify(response.data.user));
      }
      navigation.replace('Main');
    } catch (err) {
      Alert.alert('Login Failed', error || 'An error occurred during login');
    }
  };

  const handleForgotPassword = () => {
    navigation.push('ForgotPassword');
  };
  const handleSignUp = () => {
    navigation.push('SignUp');
  };

  return (
    <LinearGradient
      colors={[
        colors.gradientBackground.start,
        colors.gradientBackground.mid,
        colors.gradientBackground.end,
      ]}
      style={globalStyles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Text style={styles.title}>Welcome Back! 👋</Text>
                <Text style={styles.subtitle}>Sign in to your account</Text>

                <View style={[globalStyles.inputContainer, isUsernameFocused && globalStyles.inputFocused]}>
                  <TextInput
                    style={[globalStyles.input, isUsernameFocused && { borderColor: colors.primary }]}
                    placeholder="Username"
                    placeholderTextColor={colors.placeholderTxt}
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="default"
                    autoCapitalize="none"
                    onFocus={() => setIsUsernameFocused(true)}
                    onBlur={() => setIsUsernameFocused(false)}
                  />
                </View>
                <View style={[globalStyles.inputContainer, isPasswordFocused && globalStyles.inputFocused]}>
                  <TextInput
                    style={[globalStyles.input, isPasswordFocused && { borderColor: colors.primary }]}
                    placeholder="Password"
                    placeholderTextColor={colors.placeholderTxt}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                </View>
                <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
                {error && <Text style={styles.error}>{error}</Text>}
                {data && <Text style={styles.success}>{data.message}</Text>}
                <CustomButton
                  title={loading ? 'Signing In...' : 'Sign In'}
                  onPress={handleLogin}
                  animation="pulse"
                  duration={200}
                  isDisabled={isDisable || loading}
                  buttonStyle={{ marginBottom: 10 }}
                />
               
              </Animated.View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' ,marginVertical:20}}>
              <Text>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp} style={styles.signUp}>
                <Text style={styles.forgotPasswordText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
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
  forgotPassword: {
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  signUp: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: colors.customDarkBlue,
    fontSize: 16,
    fontWeight: '400',
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

export default LoginScreen;