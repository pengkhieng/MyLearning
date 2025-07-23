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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../../hooks/useLogin';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../style/globalStyles';
import CustomButton from '../../components/CustomButton';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { KKey } from '../../constants/ApiEndpoints';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type VerifyCodeRouteProp = RouteProp<RootStackParamList, 'Login'>;


const LoginScreen = () => {
  const [username, setUsername] = useState('khieng');
  const [password, setPassword] = useState('password');
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const { loginUser, loading, error, data } = useLogin();
  const navigation = useNavigation<LoginScreenNavigationProp>();

    const route = useRoute<VerifyCodeRouteProp>();
    const { user } = route.params;

  const isButtonDisabled = !username || !password || loading;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    setUsername( user?.username ?? "");
    setPassword(user?.password ?? "");

  }, [fadeAnim]);

  const handleLogin = async () => {
    if (!username) {
      Alert.alert('Invalid Username', 'Please enter a username.');
      return;
    }
    if (!password) {
      Alert.alert('Invalid Password', 'Please enter a password.');
      return;
    }

    try {
      const response = await loginUser(username, password);
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
      Alert.alert('Login Failed', error || 'An error occurred during login.');
    }
  };

  const handleForgotPassword = () => navigation.navigate('ForgotPassword');
  const handleSignUp = () => navigation.navigate('SignUp');

  return (
    <LinearGradient
      colors={[colors.gradientBackground.start, colors.gradientBackground.mid, colors.gradientBackground.end]}
      style={globalStyles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView contentContainerStyle={globalStyles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.contentWrapper}>
              <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Text style={styles.title}>Welcome Back! 👋</Text>
                <Text style={styles.subtitle}>Sign in to your account</Text>

                <Text style={styles.label}>Username</Text>
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

                <Text style={styles.label}>Password</Text>
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

                <TouchableOpacity onPress={handleForgotPassword} style={[styles.forgotPassword]}>
                  <Text style={[styles.forgotPasswordText]}>Forgot Password?</Text>
                </TouchableOpacity>


                {error && <Text style={styles.error}>{error}</Text>}
                {data && <Text style={styles.success}>{data.message}</Text>}

                <CustomButton
                  title={loading ? 'Signing In...' : 'Sign In'}
                  onPress={handleLogin}
                  animation="pulse"
                  duration={200}
                  isDisabled={isButtonDisabled}
                  buttonStyle={styles.button}
                />

                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={handleSignUp}>
                    <Text style={styles.signUpLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
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
  forgotPassword: {
    marginBottom: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  signUpText: {
    fontSize: 16,
    color: colors.text,
  },
  signUpLink: {
    fontSize: 16,
    color: colors.customDarkBlue,
    fontWeight: '600',
  },
  forgotPasswordText: {
    fontSize: 16,
    color: colors.customDarkBlue,
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
  button: {
    marginBottom: 10,
  },
});

export default LoginScreen;