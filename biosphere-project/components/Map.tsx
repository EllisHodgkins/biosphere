import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import * as React from 'react';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import CreatePostButton from './CreatePostButton';
import CreatePostOverlay from './CreatePostOverlay';

interface LocationState {
  latitude: number;
  longitude: number;
}

const MainMap: React.FC = () => {
  const [location, setLocation] = useState<LocationState | {}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPressed, setIsPressed] = useState(false);

  console.log(isPressed, 'Map.20');

  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== 'granted') {
          console.log('error - this is not working');
          return;
        }

        return Location.getCurrentPositionAsync({});
      })
      .then((location) => {
        setLocation(location.coords);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (isLoading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  if (isPressed) {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
          showsCompass={true}
          userLocationUpdateInterval={60000}
          userLocationFastestInterval={60000}
        ></MapView>
        <CreatePostOverlay />
        <CreatePostButton setIsPressed={setIsPressed} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
        showsCompass={true}
        userLocationUpdateInterval={60000}
        userLocationFastestInterval={60000}
      ></MapView>
      <CreatePostButton setIsPressed={setIsPressed} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 200,
    zIndex: 0,
    elevation: 0,
  },
});

export default MainMap;
