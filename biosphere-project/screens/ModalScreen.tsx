import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { Text, View } from "../components/Themed";
import { useForm, Controller } from "react-hook-form";
import CustomMultiPicker from "react-native-multiple-select-list";

const tagList = ["Invasive", "Plant", "Weed", "Indigenous", "Planted", "Wild"]

interface Props {
  navigation: any;
  route: any;
}

const ModalScreen: React.FC<Props> = ({ navigation, route }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const [photo, setPhoto] = useState<string>("");

  useEffect(() => {
    if (route.params) {
      setPhoto(`data:image/jpg;base64,${route.params.params.base64}`);
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
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Title" />
      {photo ? (
        <Image style={styles.userImage} source={{ uri: photo }} />
      ) : null}

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
        }} // callback, array of selected items
        rowBackgroundColor={"#eee"}
        rowHeight={40}
        rowRadius={5}
        searchIconName="ios-checkmark"
        searchIconColor="blakc"
        searchIconSize={25}
        iconColor={"#00a2dd"}
        iconSize={15}
        selectedIconName={"ios-checkmark-circle-outline"}
        unselectedIconName={"ios-radio-button-off-outline"}
        scrollViewHeight={100}
      />
      </View>

      <TextInput style={styles.paraInput} placeholder="Optional Description"/>
      <Pressable
          onPress={() =>
            navigation.navigate("Root", {
              screen: "MapPage",
            })
          }
          style={styles.submitButton}
        ><Text>Upload</Text></Pressable>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
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

  }
});

export default ModalScreen;
