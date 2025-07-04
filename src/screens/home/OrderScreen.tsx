import React from "react";
import { SafeAreaView, StatusBar, View, Text, StyleSheet } from 'react-native'
import { globalStyles } from "../../style/globalStyles";

const OrderScreen = () => {
    return (
        <SafeAreaView style={globalStyles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[globalStyles.paddingStatusBar, globalStyles.bodyContain]}>
                <Text style={styles.title}>Welcome to My App 👋</Text>
                <Text style={styles.subtitle}>This is the Order Screen</Text>
            </View>
        </SafeAreaView>
    );
};

export default OrderScreen;

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
    },
});