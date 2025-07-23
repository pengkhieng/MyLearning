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

type ForgotPasswordNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { forgotPassword, loading, error, data } = useLogin();
  const navigation = useNavigation<ForgotPasswordNavigationProp>();

  const isButtonDisabled = !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || loading;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSendResetCode = async () => {
    if (isButtonDisabled) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      const success = await forgotPassword(email);
      if (success) {
        Alert.alert('Success', 'A reset code has been sent to your email.');
        navigation.navigate('ResetPassword', { email });
      } else {
        Alert.alert('Error', 'Failed to send verification code. Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', error || 'An error occurred while sending the reset code.');
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
                <Text style={styles.title}>Forgot Password? 🔒</Text>
                <Text style={styles.subtitle}>Enter your email to receive a password reset code.</Text>

                <Text style={styles.label}>Email</Text>
                <View style={[globalStyles.inputContainer, isEmailFocused && globalStyles.inputFocused]}>
                  <TextInput
                    style={[globalStyles.input, isEmailFocused && { borderColor: colors.primary }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.placeholderTxt}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                  />
                </View>

                {error && <Text style={styles.error}>{error}</Text>}
                {data && <Text style={styles.success}>{data.message}</Text>}

                <CustomButton
                  title={loading ? 'Sending Code...' : 'Send Code'}
                  onPress={handleSendResetCode}
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

export default ForgotPassword;