import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ToastAndroid,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
// import Picker from "@react-native-community/picker"
import { Text, View } from "../components/Themed";
import { useForm, Controller } from "react-hook-form";
import CustomMultiPicker from "react-native-multiple-select-list";
import * as Location from "expo-location";

const tagList = [
  "Invasive",
  "Weed",
  "Indigenous",
  "Planted",
  "Wild",
  "Waterscape",
  "Landscape",
  "Warning/Hazard",
  "Plant",
  "Animal",
  "Pollution",
  "Mammal",
  "Bird",
  "Reptile",
  "Amphibian",
  "Fish",
  "Algae",
  "Moss",
];
const catergories = [
  "Coastal",
  "Freshwater",
  "Grassland",
  "Woodland",
  "Mountain/Hill",
  "Urban",
  "Roadside",
  "Geological",
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
  const [postData, setPostData] = useState<PostData | {}>({});
  const [photo, setPhoto] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [category, setCategory] = useState();

  console.log(postData);

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
        newData.image = `data:image/jpg;base64,${route.params.params.base64}`;
        return newData;
      });
    }
  }, [photo]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() =>
            navigation.navigate("Root", {
              screen: "MapPage",
            })
          }
          style={styles.backButton}
        />
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
        >
          <Picker.Item label="Please select a category" value="0" />

          {catergories.map((category) => (
            <Picker.Item label={category} value={category} key={category} />
          ))}
        </Picker>
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

        {photo ? (
          <Image style={styles.userImage} source={{ uri: photo }} />
        ) : (
          <Image
            style={styles.userImage}
            source={{ uri: "../assets/images/adaptve-icon.png" }}
          />
        )}

        <View style={styles.formContainer}>
          <CustomMultiPicker
            options={tagList}
            search={true} // should show search bar?
            multiple={true} //
            placeholder={"Add a Tag"}
            placeholderTextColor={"#757575"}
            returnValue={"label"} // label or value
            callback={(res) => {
              console.log(res);
              setPostData((currentData) => {
                const newData = { ...currentData };
                newData.tags = res;
                return newData;
              });
            }} // callback, array of selected items
            rowBackgroundColor={"#eee"}
            rowHeight={40}
            rowRadius={5}
            searchIconName="ios-checkmark"
            searchIconColor="black"
            searchIconSize={15}
            iconColor={"#00a2dd"}
            iconSize={15}
            selectedIconName={"ios-checkmark-circle-outline"}
            unselectedIconName={"ios-radio-button-off-outline"}
            scrollViewHeight={100}
          />
        </View>

        <TextInput
          style={styles.paraInput}
          placeholder="Optional Description"
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
          onPress={() =>
            navigation.navigate("Root", {
              screen: "MapPage",
            })
          }
          style={styles.submitButton}
        >
          <Text>Upload</Text>
        </Pressable>

        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  backButton: {
    width: 50,
    height: 30,
    backgroundColor: "green",
  },
  userImage: {
    width: 250,
    height: 250,
  },
  input: {
    height: 40,
    width: 250,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  paraInput: {
    height: 150,
    width: 250,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  formContainer: {
    width: 250,
  },
  submitButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 45,
    borderRadius: 75,
    borderColor: "black",
    borderWidth: 3,
  },
});

export default ModalScreen;
