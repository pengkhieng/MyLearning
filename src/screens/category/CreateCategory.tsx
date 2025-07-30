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
    TextInput,
    ImageBackground,
} from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useCategories } from '../../hooks/useCategories';
import { useUploadImage } from '../../hooks/useUploadImage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../style/globalStyles';

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

    const [isProductType, setIsProductType] = useState(false);
    const [isDesc, setIsDesc] = useState(false);

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
                <Text style={{ width: 30 }}></Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                <View style={styles.label}>
                    <Text>Category Name </Text>
                    <Text style={styles.required}>*</Text>
                </View>
                <View style={[globalStyles.inputContainer, isProductType && globalStyles.inputFocused]}>
                    <TextInput
                        style={[globalStyles.input, isProductType && { borderColor: colors.primary }]}
                        placeholder="Category Name"
                        placeholderTextColor={colors.placeholderTxt}
                        value={productType}
                        onChangeText={setProductType}
                        keyboardType="default"
                        autoCapitalize="none"
                        onFocus={() => setIsProductType(true)}
                        onBlur={() => setIsProductType(false)}
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
                        value={desc}
                        onChangeText={setDesc}
                        keyboardType="default"
                        autoCapitalize="none"
                        onFocus={() => setIsDesc(true)}
                        onBlur={() => setIsDesc(false)}
                        multiline
                    />
                </View>

                <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
                    <ImageBackground
                        source={imageUri ? { uri: imageUri } : require('../../assets/images/image_empty.png')}
                        style={styles.image}
                        resizeMode="cover"
                    >
                        <Text style={styles.imageText}>{imageUri ? 'Change Image' : 'Choose Image (Optional)'}</Text>
                    </ImageBackground>
                </TouchableOpacity>
                <CustomButton
                    title={uploadLoading ? (category?.id ? 'Update...' : 'Create...') : (category?.id ? 'Update' : 'Create')}
                    onPress={handleSubmit}
                    animation="pulse"
                    duration={200}
                    isDisabled={uploadLoading || productType == ""}
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
        marginBottom: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 8,
        elevation: 0,
        borderWidth: 2,
        borderColor: 'rgba(145, 99, 99, 0.25)',
        paddingHorizontal: 16,
        alignItems: 'center',
        padding: 10,
        position: 'relative',
    },
    image: {
        width: 200,
        height: 200,
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
        borderRadius: 10
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

export default CreateCategory;