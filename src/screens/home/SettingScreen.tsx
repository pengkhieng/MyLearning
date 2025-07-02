import React from "react";

import { SafeAreaView, StatusBar, View , Text} from 'react-native'

const SettingScreen = () => {
    return (
        <SafeAreaView>
            <StatusBar barStyle="dark-content" />
            <View>
                <Text>Welcome to My App 👋</Text>
                <Text>This is the Setting Screen</Text>
            </View>
        </SafeAreaView>
    );
};

export default SettingScreen;