import {
  Text,
  View,
  ToastAndroid,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Button,
} from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as React from 'react';
import * as Location from 'expo-location';
import { useState, useEffect, useRef } from 'react';
import { getMarkers } from '../api/server';
import { Entypo } from '@expo/vector-icons';
import {
  useFonts,
  RobotoCondensed_400Regular,
  RobotoCondensed_700Bold,
} from '@expo-google-fonts/roboto-condensed';

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

  let [fontsLoaded] = useFonts({
    RobotoCondensed_400Regular,
    RobotoCondensed_700Bold,
  });

  const mapRef = useRef(null);

  useEffect(() => {
    getMarkers(
      location.latitude,
      location.longitude,
      location.latitudeDelta,
      location.longitudeDelta
    ).then((response) => setMarkers(response));
    // getMarkers(1, 2, 3, 4)
  }, [location]);

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

  const categories = {
    Coastal: 0,
    Freshwater: 0,
    Grassland: 0,
    Woodland: 0,
    'Mountain/Hill': 0,
    Urban: 0,
    Roadside: 0,
    Geological: 0,
  };

  const generateMarkers = () => {
    return markers.map((marker, index) => {
      return (
        <Marker
          onPress={() => {
            setArticle(marker);
            setIsInfo(true);
          }}
          key={index}
          coordinate={{ latitude: +marker?.lat, longitude: +marker?.long }}
          title={marker?.title}
          image={categories[marker.category]}
        ></Marker>
      );
    });
  };

  if (isLoading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  if (isInfo) {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
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
            <Text style={styles.articleTitle}>
              {article.title.toUpperCase()}{' '}
            </Text>
          </View>
          <View style={styles.category}>
            <Text
              style={{
                backgroundColor: 'black',
                borderRadius: 70,
                padding: 5,
                width: 75,
                alignSelf: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {article.category}
            </Text>
            <Entypo
              name="cross"
              size={30}
              onPress={() => {
                setIsInfo(false);
              }}
            />
          </View>
          <View style={styles.articleSubInfo}>
            <Text>
              Published: {String(article.captured).substring(0, 10)}, by{' '}
              {article.user}
            </Text>
          </View>
          <View style={styles.articleImageDesc}>
            <Image
              style={{
                width: Dimensions.get('window').width - 20,
                height: Dimensions.get('window').width - 20,
                alignSelf: 'center',
              }}
              source={{ uri: article.image }}
            />
            <View
              style={{
                marginTop: 30,
                backgroundColor: '#353A47',
              }}
            >
              <Text
                style={{
                  flex: 1,
                  flexWrap: 'wrap',
                  marginTop: 20,
                  padding: 20,
                  marginBottom: 5,
                  color: 'white',
                  backgroundColor: '#353A47',
                  textAlign: 'justify',
                  fontFamily: 'RobotoCondensed_400Regular',
                  lineHeight: 17,
                  fontSize: 16,
                }}
              >
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old. Richard McClintock, a
                Latin professor at Hampden-Sydney College in Virginia, looked up
                one of the more obscure Latin words, consectetur, from a Lorem
                Ipsum passage, and going through the cites of the word in
                classical literature, discovered the undoubtable source. Lorem
                Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus
                Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
                written in 45 BC. This book is a treatise on the theory of
                ethics, very popular during the Renaissance. The first line of
                Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line
                in section 1.10.32.
              </Text>

              <View style={styles.tags}>
                {article.tags.map((tag) => {
                  return (
                    <Text
                      style={{
                        backgroundColor: 'black',
                        borderRadius: 70,
                        padding: 5,
                        width: 75,
                        alignSelf: 'center',
                        textAlign: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: 'white',
                        marginRight: 10,
                        marginBottom: 10,
                      }}
                      key={tag}
                    >
                      {tag}
                    </Text>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapFull}
          initialRegion={{
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
          onPress={() =>
            console.log(mapRef.current.addressForCoordinate(location))
          }
        ></Button>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  map: {
    alignSelf: 'flex-start',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.45,
    zIndex: 0,
    elevation: 0,
  },
  mapFull: {
    alignSelf: 'flex-start',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: 0,
    elevation: 0,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'RobotoCondensed_700Bold',
  },
  articleSubInfo: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
    fontSize: 8,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  articleScroll: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.55,
    backgroundColor: '#F9F8F8',
  },
  articleExitBar: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#353A47',
  },
  articleImageDesc: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  category: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
  },
  tags: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
  },
});

export default MainMap;
