import {
  Text,
  View,
  ToastAndroid,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Button,
} from "react-native";
import MapView from "react-native-maps";
import { Marker, Callout } from "react-native-maps";
import * as React from "react";
import * as Location from "expo-location";
import { useState, useEffect, useRef } from "react";
import { getMarkers } from "../api/server";
import { SafeAreaView } from "react-native-safe-area-context";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
import { Entypo } from "@expo/vector-icons";

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

const mancLat = 53.4808;
const mancLong = -2.2426;

const MainMap: React.FC<MapProps> = ({ route, navigation }) => {
  const [location, setLocation] = useState<LocationState | {}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [markers, setMarkers] = useState<Markers[] | []>([]);
  const [photo, setPhoto] = useState(false);
  const [isInfo, setIsInfo] = useState(false);
  const [article, setArticle] = useState({});

  console.log(Object.keys(article))

  const mapRef = useRef(null);

  useEffect(() => {
    getMarkers(location.latitude, location.longitude, location.latitudeDelta, location.longitudeDelta).then((response) => setMarkers(response));
    // getMarkers(1, 2, 3, 4)
  }, [location]);

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
          onPress={()=>{
            setArticle(marker)
            setIsInfo(true)}}
          key={index}
          coordinate={{ latitude: +marker?.lat, longitude: +marker?.long }}
          title={marker?.title}
          image={categories[marker.category]}
        >
          {/* <Callout style={styles.markerCallout} tooltip={true}>
              <View>
                <Text>{marker?.title}</Text>
                <Text>{marker?.description}</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("FullArticle", { params: marker._id });
                  }}
                ></TouchableOpacity>
              </View>
          </Callout> */}
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
  
if(isInfo) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          // latitude: location.latitude,
          // longitude: location.longitude,
          latitude: 53.4808,
          longitude: -2.2426,
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
        <ScrollView style={styles.articleScroll}>
        <View style={styles.articleExitBar}>
          <Entypo name='cross' size={30} onPress={()=>{setIsInfo(false)}} />
        </View>
        <Text>{article.title}</Text>
        <Text>{article.user}</Text>
        <Text>{article.category}</Text>
        {/* <Text>{article.likes}</Text> */}
        <Image style={{height: 200, width: 200}} source={{uri: article.image}}/>
        <Text>{article.description}</Text>
        </ScrollView>
    </View>
  );
} else {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapFull}
        initialRegion={{
          // latitude: location.latitude,
          // longitude: location.longitude,
          latitude: 53.4808,
          longitude: -2.2426,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        ref={mapRef}
        showsUserLocation={true}
        followsUserLocation={true}
        showsCompass={true}
        onRegionChangeComplete={(region) => setLocation(region)}
        userLocationUpdateInterval={60000}
        userLocationFastestInterval={60000}
      >
        {markers && generateMarkers()}
      </MapView>
      <Button
        title="refresh"
        onPress={ ()=> console.log(mapRef.current.addressForCoordinate(location))}></Button>
    </View>
  );
}
  
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
    height: Dimensions.get("window").height * 0.45,
    zIndex: 0,
    elevation: 0,
  },
  mapFull: {
    alignSelf: "flex-start",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    zIndex: 0,
    elevation: 0,
  },
  articleScroll: {
    // alignSelf: "flex-end",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.55,
  },
  articleExitBar: {
    flexDirection: 'row-reverse',
    height: 25,
  },
});

export default MainMap;
