import React from "react";
import {  StatusBar, View, Text, StyleSheet, FlatList } from 'react-native';
import { globalStyles } from "../../style/globalStyles";
import { useCategories } from '../../hooks/useCategories';
import { SafeAreaView } from 'react-native-safe-area-context';


const CategoryScreen = () => {
    const { categories, loading, error } = useCategories();

    return (
        <SafeAreaView  style={{ flex: 1 }}  edges={[]}>
            <StatusBar barStyle="dark-content" />
            <View style={[globalStyles.paddingStatusBar, globalStyles.bodyContain]}>
                <FlatList
                    style={{ width: '100%', paddingTop: 50, marginBottom: 35 }}
                    data={categories}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false} 
                    renderItem={({ item, index }) => (
                        <View style={[styles.card, {
                            backgroundColor: index % 2 !== 0 ? 'rgba(255, 241, 235, 0.35)' : 'rgba(177, 227, 255, 0.2)',
                            height: 60
                        }]}>
                            <Text style={styles.name}>{item.name.trim()}</Text>
                            {item.description ? <Text>{item.description}</Text> : null}
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default CategoryScreen;

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    card: {
        padding: 10,
        marginVertical: 6,
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
    },
    name: {
        fontWeight: '600',
        fontSize: 16,
    },
});
