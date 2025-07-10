import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCategories } from '../../hooks/useCategories';
import { globalStyles } from '../../style/globalStyles';

const CategoryScreen = () => {
  const { categories, loading, error, fetchCategories } = useCategories();

  // Trigger API call every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchCategories(true); // Force refresh to bypass cache
      return () => {
        // Optional cleanup if needed
      };
    }, [fetchCategories])
  );

  if (loading) {
    return (
      <View style={[globalStyles.contentContainer, styles.centered]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[globalStyles.contentContainer, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View style={[globalStyles.contentContainer, styles.centered]}>
        <Text style={styles.noDataText}>No categories available</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={globalStyles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyles.contentContainer}
    >
      {categories.map((item, index) => (
        <View
          key={item.id.toString()} // Ensure key is a string
          style={[
            styles.itemContainer,
            {
              backgroundColor: index % 2 !== 0 ? 'rgba(255, 145, 0, 0.1)' : 'rgba(0, 128, 0, 0.1)',
            },
          ]}
        >
          <Text style={styles.itemText}>{item.name?.trim() || 'Unnamed Category'}</Text>
          {item.description ? (
            <Text style={styles.itemDescription} numberOfLines={1} ellipsizeMode="tail">
              {item.description}
            </Text>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: 'stretch',
    minHeight: 70,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  itemDescription: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'gray',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
  },
});