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
  ImageBackground,
  TextInput,
} from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useProducts } from '../../hooks/useProduct';
import { useCategories } from '../../hooks/useCategories';
import { useUploadImage } from '../../hooks/useUploadImage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Category } from '../../types/CategoryType';
import CustomButton from '../../components/CustomButton';
import { SPACER } from '../../constants/ApiEndpoints';
import { globalStyles } from '../../style/globalStyles';
import { colors } from '../../utils/colors';

interface Product {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl?: string | null;
}

type RouteParams = {
  data?: {
    itemId: string;
    product: Product;
  };
};

type CreateProductScreenRouteProp = RouteProp<RootStackParamList, 'CreateProduct'>;

interface CreateProductScreenProps {
  route: CreateProductScreenRouteProp;
}

const CreateProduct: React.FC<CreateProductScreenProps> = ({ route }) => {
  const { data } = route.params as RouteParams;
  const initialProduct = data?.product || {
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    stock: 0,
    imageUrl: null,
  };

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addProduct, editProduct } = useProducts();
  const { categories } = useCategories();
  const { uploadImage, loading: uploadLoading, error: uploadError } = useUploadImage();

  const [formData, setFormData] = useState({
    name: initialProduct.name,
    description: initialProduct.description,
    price: initialProduct.price.toString(),
    categoryId: initialProduct.categoryId || categories[0]?.id || '',
    stock: initialProduct.stock.toString(),
  });
  const [imageUri, setImageUri] = useState<string | null>(initialProduct.imageUrl || null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isDesc, setIsDesc] = useState(false);
  const [isName, setIsName] = useState(false);
  const [isPrice, setIsPrice] = useState(false);
  const [isStock, setIsStock] = useState(false);



  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', `Image picker error: ${response.errorMessage}`);
        return;
      }
      if (response.assets?.[0]?.uri) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = async () => {
    const { name, price, categoryId, stock } = formData;

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
      let imageUrl: string | null | undefined;
      if (imageUri) {
        imageUrl = await uploadImage(imageUri);
        if (!imageUrl) {
          Alert.alert('Error', uploadError || 'Please check that your image size is under 3MB.');
          return;
        }
      }

      const productData: Product = {
        name: name.trim(),
        description: formData.description.trim(),
        price: priceNum,
        categoryId: categoryId.trim(),
        stock: stockNum,
      };

      if (data?.itemId) {
        await editProduct(data.itemId, productData, imageUrl ?? '');
      } else {
        await addProduct(productData, imageUrl ?? '');
      }

      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save product');
    }
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{data?.itemId ? 'Edit Product' : 'Create Product'}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        nestedScrollEnabled={true}
      >
        <View style={styles.label}>
          <Text>Product Name </Text>
          <Text style={styles.required}>*</Text>
        </View>
        <View style={[globalStyles.inputContainer, isName && globalStyles.inputFocused]}>
          <TextInput
            style={[globalStyles.input, isName && { borderColor: colors.primary }]}
            placeholder="Product Name"
            placeholderTextColor={colors.placeholderTxt}
            value={formData.name}
            onChangeText={(text) => updateFormData('name', text)}
            keyboardType="default"
            autoCapitalize="none"
            onFocus={() => setIsName(true)}
            onBlur={() => setIsName(false)}
          />
        </View>
        <Text style={styles.label}>Description (optional)</Text>

        <View
          style={[
            globalStyles.inputContainer,
            isDesc && globalStyles.inputFocused,
            { height: 100 },
          ]}
        >
          <TextInput
            style={[
              globalStyles.input,
              { height: 95 },
              isDesc && { borderColor: colors.primary },
            ]}
            placeholder="Description (optional)"
            placeholderTextColor={colors.placeholderTxt}
            value={formData.description}
            onChangeText={(text) => updateFormData('description', text)}
            keyboardType="default"
            autoCapitalize="none"
            onFocus={() => setIsDesc(true)}
            onBlur={() => setIsDesc(false)}
            multiline
          />
        </View>

        <View style={styles.label}>
          <Text>Price </Text>
          <Text style={styles.required}>*</Text>
        </View>
        <View style={[globalStyles.inputContainer, isPrice && globalStyles.inputFocused]}>
          <TextInput
            style={[globalStyles.input, isPrice && { borderColor: colors.primary }]}
            placeholder="Product Price"
            placeholderTextColor={colors.placeholderTxt}
            value={formData.price}
            onChangeText={(text) => updateFormData('price', text)}
            keyboardType='numeric'
            autoCapitalize="none"
            onFocus={() => setIsPrice(true)}
            onBlur={() => setIsPrice(false)}
          />
        </View>
        <View style={styles.pickerContainer}>
          <DropDownPicker
            open={isPickerOpen}
            value={formData.categoryId}
            items={categories.map((category: Category) => ({
              label: category.name,
              value: category.id,
            }))}
            setOpen={setIsPickerOpen}
            setValue={(callback) => {
              const value = callback(formData.categoryId);
              updateFormData('categoryId', value);
            }}
            placeholder="Select a category"
            style={styles.picker}
            dropDownContainerStyle={styles.dropDownContainer}
            listMode="SCROLLVIEW"
          />
        </View>
        <View style={styles.label}>
          <Text>Stock </Text>
          <Text style={styles.required}>*</Text>
        </View>
        <View style={[globalStyles.inputContainer, isStock && globalStyles.inputFocused]}>
          <TextInput
            style={[globalStyles.input, isStock && { borderColor: colors.primary }]}
            placeholder="Stock"
            placeholderTextColor={colors.placeholderTxt}
            value={formData.stock}
            onChangeText={(text) => updateFormData('stock', text)}
            keyboardType='number-pad'
            autoCapitalize="none"
            onFocus={() => setIsStock(true)}
            onBlur={() => setIsStock(false)}
          />
        </View>
        <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
          <ImageBackground
            source={imageUri ? { uri: imageUri } : SPACER.EMPTY_IMAGE}
            style={styles.image}
            resizeMode="cover"
          >
            <Text style={styles.imageText}>
              {imageUri ? 'Change Image' : 'Choose Image (Optional)'}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
        <CustomButton
          title={
            uploadLoading
              ? data?.itemId
                ? 'Updating...'
                : 'Creating...'
              : data?.itemId
                ? 'Update'
                : 'Create'
          }
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
    height: SPACER.INPUT_HEIGHT,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  descriptionInput: {
    height: SPACER.DESCRIPTION_HEIGHT,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  pickerContainer: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 0,
    borderWidth: 2,
    borderColor: 'rgba(145, 99, 99, 0.25)',
    width: '100%',
    paddingBottom: 10,
    zIndex: 5
  },
  picker: {
    borderWidth: 0,
    height: SPACER.INPUT_HEIGHT,
    zIndex: 10,
  },
  dropDownContainer: {
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 0,
    borderWidth: 2,
    borderColor: 'rgba(145, 99, 99, 0.6)',
    marginTop: 6,
    backgroundColor: '#fff',
    zIndex: 100
  },
  imageContainer: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 0,
    borderWidth: 2,
    borderColor: 'rgba(145, 99, 99, 0.25)',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: SPACER.IMAGE_SIZE,
    height: SPACER.IMAGE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  label: {
    marginBottom: 10,
    color: "black",
    fontSize: 16,
    flexDirection: 'row', alignItems: 'center'
  },
  required: {
    marginLeft: 2,
    color: 'red',
  },
  button: {
    marginBottom: 10,
  },
});

export default CreateProduct;