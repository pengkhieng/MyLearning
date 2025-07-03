import React from "react";

import { SafeAreaView, StatusBar, View , Text} from 'react-native'
import { globalStyles } from "../../style/globalStyles";

const OrderScreen = () => {
    return (
        <SafeAreaView>
            <StatusBar barStyle="dark-content" />
            <View style={globalStyles.paddingStatusBar}>
                <Text>Welcome to My App 👋</Text>
                <Text>This is the Order Screen</Text>
            </View>
        </SafeAreaView>
    );
};

export default OrderScreen;