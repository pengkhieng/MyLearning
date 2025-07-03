import React from "react";

import { SafeAreaView, StatusBar, View, Text, StyleSheet } from 'react-native'

import { globalStyles } from "../../style/globalStyles";

const CategoryScreen = () => {
    return (
        <SafeAreaView>
            <StatusBar barStyle="dark-content" />
            <View style={globalStyles.paddingStatusBar}>
                <Text>Welcome to My App 👋</Text>
                <Text>This is the Category Screen</Text>
            </View>
        </SafeAreaView>
    );
};

export default CategoryScreen;