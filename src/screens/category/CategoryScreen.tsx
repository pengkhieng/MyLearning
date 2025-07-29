import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCategories } from '../../hooks/useCategories';
import { globalStyles } from '../../style/globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CategoryItem from '../../components/CategoryItem';
import { colors } from '../../utils/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

type CategoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CategoryScreen'>;

const CategoryScreen: React.FC = () => {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    deleteCategory,
  } = useCategories();

  const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigation = useNavigation<CategoryScreenNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      fetchCategories(true);
    }, [fetchCategories])
  );

  const handleAddCategory = () => {
    navigation.push('CreateCategory', {});
  };

  const handleEditCategory = (category: Category) => {
    navigation.push('CreateCategory', {
      data: {
        id: category.id,
        category: {
          name: category.name,
          description: category.description || '',
        },
        imageUrl: category.imageUrl
      }
    });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete the category "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCategory(id),
        },
      ]
    );
  };

  const handleScroll = useCallback(
    (event: any) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      setIsAddButtonVisible(currentScrollY <= 10 || currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    },
    [lastScrollY]
  );

  const renderContent = () => {
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
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={() => fetchCategories(true)}
          >
            <Text style={styles.tryAgainText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <ScrollView
          style={globalStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={globalStyles.contentContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {categories.length === 0 ? (
            <Text style={styles.noDataText}>No categories available</Text>
          ) : (
            categories.map((item, index) => (
              <CategoryItem
                key={item.id}
                item={item}
                index={index}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            ))
          )}
        </ScrollView>
        {isAddButtonVisible && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: 'gray' },
  errorText: { fontSize: 16, color: 'red' },
  noDataText: { fontSize: 16, color: 'gray' },
  tryAgainButton: {
    alignItems: 'center',
    marginTop: 60,
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tryAgainText: { color: 'white', fontWeight: 'bold' },
  addButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    backgroundColor: colors.orangeWithOpacity,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default CategoryScreen;