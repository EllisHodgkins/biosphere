import { ToastAndroid } from 'react-native';
import { Text, View } from '../components/Themed';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';

interface Props {
  navigation: any;
  libraryVisible: boolean;
  setLibraryVisible: Function;
}

const TakePhoto: React.FC<Props> = ({
  navigation,
  libraryVisible,
  setLibraryVisible,
}) => {
  const [image, setImage] = useState({});

  useEffect(() => {
    if (libraryVisible) {
      ImagePicker.requestMediaLibraryPermissionsAsync()
        .then((permissionResult) => {
          if (!permissionResult.granted) {
            ToastAndroid.show(
              'Please allow gallery permissions in settings',
              ToastAndroid.LONG
            );
            return { cancelled: true };
          }
          return ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,
          });
        })
        .then((result) => {
          if (!result.cancelled) {
            setImage(result);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLibraryVisible(false);
          navigation.goBack();
        });
    }
  }, [libraryVisible]);

  return (
    <View>
      <Text>Loading camera...</Text>
    </View>
  );
};

export default TakePhoto;
