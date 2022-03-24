import { ToastAndroid } from 'react-native';
import { Text, View } from '../components/Themed';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';

interface Props {
  navigation: any;
  cameraVisible: boolean;
  setCameraVisible: Function;
}

const TakePhoto: React.FC<Props> = ({
  navigation,
  cameraVisible,
  setCameraVisible,
}) => {
  const [image, setImage] = useState({});

  useEffect(() => {
    if (cameraVisible) {
      ImagePicker.requestCameraPermissionsAsync()
        .then((permissionResponse) => {
          if (!permissionResponse) {
            ToastAndroid.show(
              'Please allow camera permissions in settings',
              ToastAndroid.LONG
            );
            return { cancelled: true };
          }
          return ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
          setCameraVisible(false);
          navigation.goBack();
        });
    }
  }, [cameraVisible]);

  return (
    <View>
      <Text>Loading camera...</Text>
    </View>
  );
};

export default TakePhoto;
