import React, { useState } from "react";
import { Animated, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, View, Text, Image, Alert } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';



import { globalStyles } from "../../style/globalStyles";

import { colors } from '../../utils/colors'

const onboardingData = [
    {
        image: require('../../assets/images/first_image.png'),
        title: ['Your Journey,', 'perfectly Planned'],
        desc: ['Effortlessly create and organize your,', 'dream trips. Start exploring now!'],
    },
    {
        image: require('../../assets/images/second_image.png'),
        title: ['Discover', 'Friends Nearby'],
        desc: ['See where your friends are traveling and', 'explore the world together.'],
    },
    {
        image: require('../../assets/images/third_image.png'),
        title: ['Stay Updated', 'with Top Places'],
        desc: ['Find trending destinations and must-see attractions,', 'all tailored to enhance your travel plans.'],
    },
];
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const OnboardingScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const [currentScreen, setCurrentScreen] = useState(0);
    const buttonScale = new Animated.Value(1);
    const isDisabled = currentScreen >= onboardingData.length;

    const handleNext = () => {
        if (currentScreen < onboardingData.length - 1) {
            setCurrentScreen(currentScreen + 1);
        } else {
            navigation.replace('Login')
        }
    };

    const handleBack = () => {
        if (currentScreen > 0) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    const handleSkip = () => {
        // Skip to the end or main app
        console.log('Skipped onboarding');
        navigation.replace('Login')
    };

    const handleDotPress = (index: number) => {
        setCurrentScreen(index);
    };
    const isLastScreen = currentScreen === onboardingData.length - 1;

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={globalStyles.container}>
                <View style={styles.contain_image}>
                    <Image
                        source={require('../../assets/images/image_trip.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <TouchableOpacity
                        onPress={handleSkip}
                        style={styles.skipButton}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.contain_slide_image}>
                    <Image
                        source={onboardingData[currentScreen].image}
                        style={styles.image_slider}
                        resizeMode="contain"
                    />
                    {onboardingData[currentScreen].title.map((line, index) => (
                        <Text key={index} style={styles.title}>{line}</Text>
                    ))}
                    <View style={styles.contain_desc}>
                        {onboardingData[currentScreen].desc.map((line, index) => (
                            <Text key={index} style={styles.desc}>{line}</Text>
                        ))}
                    </View>

                    <View style={styles.dotContainer}>
                        {onboardingData.map((_, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.dot, currentScreen === index ? styles.activeDot : styles.inactiveDot]}
                                onPress={() => handleDotPress(index)}
                                activeOpacity={0.8}
                            />
                        ))}
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    {currentScreen > 0 && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleBack}
                            style={styles.backButton}
                        >
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleNext}
                        style={styles.nextButton}
                        disabled={isDisabled}
                    >
                        <Animated.View style={[styles.button, { transform: [{ scale: buttonScale }] }]}>
                            <LinearGradient
                                colors={[colors.button.start, colors.button.end]
                                } style={globalStyles.buttonGradient}
                            >
                                <Text style={globalStyles.buttonText}>{isLastScreen ? 'Finish' : 'Next'}</Text>
                            </LinearGradient>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({

    contain_image: {
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        position: 'relative',
    },
    logo: {
        width: 150,
        height: 60,
        marginVertical: 8,
    },
    skipButton: {
        position: 'absolute',
        right: 20,
        padding: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(59, 131, 246, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale: 1 }],
    },

    skipText: {
        fontSize: 16,
        color: '#3B82F6',
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    contain_slide_image: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    image_slider: {
        justifyContent: 'flex-start',
        width: '100%',
        height: '63%',
        padding: 0,
        margin: 0,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 8,
    },
    contain_desc: {
        marginTop: 20
    },
    desc: {
        fontSize: 12,
        fontWeight: '400',
        textAlign: 'center',
        marginTop: 8,
        color: 'gray'
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#3B82F6',
    },
    inactiveDot: {
        backgroundColor: '#D1D5DB',
    },
    buttonContainer: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      },
      backButton: {
        flex: 1,
        paddingVertical: 15,
        backgroundColor: '#E5E7EB',
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 10
      },
      backButtonText: {
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '600',
      },
      nextButton: {
        flex: 1,
      },
      button: {
        borderRadius: 10,
        overflow: 'hidden',
      },

});