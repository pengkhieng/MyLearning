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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLogin } from '../../hooks/useLogin';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../style/globalStyles';
import CustomButton from '../../components/CustomButton';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type VerifyCodeRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;


const ResetPassword = () => {
  const [verifyCode, setVerifyCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const [isverifyCodeFocused, setIsVerifyCodeFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const { resetPassword, loading, error, data } = useLogin();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'ResetPassword'>>();
  const { email } = route.params;


  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleResetPassword = async () => {
    if (!verifyCode || password.length < 8 || confirmPassword.length < 8) {
      Alert.alert('Error', 'All fields must be filled and passwords must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'New password and confirmation do not match.');
      return;
    }

    const success = await resetPassword(email, password, verifyCode);
    if (success) {
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={[colors.gradientBackground.start, colors.gradientBackground.mid, colors.gradientBackground.end]}
      style={globalStyles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView contentContainerStyle={globalStyles.scrollContainer} showsVerticalScrollIndicator={false}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              <Text style={styles.title}>Reset Password! 👋</Text>
              <Text style={styles.subtitle}>Please enter the verification code and your new password.</Text>

              {/* Verification Code */}
              <Text style={styles.label}>Verification Code</Text>
              <View style={[globalStyles.inputContainer, isverifyCodeFocused && globalStyles.inputFocused]}>
                <TextInput
                  style={[globalStyles.input, isverifyCodeFocused && { borderColor: colors.primary }]}
                  placeholder="Verification Code"
                  placeholderTextColor={colors.placeholderTxt}
                  value={verifyCode}
                  onChangeText={setVerifyCode}
                  keyboardType="default"
                  autoCapitalize="none"
                  onFocus={() => setIsVerifyCodeFocused(true)}
                  onBlur={() => setIsVerifyCodeFocused(false)}
                />
              </View>

              {/* New Password */}
              <Text style={styles.label}>New Password</Text>
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

              {/* Confirm Password */}
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[globalStyles.inputContainer, isNewPasswordFocused && globalStyles.inputFocused]}>
                <TextInput
                  style={[globalStyles.input, isNewPasswordFocused && { borderColor: colors.primary }]}
                  placeholder="Confirm Password"
                  placeholderTextColor={colors.placeholderTxt}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  onFocus={() => setIsNewPasswordFocused(true)}
                  onBlur={() => setIsNewPasswordFocused(false)}
                />
              </View>

              {/* Error or Success Message */}
              {error && <Text style={styles.error}>{error}</Text>}
              {data && <Text style={styles.success}>{data.message}</Text>}

              {/* Submit Button */}
              <CustomButton
                title={loading ? 'Resetting...' : 'Reset Password'}
                onPress={handleResetPassword}
                animation="pulse"
                duration={200}
                isDisabled={!verifyCode || !password || !confirmPassword || loading}
                buttonStyle={styles.button}
              />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  keyboardAvoidingContainer: { flex: 1 },
  content: {
    paddingHorizontal: 30,
    flex: 1,
    justifyContent: 'center',
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

export default ResetPassword;
