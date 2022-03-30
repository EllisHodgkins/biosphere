import { StatusBar } from 'expo-status-bar';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ToastAndroid,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { Text, View } from '../components/Themed';
import * as Location from 'expo-location';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { sendPost } from '../api/server';

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
  const [openTags, setOpenTags] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);

  const [category, setCategory] = useState(null);
  const [categoryList, setCategoryList] = useState([
    { label: 'Coastal', value: 'Coastal' },
    { label: 'Freshwater', value: 'Freshwater' },
    { label: 'Grassland', value: 'Grassland' },
    { label: 'Woodland', value: 'Woodland' },
    { label: 'Mountain/Hill', value: 'Mountain/Hill' },
    { label: 'Urban', value: 'Urban' },
    { label: 'Roadside', value: 'Roadside' },
    { label: 'Geological', value: 'Geological' },
    ,
  ]);

  const [tags, setTags] = useState([]);
  const [tagList, setTagList] = useState([
    { label: 'Invasive', value: 'Invasive' },
    { label: 'Weed', value: 'Weed' },
    { label: 'Indigenous', value: 'Indigenous' },
    { label: 'Planted', value: 'Planted' },
    { label: 'Wild', value: 'Wild' },
    { label: 'Waterscape', value: 'Waterscape' },
    { label: 'Landscape', value: 'Landscape' },
    { label: 'Warning/Hazard', value: 'Warning/Hazard' },
    { label: 'Plant', value: 'Plant' },
    { label: 'Animal', value: 'Animal' },
    { label: 'Pollution', value: 'Pollution' },
    { label: 'Mammal', value: 'Mammal' },
    { label: 'Bird', value: 'Bird' },
    { label: 'Reptile', value: 'Reptile' },
    { label: 'Amphibian', value: 'Amphibian' },
    { label: 'Fish', value: 'Fish' },
    { label: 'Algae', value: 'Algae' },
    { label: 'Moss', value: 'Moss' },
  ]);

  const [postData, setPostData] = useState<PostData | {}>({
    longitude: null,
    latitude: null,
    title: null,
    timestamp: null,
    image: null,
    user: '',
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
              params: true
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
      category &&
      // @ts-ignore
      tags
    ) {
      setIsDisabled(false);
    }
  }, [postData]);

  const replaceZ = (date) => {
    return date.replace(/[Z]$/, '+00:00');
  };

  const handleSubmit = () => {
    // @ts-ignore
    const { ...copy } = postData;
    // @ts-ignore
    copy.captured = replaceZ(new Date(Date.now()).toJSON());
    // @ts-ignore
    copy.tags = tags;
    // @ts-ignore
    copy.category = category;
    // @ts-ignore
    copy.user = 'bigShaq';
    sendPost(copy);
    navigation.navigate('Root', { screen: 'MapPage', params: true });
  };

  return (
    <SafeAreaView style={styles.boxContainer}>
      <KeyboardAvoidingView behavior={'padding'}>
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Text>*Category</Text>

            <DropDownPicker
              open={openCategories}
              value={category}
              items={categoryList}
              setOpen={setOpenCategories}
              setValue={setCategory}
              setItems={setCategoryList}
              theme="LIGHT"
              multiple={false}
              mode="BADGE"
              badgeDotColors={[
                '#e76f51',
                '#00b4d8',
                '#e9c46a',
                '#e76f51',
                '#8ac926',
                '#00b4d8',
                '#e9c46a',
              ]}
            />

            {photo ? (
              <Image style={styles.userImage} source={{ uri: photo }} />
            ) : (
              <View style={styles.placeHolder}>
                <Entypo
                  onPress={() =>
                    navigation.navigate('Root', {
                      screen: 'CameraPage',
                      params: true,
                    })
                  }
                  name="camera"
                  size={50}
                  color={'black'}
                  style={styles.iconStyle}
                />
                <MaterialIcons
                  onPress={() =>
                    navigation.navigate('Root', {
                      screen: 'LibraryPage',
                      params: true,
                    })
                  }
                  name="add-photo-alternate"
                  size={55}
                  color={'black'}
                  style={styles.iconStyle}
                />
              </View>
            )}

            <Text>*Title</Text>
            <TextInput
              style={styles.input}
              editable={!openTags}
              placeholder="Choose a title..."
              onChangeText={(e) =>
                setPostData((currentData) => {
                  const newData = { ...currentData };
                  newData.title = e;
                  return newData;
                })
              }
            />
          </View>
          <View style={styles.formContainer}>
            <Text>*Tags</Text>
            <DropDownPicker
              open={openTags}
              value={tags}
              items={tagList}
              setOpen={setOpenTags}
              setValue={setTags}
              setItems={setTagList}
              zIndex={10}
              zIndexInverse={10}
              theme="LIGHT"
              multiple={true}
              mode="BADGE"
              badgeDotColors={[
                '#e76f51',
                '#00b4d8',
                '#e9c46a',
                '#e76f51',
                '#8ac926',
                '#00b4d8',
                '#e9c46a',
              ]}
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
            // disabled={isDisabled}
            onPress={() => handleSubmit()}
            style={styles.submitButton}
          >
            <Text>Upload</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  boxContainer: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
    margin: 10,
    borderWidth: 1,
    position: 'relative',
    left: -10,
  },
  paraInput: {
    height: 80,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    zIndex: -1,
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
    position: 'relative',
    zIndex: -1,
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
