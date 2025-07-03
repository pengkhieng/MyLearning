import React, { useState } from 'react';
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
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { globalStyles } from '../../style/globalStyles';
import { colors } from '../../utils/colors'


type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [username, setUsername] = useState('khieng11');
  const [password, setPassword] = useState('password');
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [buttonScale] = useState(new Animated.Value(1));

  const isDisable = username === '' || password === '';

  const navigation = useNavigation<LoginScreenNavigationProp>();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogin = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (username && password) {
      Alert.alert(`Login successfuly with username: ${username}`);
      navigation.replace('Main');
    } else {
      Alert.alert('Please enter both username is "khieng11" and password is "password"');
    }
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
      <SafeAreaView style={{flex: 1}}>
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
                  keyboardType="email-address"
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

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleLogin}
                style={styles.buttonContainer}
                disabled={isDisable}
              >
                <Animated.View style={[styles.button, { transform: [{ scale: buttonScale }] }]}>
                  <LinearGradient
                    colors={
                      isDisable
                        ? [colors.button.disabledStart, colors.button.disabledEnd]
                        : [colors.button.start, colors.button.end]
                    }
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>Sign In</Text>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

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
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 40,
    textAlign: 'center',
    fontFamily: 'System',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
    padding: 16
  },
  forgotPassword: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
  },
});