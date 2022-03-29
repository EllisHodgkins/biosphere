import { createIconSetFromFontello } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, Button } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

export default function UploadPhotoScreen({ navigation, route }) {
  return (
    <View style={styles.container}>
      <Button
        title={'Back'}
        onPress={() =>
          navigation.setParams({ test: true }) &
          navigation.navigate(
            'Root',
            { test: true },
            { type: 'navigation', screen: 'CameraScreenPage', params: true }
          )
        }
      />
      <Text style={styles.title}>Photo taken</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
