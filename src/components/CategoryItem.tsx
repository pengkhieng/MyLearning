import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface CategoryItemProps {
  item: Category;
  index: number;
  onEdit: (category: Category) => void;
  onDelete: (id: string, name: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  item,
  index,
  onEdit,
  onDelete,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleMenuPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Edit', 'Delete'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
          title: item.name?.trim() || 'Unnamed Category',
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            onEdit(item);
          } else if (buttonIndex === 2) {
            onDelete(item.id, item.name);
          }
        }
      );
    } else {
      setModalVisible(true);
    }
  };

  return (
    <View
      style={[
        styles.itemContainer,
        {
          backgroundColor:
            index % 2 !== 0 ? 'rgba(255, 145, 0, 0.1)' : 'rgba(0, 128, 0, 0.1)',
        },
      ]}
    >
      <View style={styles.itemContent}>
        <View style={styles.containImage}>
          {item.imageUrl && item.imageUrl.trim() !== '' ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require('../assets/images/image_empty.png')}
              style={styles.itemImage}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={styles.textContent}>
          <Text style={styles.itemText}>
            {item.name?.trim() || 'Unnamed Category'}
          </Text>
          {item.description ? (
            <Text
              style={styles.itemDescription}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
          ) : null}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
            <Ionicons name="ellipsis-vertical" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Android Modal */}
      <Modal
        animationType="fade" // Changed from "slide" to "fade"
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
                onEdit(item);
              }}
            >
              <Text style={styles.modalOptionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                onDelete(item.id, item.name);
              }}
            >
              <Text style={[styles.modalOptionText, styles.deleteText]}>
                Delete
              </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 0,
    borderRadius: 6,
    marginBottom: 12,
    alignSelf: 'stretch',
    minHeight: 70,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containImage: {
    minHeight: 75,
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
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

export default CategoryItem;