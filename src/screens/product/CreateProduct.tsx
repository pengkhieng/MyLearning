import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useProducts } from '../../hooks/useProduct';
import { useCategories } from '../../hooks/useCategories';
import { useUploadImage } from '../../hooks/useUploadImage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Category } from '../../types/CategoryType';
import CustomButton from '../../components/CustomButton';

type CreateProductScreenRouteProp = RouteProp<RootStackParamList, 'CreateProduct'>;

interface CreateProductScreenProps {
  route: CreateProductScreenRouteProp;
}

const CreateProduct: React.FC<CreateProductScreenProps> = ({ route }) => {
  const { data: product, imageUrl } = route.params || {};
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addProduct, editProduct } = useProducts();
  const { categories } = useCategories();
  const { uploadImage, loading: uploadLoading, error: uploadError } = useUploadImage();

  const [name, setName] = useState(product?.product.name || '');
  const [description, setDescription] = useState(product?.product.description || '');
  const [price, setPrice] = useState(product?.product.price ? product.product.price.toString() : '');
  const [categoryId, setCategoryId] = useState(product?.product.categoryId || (categories.length > 0 ? categories[0].id : ''));
  const [stock, setStock] = useState(product?.product.stock ? product.product.stock.toString() : '');
  const [imageUri, setImageUri] = useState<string | null>(imageUrl || null);

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', `Image picker error: ${response.errorMessage}`);
      } else if (response.assets?.[0]?.uri) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price.trim() || !categoryId.trim() || !stock.trim()) {
      Alert.alert('Error', 'Name, price, category, and stock are required');
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);
    if (isNaN(priceNum) || isNaN(stockNum)) {
      Alert.alert('Error', 'Price and stock must be valid numbers');
      return;
    }

    try {
      let imageUrl: string | undefined;
      if (imageUri) {
        const uploadedUrl = await uploadImage(imageUri);
        if (!uploadedUrl) {
          Alert.alert('Error', uploadError || 'Please check that your image size is under 3MB.');
          return;
        }
        imageUrl = uploadedUrl;
      }

      const productData = {
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        categoryId: categoryId.trim(),
        stock: stockNum,
      };

      if (product?.itemId) {
        await editProduct(product.itemId, productData, imageUrl);
      } else {
        await addProduct(productData, imageUrl);
      }

      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save product');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{product?.itemId ? 'Edit Product' : 'Create Product'}</Text>
        <Text style={{width:30}}></Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Product Name"
          autoFocus
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="Product Description (optional)"
          multiline
        />
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Price"
          keyboardType="numeric"
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoryId}
            onValueChange={(value) => setCategoryId(value)}
            style={styles.picker}
          >
            {categories.length > 0 ? (
              categories.map((category: Category) => (
                <Picker.Item key={category.id} label={category.name} value={category.id} />
              ))
            ) : (
              <Picker.Item label="No categories available" value="" />
            )}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          value={stock}
          onChangeText={setStock}
          placeholder="Stock"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Image source={require('../../assets/images/image_empty.png')} style={styles.image} />
          )}
          <Text style={styles.imageText}>{imageUri ? 'Change Image' : 'Choose Image (Optional)'}</Text>
        </TouchableOpacity>
        {imageUri && <Text style={styles.imageSelectedText}>Image selected</Text>}
        <CustomButton
          title={uploadLoading ? (product?.itemId ? 'Updating...' : 'Creating...') : (product?.itemId ? 'Update' : 'Create')}
          onPress={handleSubmit}
          animation="pulse"
          duration={200}
          isDisabled={uploadLoading}
          buttonStyle={styles.button}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 150 : 50,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  imageText: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 16,
  },
  imageSelectedText: {
    fontSize: 14,
    color: 'green',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    marginBottom: 10,
  },
});

export default CreateProduct;