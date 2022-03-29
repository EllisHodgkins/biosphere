import {
  Text,
  View,
  ToastAndroid,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Dimensions, Button } from "react-native";
import MapView from "react-native-maps";
import { Marker, Callout } from "react-native-maps";
import * as React from "react";
import * as Location from "expo-location";
import { useState, useEffect, useRef } from "react";
import { getMarkers } from "../api/server";
import { Modalize } from "react-native-modalize";

interface LocationState {
  latitude: number;
  longitude: number;
}

interface MapProps {
  navigation: any;
  route: object;
  image?: object;
}

interface Markers {
  _id: number;
  title: string;
  image: string;
  captured: any;
  category: string;
  tags: [];
  description: string;
  user: string;
  comments: [];
  likes: number;
  lat: number;
  long: number;
}

const MainMap: React.FC<MapProps> = ({ image, route, navigation }) => {
  const [location, setLocation] = useState<LocationState | {}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [markers, setMarkers] = useState<Markers[] | []>([]);
  const [photo, setPhoto] = useState(false);

  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  let base64Icon = "";

  useEffect(() => {
    // @ts-ignore
    if (route.params) {
      // @ts-ignore
      setPhoto(route.params);
      base64Icon = "data:image/png;base64," + photo;
      console.log(base64Icon);
    }
  }, [route]);

  useEffect(() => {
    // getMarkers(location.latitude, location.longitude, 0.0922, 0.0421)
    getMarkers(1, 2, 3, 4).then((response) => setMarkers(response));
  }, []);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== "granted") {
          ToastAndroid.show(
            "Location permissions required to use this app.",
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

  const categories = {
    Coastal: 0,
    Freshwater: 0,
    Grassland: 0,
    Woodland: 0,
    "Mountain/Hill": 0,
    Urban: 0,
    Roadside: 0,
    Geological: 0,
  };

  const generateMarkers = () => {
    return markers.map((marker, index) => {
      return (
        <Marker
          key={index}
          coordinate={{ latitude: +marker?.lat, longitude: +marker?.long }}
          title={marker?.title}
          image={categories[marker.category]}
        >
          <Callout>
            <View>
              <Text>{marker?.title}</Text>
              <Text>{marker?.description}</Text>

              <TouchableOpacity onPress={onOpen}>
                <Text>More Details</Text>
              </TouchableOpacity>
              <Modalize ref={modalizeRef}>
                <Text>{marker?.description}</Text>
              </Modalize>
            </View>
          </Callout>
        </Marker>
      );
    });
  };

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
          latitude: 53.480671, //location.latitude,
          longitude: -2.23566, //location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
        showsCompass={true}
        userLocationUpdateInterval={60000}
        userLocationFastestInterval={60000}
      >
        {markers && generateMarkers()}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  map: {
    alignSelf: "flex-start",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.7,
    zIndex: 0,
    elevation: 0,
  },
});

export default MainMap;
