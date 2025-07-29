import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/AppNavigator';

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetailScreen'>;

interface ProductDetailScreenProps {
  route: ProductDetailScreenRouteProp;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const Product = route.params?.data;

  // Log Product data for debugging
  console.log('Product:', Product);

  // Handle missing product data
  if (!Product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product data is missing.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Product Detail</Text>
        <Text></Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerScroller}
      >
        {/* Product Image */}

        {Product.imageUrl && Product.imageUrl.trim() !== "" ? (
          <Image
            source={{ uri: Product.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require('../../assets/images/image_empty.png')}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{Product.name ?? 'N/A'}</Text>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{Product.description ?? 'N/A'}</Text>

          <Text style={styles.label}>Price</Text>
          <Text style={styles.value}>${Product.price ?? 'N/A'}</Text>

          <Text style={styles.label}>Stock</Text>
          <Text style={styles.value}>{Product.stock ?? 'N/A'}</Text>

          <Text style={styles.label}>Active</Text>
          <Text style={styles.value}>{Product.active ? 'Yes' : 'No'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  contentContainerScroller: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  image: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.4,
    resizeMode: 'cover',
  },
  infoCard: {
    marginTop: -30,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: {
    fontSize: 13,
    color: '#888',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});