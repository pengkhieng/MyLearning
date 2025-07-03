import React, { useRef } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, Animated, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

import { globalStyles } from '../../style/globalStyles';
import { Image } from "react-native";

import { colors } from '../../utils/colors'


type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
    const buttonScale = useRef(new Animated.Value(1)).current;

    const navigation = useNavigation<LoginScreenNavigationProp>();

    const handlePress = () => {
        console.log('Button pressed');
        // Add your button press logic here
        navigation.replace('Onboarding')
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
            <SafeAreaView style={globalStyles.safeArea}>
                <StatusBar
                    backgroundColor="transparent"
                    translucent
                    barStyle="dark-content" // Use 'dark-content' if background is light
                />
                {/* Centered content container */}
                <View style={styles.contentContainer}>
                    <Image source={require('../../assets/images/image_trip.png')}
                        style={{ width: '70%' }} resizeMode="contain" />
                    <Text style={{ fontSize: 60, marginTop: 60 }}>👋</Text>
                    <Text style={styles.title}>Welcome</Text>
                    <Text style={styles.title}>to our WanderWise trip</Text>
                    <Text style={styles.subtitle}>Manage your products in as fast as one hour</Text>
                </View>

                {/* Spacer to push button to bottom */}
                <View style={styles.spacer} />

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handlePress}
                    style={styles.buttonContainer}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: buttonScale }] }]}>
                        <LinearGradient
                            colors={[colors.button.start, colors.button.end]}
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
        color: 'white',
        marginBottom: 0,
        textAlign: 'center',
        fontFamily: 'System',
    },
    spacer: {
        flex: 0,
    },
    buttonContainer: {
        width: '90%',
        marginBottom: 40,
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