import { StyleSheet, Text, View } from 'react-native';
import { Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import * as React from 'react';
import * as Location from 'expo-location';
import { useState, useEffect, useRef } from 'react';

interface LocationState {
  latitude: number;
  longitude: number;
}

export default function App() {
  const [location, setLocation] = useState<LocationState | {}>({});
  const [isLoading, setIsLoading] = useState(true);

  console.log(location, 'state');

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
        // console.log(location);
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
      />
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
