import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, Animated, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { globalStyles } from '../../style/globalStyles';
import { Image } from "react-native";
import { colors } from '../../utils/colors'
import CustomButton from "../../components/CustomButton";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {

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
            <SafeAreaView style={globalStyles.container}>
                <StatusBar
                    backgroundColor="transparent"
                    translucent
                    barStyle="dark-content"
                />
                <View style={styles.contentContainer}>
                    <Image source={require('../../assets/images/image_trip.png')}
                        style={{ width: '70%' }} resizeMode="contain" />
                    <Text style={{ fontSize: 60, marginTop: 60 }}>👋</Text>
                    <Text style={styles.title}>Welcome</Text>
                    <Text style={styles.title}>to Your WanderWise Trip</Text>
                    <Text style={styles.subtitle}>Manage your plans in as little as a short time</Text>
                </View>
                <View style={styles.spacer} />

                <CustomButton
                    title="Get Started"
                    onPress={handlePress}
                    containerStyle={{ paddingHorizontal: 20 }}
                    buttonStyle={{ marginBottom: 20 }}
                />
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
        fontSize: 26,
        fontWeight: '600',
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
});