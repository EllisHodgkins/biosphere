import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { black } from "react-native-paper/lib/typescript/styles/colors";

const CreatePostOverlay: React.FC = () => {
  return (
    <View style={{ height: 250, width: 350, position: "absolute" }}>
      <View style={styles.containerRow}>
        <Text style={styles.p}>Choose how to upload your image:</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.containerColumn}>
          <Text style={styles.p}>Take a photo using your camera</Text>
          <TouchableOpacity style={styles.columnButton}>
          </TouchableOpacity>
        </View>
        <View style={styles.containerColumn}>
          <Text style={styles.p}>Upload a photo from your device</Text>
          <TouchableOpacity style={styles.columnButton}>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    width: 350,
    position: "absolute",
    alignSelf: "center",
    top: 30,
  },
  p: {
    fontSize: 16,
    color: "#000",
    alignSelf: "center",
  },
  containerColumn: {
    flex: 1,
    flexDirection: "column",
  },
  containerRow: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 5,
    alignSelf: "flex-start",
    width: 350,
    height: 30,
  },
  columnButton: {
    width: 50,
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    margin: 20,
    marginBottom: 0,
    borderRadius: 100,
    backgroundColor: "green",
    alignSelf: 'center',
  },
});

export default CreatePostOverlay;
