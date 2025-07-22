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
import { colors } from '../../utils/colors';
import { globalStyles } from '../../style/globalStyles';
import CustomButton from '../../components/CustomButton';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Placeholder for a custom hook to handle password reset (replace with actual implementation)
import { useLogin } from '../../hooks/useLogin';
import { KKey } from '../../constants/ApiEndpoints';

type ForgotPasswordNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const [isEmailFocused, setIsCodeFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { signUpUser, loading, error, data } = useLogin();
  const navigation = useNavigation<ForgotPasswordNavigationProp>();

  const route = useRoute<RouteProp<RootStackParamList, 'VerifyCode'>>();
  const { user } = route.params;
  


  const isDisable = code === ""
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSendResetCode = async () => {
    try {
      Alert.alert('Success', 'A password reset code has been sent to your email.');
      // Optionally navigate to a screen to enter the reset code
    } catch (err) {
      Alert.alert('Error', error || 'An error occurred while sending the reset code.');
    }
  };

  const handleSignUp = async (verifyCode: string) => {
   



    try {
      const response = await  await signUpUser(user.username, user.email, user.password, verifyCode);
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
  

  return (
    <LinearGradient
      colors={[colors.gradientBackground.start, colors.gradientBackground.mid, colors.gradientBackground.end]}
      style={globalStyles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
                <Text style={styles.title}>Check your email</Text>
                <Text style={styles.subtitle}>Enter your code that receive from your email.</Text>
                <View style={[globalStyles.inputContainer, isEmailFocused && globalStyles.inputFocused]}>
                  <TextInput
                    style={[globalStyles.input, isEmailFocused && { borderColor: colors.primary }]}
                    placeholder="Enter your code"
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
                  title={loading ? 'Verify Code...' : 'Verify Code'}
                  onPress={() => handleSignUp(code)}
                  animation="pulse"
                  duration={200}
                  isDisabled={isDisable || loading}
                  buttonStyle={{ marginBottom: 10 }}
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
  signUp: {
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: colors.text,
  },
  signUpLink: {
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
});

export default VerifyCode;