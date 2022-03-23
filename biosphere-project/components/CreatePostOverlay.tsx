import React from 'react';
import { StyleSheet, Text, View, Button, ToastAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

const CreatePostOverlay: React.FC = (): any => {
  const [image, setImage] = useState({});

  console.log(image);

  const takePhoto = () => {
    console.log('2');
  };

  const gallery = () => {
    return ImagePicker.requestMediaLibraryPermissionsAsync()
      .then((permissionResult) => {
        if (permissionResult.granted) {
          return ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
        } else {
          console.log('in else block');
          ToastAndroid.show(
            'You must allow gallery permissions to continue with this function',
            ToastAndroid.LONG
          );
        }
      })
      .then((result) => {
        if (!result.cancelled) {
          setImage(result.uri);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={{ height: 250, width: 350, position: 'absolute' }}>
      <View style={styles.containerRow}>
        <Text style={styles.p}>Choose how to upload your image:</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.containerColumn}>
          <Button title="Take Photo" onPress={takePhoto} />
        </View>
        <View style={styles.containerColumn}>
          <Button title="Gallery" onPress={gallery} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: 350,
    position: 'absolute',
    alignSelf: 'center',
    top: 30,
  },
  p: {
    fontSize: 16,
    color: '#000',
    alignSelf: 'center',
  },
  containerColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  containerRow: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 5,
    alignSelf: 'flex-start',
    width: 350,
    height: 30,
  },
  columnButton: {
    width: 50,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    margin: 20,
    marginBottom: 0,
    borderRadius: 100,
    backgroundColor: 'green',
    alignSelf: 'center',
  },
});

export default CreatePostOverlay;
