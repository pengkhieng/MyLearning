import React, { useRef } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, Animated, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

import { globalStyles } from '../../style/globalStyles';


type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
    const buttonScale = useRef(new Animated.Value(1)).current;
    const isDisabled = false; // Modify based on your logic

     const navigation = useNavigation<LoginScreenNavigationProp>();

    const handlePress = () => {
        console.log('Button pressed');
        // Add your button press logic here
        navigation.navigate('Onboarding')
    };

    return (
        <LinearGradient
            colors={['#6B7280', '#3B82F6', '#1E3A8A']}
            style={globalStyles.container}
        >
            <SafeAreaView style={globalStyles.safeArea}>
                <StatusBar barStyle="light-content" />
                {/* Centered content container */}
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Welcome Back! 👋</Text>
                    <Text style={styles.subtitle}>Sign in to your account</Text>
                </View>
                
                {/* Spacer to push button to bottom */}
                <View style={styles.spacer} />
                
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handlePress}
                    style={styles.buttonContainer}
                    disabled={isDisabled}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: buttonScale }] }]}>
                        <LinearGradient
                            colors={isDisabled ? ['rgba(156, 163, 175, 0.4)', 'rgba(107, 114, 128, 0.4)'] : ['#3B82F6', '#1D4ED8']}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.buttonText}>Get Started</Text>
                        </LinearGradient>
                    </Animated.View>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'System',
    },
    subtitle: {
        fontSize: 18,
        color: '#D1D5DB',
        marginBottom: 40,
        textAlign: 'center',
        fontFamily: 'System',
    },
    spacer: {
        flex: 0.1,
    },
    buttonContainer: {
        width: '90%',
        marginBottom: 20,
        alignSelf: 'center',
    },
    button: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    buttonGradient: {
   
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'System',
        paddingVertical: 15,
    },
});