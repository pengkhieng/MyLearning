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
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useCategories } from '../../hooks/useCategories';
import { useUploadImage } from '../../hooks/useUploadImage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomButton from '../../components/CustomButton';

type CreateCategoryScreenRouteProp = RouteProp<RootStackParamList, 'CreateCategory'>;

interface CreateCategoryScreenProps {
    route: CreateCategoryScreenRouteProp;
}

const CreateCategory: React.FC<CreateCategoryScreenProps> = ({ route }) => {
    const { data: category } = route.params || {};
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { addCategory, editCategory } = useCategories();
    const { uploadImage, loading: uploadLoading, error: uploadError } = useUploadImage();

    const [productType, setProductType] = useState(category?.category.name || '');
    const [desc, setDesc] = useState(category?.category.description || '');
    const [imageUri, setImageUri] = useState<string | null>(category?.imageUrl || null);

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
        if (!productType.trim()) {
            Alert.alert('Error', 'Category name is required');
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

            const categoryData = {
                name: productType.trim(),
                description: desc.trim(),
            };

            if (category?.id) {
                await editCategory(category.id, categoryData, imageUrl);
            } else {
                await addCategory(categoryData, imageUrl);
            }

            navigation.goBack();
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to save category');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>{category?.id ? 'Edit Category' : 'Create Category'}</Text>
                <Text style={{width:30}}></Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                <TextInput
                    style={styles.input}
                    value={productType}
                    onChangeText={setProductType}
                    placeholder="Category Name"
                    autoFocus
                />
                <TextInput
                    style={[styles.input, styles.descriptionInput]}
                    value={desc}
                    onChangeText={setDesc}
                    placeholder="Description (optional)"
                    multiline
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
                    title={uploadLoading ? (category?.id ? 'Update...' : 'Create...') : (category?.id ? 'Update' : 'Create')}
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
    updateButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
        opacity: 0.6,
    },
    updateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    button: {
        marginBottom: 10,
    },
});

export default CreateCategory;