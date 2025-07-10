import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { globalStyles } from '../../style/globalStyles';

const ProductScreen = () => {
  const items = [
    { title: 'Apple', description: 'A sweet red fruit' },
    { title: 'Banana', description: 'A yellow tropical fruit' },
    { title: 'Orange', description: 'Citrus fruit rich in vitamin C' },
    { title: 'Grape', description: 'Small and juicy, used in wine' },
    { title: 'Mango', description: 'King of tropical fruits' },
    { title: 'Pineapple', description: 'Spiky outside, sweet inside' },
    { title: 'Papaya', description: 'Soft and orange tropical fruit' },
    { title: 'Watermelon', description: 'Refreshing and full of water' },
    { title: 'Strawberry', description: 'Red and heart-shaped berry' },
    { title: 'Blueberry', description: 'Tiny blue superfruit' },
    { title: 'Raspberry', description: 'Delicate berry with tart taste' },
    { title: 'Blackberry', description: 'Dark and juicy fruit' },
    { title: 'Peach', description: 'Fuzzy skin and sweet flesh' },
    { title: 'Plum', description: 'Soft and tart fruit' },
    { title: 'Kiwi', description: 'Green inside with black seeds' },
    { title: 'Lemon', description: 'Very sour and yellow' },
    { title: 'Lime', description: 'Sour green citrus' },
    { title: 'Coconut', description: 'Hard shell, white flesh, sweet water' },
    { title: 'Cherry', description: 'Small, sweet or tart red fruit' },
    { title: 'Apricot', description: 'Small orange fruit like peach' },
    { title: 'Pomegranate', description: 'Filled with juicy seeds' },
    { title: 'Guava', description: 'Tropical and aromatic' },
    { title: 'Lychee', description: 'Sweet and floral Asian fruit' },
    { title: 'Fig', description: 'Sweet inside with crunchy seeds' },
    { title: 'Cantaloupe', description: 'Orange-fleshed melon' },
    { title: 'Honeydew', description: 'Pale green melon' },
    { title: 'Tangerine', description: 'Small and sweet citrus' },
    { title: 'Nectarine', description: 'Like peach but smooth' },
    { title: 'Passionfruit', description: 'Tangy with jelly seeds' },
    { title: 'Dragonfruit', description: 'Bright skin, speckled inside' },
    { title: 'Jackfruit', description: 'Huge, fibrous, sweet' },
    { title: 'Durian', description: 'Strong smell, soft taste' },
    { title: 'Mulberry', description: 'Dark purple and juicy' },
    { title: 'Gooseberry', description: 'Tart and green or red' },
    { title: 'Cranberry', description: 'Tart red fruit used in juice' },
    { title: 'Starfruit', description: 'Shaped like a star' },
    { title: 'Date', description: 'Very sweet desert fruit' },
    { title: 'Persimmon', description: 'Orange and custardy' },
    { title: 'Currant', description: 'Tiny sour berries' },
    { title: 'Avocado', description: 'Creamy and used in guacamole' },
  ];

  return (
    <ScrollView
      style={globalStyles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyles.contentContainer}
    >
      {items.map((item, index) => (
        <View
          key={item.title}
          style={[
            styles.itemContainer,
            index % 2 === 0 ? styles.itemContainerEven : styles.itemContainerOdd,
          ]}
        >
          <Text style={styles.itemTitle}>{index + 1}. {item.title}</Text>
          <Text style={styles.itemDesc} numberOfLines={1} ellipsizeMode="tail">
            {item.description}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: 'stretch',
    minHeight: 70
  },
  itemContainerEven: {
    backgroundColor: 'rgba(255, 145, 0, 0.1)', // Light orange
  },
  itemContainerOdd: {
    backgroundColor: 'rgba(0, 128, 0, 0.1)', // Light green
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  itemDesc: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
