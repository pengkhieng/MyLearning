import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ActionSheetIOS, Modal, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Product } from '../types/Product';
import { Category } from '../types/CategoryType';

interface ProductCardProps {
  product: Product;
  categories: Category[];
  onProductDetail: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string, name: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categories,
  onProductDetail,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleMenuPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Edit', 'Delete'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            onEditProduct(product);
          } else if (buttonIndex === 2) {
            onDeleteProduct(product.itemId, product.name);
          }
        }
      );
    } else {
      setModalVisible(true);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onProductDetail(product)}
    >
      <View style={styles.cardContainer}>
        {/* Three-Dot Menu */}
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Ionicons name="ellipsis-vertical" size={20} color="black" />
        </TouchableOpacity>

        {/* Product Image */}
        {product.imageUrl && product.imageUrl.trim() !== "" ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require('../assets/images/image_empty.png')}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {product.name}
          </Text>
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {product.description}
          </Text>
          <Text style={styles.info}>Price: ${product.price.toFixed(2)}</Text>
          <Text style={styles.info}>Stock: {product.stock}</Text>
          <Text style={styles.info}>
            Category: {categories.find((cat) => cat.id === product.categoryId)?.name || product.categoryId}
          </Text>
        </View>
      </View>

      {/* Android Action Menu */}
      {Platform.OS !== 'ios' && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setModalVisible(false);
                  onEditProduct(product);
                }}
              >
                <Text style={styles.modalOptionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setModalVisible(false);
                  onDeleteProduct(product.itemId, product.name);
                }}
              >
                <Text style={[styles.modalOptionText, styles.deleteText]}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalOptionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%', // Fits two cards per row
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  menuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 1,
    backgroundColor:'white',
    borderRadius: 30,
    opacity:0.6,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    objectFit: 'cover',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  info: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 10,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
  },
  deleteText: {
    color: '#FF3B30',
  },
});

export default ProductCard;