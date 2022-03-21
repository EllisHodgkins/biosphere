import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import * as React from 'react'

export default function App() {
  return (
    <View style={styles.container}>
      <MapView initialRegion={{
        latitude: 53.8008,
      longitude: -1.5491,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,}} 
      style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});