import React from "react";
import { SafeAreaView, StatusBar, View, Text } from "react-native";



const OnboardingScreen = () => {
    return (
        <SafeAreaView>
            <StatusBar barStyle="light-content" />
            <View>
                <Text>Onboarding 👋</Text>
                <Text>Welcome to Onboarding Screen</Text>
            </View>
        </SafeAreaView>
    );
};

export default OnboardingScreen;