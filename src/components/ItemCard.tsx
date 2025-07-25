import { View, Text, Image, StyleSheet } from 'react-native';

const ItemCard = ({ item }) => {
    return (
        <View style={styles.itemCard}>
            <Image
                style={styles.itemImage}
                source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
            />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
                <View style={styles.containPrice}>
                    <Text style={styles.itemPrice}>${item.unitPrice.toFixed(2)}</Text>
                    <Text style={styles.itemTotalPrice}>Total: ${(item.unitPrice * item.quantity).toFixed(2)}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        marginVertical: 8,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
        backgroundColor: '#F5F5F5',
    },
    itemInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    itemDetails: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
    },
    containPrice: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between', // Add this line
        alignItems: 'center',            // Optional: for vertical alignment
    },
    itemPrice: {
        alignItems: 'flex-start',
        fontSize: 16,
        fontWeight: '600',
        color: '#2E7D32',
    },
    itemTotalPrice: {
        alignItems: 'flex-end',
        fontSize: 16,
        fontWeight: '600',
        color: '#2E7D32',
    },
});

export default ItemCard;