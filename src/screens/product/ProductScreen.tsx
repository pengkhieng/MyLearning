import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useProducts } from '../../hooks/useProduct';
import { useCategories } from '../../hooks/useCategories';
import { Product } from '../../types/Product';
import { globalStyles } from '../../style/globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../utils/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import ProductCard from '../../components/ProductCard';

type ProductScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductScreen'>;

const ProductScreen: React.FC = () => {
  const { products, loading, error, fetchProducts, deleteProduct } = useProducts();
  const { categories, fetchCategories } = useCategories();
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigation = useNavigation<ProductScreenNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      fetchProducts(true);
      fetchCategories(true);
      return () => {};
    }, [fetchProducts, fetchCategories])
  );

  const handleAddProduct = () => {
    navigation.push('CreateProduct', {});
  };

  const handleEditProduct = (product: Product) => {
    navigation.push('CreateProduct', {
      data: {
        itemId: product.itemId,
        product: {
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          stock: product.stock,
        },
      },
    });
  };

  const handleDeleteProduct = (id: string, name: string) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete the product "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProduct(id),
        },
      ],
      { cancelable: true }
    );
  };

  const handleProductDetail = (product: Product) => {
    if (!product || !product.itemId) {
      Alert.alert('Error', 'Invalid product data');
      return;
    }
    navigation.navigate('ProductDetailScreen', { data: product });
  };

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
            onPress={() => {
              fetchProducts(true);
              fetchCategories(true);
            }}
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
          contentContainerStyle={[globalStyles.contentContainer, styles.scrollContent]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.itemsContainer}>
            {products.length === 0 ? (
              <Text style={styles.noDataText}>No products available</Text>
            ) : (
              products.map((item) => (
                <ProductCard
                  key={item.itemId}
                  product={item}
                  categories={categories}
                  onProductDetail={handleProductDetail}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              ))
            )}
          </View>
        </ScrollView>
        {isAddButtonVisible && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </>
    );
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
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
  tryAgainButton: {
    alignItems: 'center',
    marginTop: 60,
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tryAgainText: {
    color: 'white',
    fontWeight: 'bold',
  },
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

export default ProductScreen;