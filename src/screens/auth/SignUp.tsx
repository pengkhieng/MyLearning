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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLogin } from '../../hooks/useLogin';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../style/globalStyles';
import CustomButton from '../../components/CustomButton';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type SignUpNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const { requestVerification, loading, error, data } = useLogin();
  const navigation = useNavigation<SignUpNavigationProp>();

  const isButtonDisabled = !username || !email || !password || loading;
  const isEmailInvalid = !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isUsernameInvalid = !username || username.length < 4;
  const isPasswordInvalid = !password || password.length < 8;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSignUp = async () => {
    if (isEmailInvalid) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (isUsernameInvalid) {
      Alert.alert('Invalid Username', 'Username must be at least 4 characters long.');
      return;
    }
    if (isPasswordInvalid) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters long.');
      return;
    }

    try {
      const success = await requestVerification(email);
      if (success) {
        navigation.navigate('VerifyCode', { user: { username, email, password } });
      } else {
        Alert.alert('Error', 'Failed to send verification code. Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', error || 'An error occurred during sign-up.');
    }
  };

  const handleBackPress = () => navigation.goBack();
  const handleLoginPress = () => navigation.replace('Login',{});

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
                <Text style={styles.title}>Create an Account! 👋</Text>
                <Text style={styles.subtitle}>Please enter your details to sign up.</Text>

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

                <Text style={styles.label}>Email</Text>
                <View style={[globalStyles.inputContainer, isEmailFocused && globalStyles.inputFocused]}>
                  <TextInput
                    style={[globalStyles.input, isEmailFocused && { borderColor: colors.primary }]}
                    placeholder="Email"
                    placeholderTextColor={colors.placeholderTxt}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
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

                {error && <Text style={styles.error}>{error}</Text>}
                {data && <Text style={styles.success}>{data.message}</Text>}

                <CustomButton
                  title={loading ? 'Signing Up...' : 'Sign Up'}
                  onPress={handleSignUp}
                  animation="pulse"
                  duration={200}
                  isDisabled={isButtonDisabled}
                  buttonStyle={styles.button}
                />

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <TouchableOpacity onPress={handleLoginPress}>
                    <Text style={styles.loginLink}>Log In</Text>
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
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  loginText: {
    fontSize: 16,
    color: colors.text,
  },
  loginLink: {
    fontSize: 16,
    color: colors.customDarkBlue,
    fontWeight: '600',
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
});

export default SignUp;