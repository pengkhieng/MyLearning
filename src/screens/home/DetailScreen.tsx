import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { globalStyles } from '../../style/globalStyles';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DetailScreen = ({ route }: any) => {
  const { title, data, color } = route.params;
  const navigation = useNavigation();

  const renderValue = (item: any, index: number, colors?: string) => {
    if (typeof item === 'object' && !Array.isArray(item)) {
      return Object.entries(item).map(([key, val]) => (
        <Text
          key={key}
          style={[
            styles.itemText,
            {
              marginBottom: 20,
              borderColor: colors ?? 'gray',
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
            },
          ]}
        >
          {key}: {String(val)}
        </Text>
      ));
    } else if (Array.isArray(item)) {
      return (
        <FlatList
          data={item}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.listItem,
                { backgroundColor: colors ?? '#eee' },
              ]}
            >
              {Object.entries(item).map(([key, val]) => (
                <Text key={key} style={styles.itemText}>
                  {key}: {String(val)}
                </Text>
              ))}
            </View>
          )}
        />
      );
    } else {
      return <Text style={styles.itemText}>{JSON.stringify(item)}</Text>;
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.content}>{renderValue(data, 0, color)}</View>
      </View>
    </SafeAreaView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  listItem: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
});
