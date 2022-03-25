import {
  Text,
  View,
  ToastAndroid,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Dimensions, Button } from 'react-native';
import MapView from 'react-native-maps';
import * as React from 'react';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

interface LocationState {
  latitude: number;
  longitude: number;
}

interface MapProps {
  navigation: any;
  route: object;
  image?: object;
}

const MainMap: React.FC<MapProps> = ({ image, route, navigation }) => {
  const [location, setLocation] = useState<LocationState | {}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [photo, setPhoto] = useState('');
  

  useEffect(() => {
    if (route.params) {
      setPhoto(`data:image/jpg;base64,${route.params.image.base64}`);
    }
  }, [route]);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== 'granted') {
          ToastAndroid.show(
            'Location permissions required to use this app.',
            ToastAndroid.LONG
          );
          return;
        }

        return Location.getCurrentPositionAsync({});
      })
      .then((location) => {
        if (location) {
          setLocation(location.coords);
          setIsLoading(false);
        }
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
      ></MapView>
      <ScrollView>
        <Image
          style={{ flex: 1, height: 350, width: 350 }}
          source={{ uri: photo }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentBox: {},
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  map: {
    alignSelf: 'flex-start',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 500,
    zIndex: 0,
    elevation: 0,
  },
});

export default MainMap;
