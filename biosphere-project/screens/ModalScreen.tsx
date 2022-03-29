import { StatusBar } from 'expo-status-bar';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ToastAndroid,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text, View } from '../components/Themed';
import CustomMultiPicker from 'react-native-multiple-select-list';
import * as Location from 'expo-location';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const tagList = [
  'Invasive',
  'Weed',
  'Indigenous',
  'Planted',
  'Wild',
  'Waterscape',
  'Landscape',
  'Warning/Hazard',
  'Plant',
  'Animal',
  'Pollution',
  'Mammal',
  'Bird',
  'Reptile',
  'Amphibian',
  'Fish',
  'Algae',
  'Moss',
];
const catergories = [
  'Coastal',
  'Freshwater',
  'Grassland',
  'Woodland',
  'Mountain/Hill',
  'Urban',
  'Roadside',
  'Geological',
];

interface PostData {
  longitude: number;
  latitude: number;
  title: string;
  category: string;
  tags: string[];
  description: string;
  image: string;
  timestamp: string;
}

interface Props {
  navigation: any;
  route: any;
}

const ModalScreen: React.FC<Props> = ({ navigation, route }) => {
  const [postData, setPostData] = useState<PostData | {}>({
    longitude: null,
    latitude: null,
    title: null,
    category: null,
    tags: [],
    description: null,
    image: null,
    timestamp: null,
  });
  const [photo, setPhoto] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState(true);

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
          setPostData((currentData) => {
            const newData = { ...currentData };
            newData.longitude = location.coords.longitude;
            newData.latitude = location.coords.latitude;
            return newData;
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (route.params) {
      setPhoto(`data:image/jpg;base64,${route.params.params.base64}`);
      setPostData((currentData) => {
        const newData = { ...currentData };
        newData.image = photo;
        return newData;
      });
    }
  }, [photo]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() =>
            navigation.navigate('Root', {
              screen: 'MapPage',
            })
          }
          style={styles.backButton}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (
      // @ts-ignore
      postData.title &&
      // @ts-ignore
      postData.longitude &&
      // @ts-ignore
      postData.latitude &&
      // @ts-ignore
      postData.image &&
      // @ts-ignore
      postData.category &&
      // @ts-ignore
      postData.tags
    ) {
      setIsDisabled(false);
    }
  }, [postData]);

  const handleSubmit = (e) => {
    navigation.navigate('Root', {
      screen: 'MapPage',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView nestedScrollEnabled={true}>
      <KeyboardAvoidingView behavior={'padding'}>
        <Text>*Category</Text>
        <Picker
        // @ts-ignore
          selectedValue={postData.category}
          onValueChange={(itemValue) =>
            setPostData((currentData) => {
              const newData = { ...currentData };
              newData.category = itemValue;
              return newData;
            })
          }
        >
          <Picker.Item label="Please select a category" value="0" />

          {catergories.map((category) => (
            <Picker.Item label={category} value={category} key={category} />
          ))}
        </Picker>

        {photo ? (
          <Image style={styles.userImage} source={{ uri: photo }} />
        ) : (
          <View style={styles.placeHolder}>
            <MaterialIcons
              name="add-photo-alternate"
              size={55}
              color={'black'}
              style={styles.iconStyle}
            />
            <Entypo
              onPress={ () => navigation.navigate('Root', { screen: 'CameraPage' })}
              name="camera"
              size={50}
              color={'black'}
              style={styles.iconStyle}
            />
          </View>
        )}

        <Text>*Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          onChangeText={(e) =>
            setPostData((currentData) => {
              const newData = { ...currentData };
              newData.title = e;
              return newData;
            })
          }
        />

        <View style={styles.formContainer}>
          <Text>*Tags</Text>
          <CustomMultiPicker
            options={tagList}
            search={true}
            multiple={true}
            placeholder={'Add a Tag'}
            placeholderTextColor={'#757575'}
            returnValue={'label'}
            callback={(res) => {
              setPostData((currentData) => {
                const newData = { ...currentData };
                newData.tags = res;
                return newData;
              });
            }}
            rowBackgroundColor={'#eee'}
            rowHeight={40}
            rowRadius={5}
            searchIconName="ios-checkmark"
            searchIconColor="black"
            searchIconSize={15}
            iconColor={'#00a2dd'}
            iconSize={15}
            selectedIconName={'ios-checkmark-circle-outline'}
            unselectedIconName={'ios-radio-button-off-outline'}
            scrollViewHeight={100}
          />
        </View>

        <TextInput
          style={styles.paraInput}
          placeholder="Description (Optional)"
          multiline={true}
          onChangeText={(e) =>
            setPostData((currentData) => {
              const newData = { ...currentData };
              newData.description = e;
              return newData;
            })
          }
        />
        <Pressable
          disabled={isDisabled}
          onPress={(e) => handleSubmit(e)}
          style={styles.submitButton}
        >
          <Text>Upload</Text>
        </Pressable>
      </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    width: 50,
    height: 30,
    backgroundColor: 'green',
  },
  userImage: {
    width: 250,
    height: 250,
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  paraInput: {
    height: 80,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  formContainer: {
    width: 300,
  },
  submitButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 35,
    borderRadius: 75,
    borderColor: 'black',
    borderWidth: 3,
  },
  placeHolder: {
    backgroundColor: 'grey',
    alignSelf: 'center',
    height: 250,
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    padding: 30,
  },
});

export default ModalScreen;
