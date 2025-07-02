import React from "react";

import { SafeAreaView, StatusBar, View , Text} from 'react-native'

const CategoryScreen = () => {
    return (
        <SafeAreaView>
            <StatusBar barStyle="dark-content" />
            <View>
                <Text>Welcome to My App 👋</Text>
                <Text>This is the Category Screen</Text>
            </View>
        </SafeAreaView>
    );
};

export default CategoryScreen;