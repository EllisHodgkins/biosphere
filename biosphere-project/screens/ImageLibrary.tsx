import { ToastAndroid } from 'react-native';
import { Text, View } from '../components/Themed';
import * as ImagePicker from 'expo-image-picker';
import { useEffect } from 'react';

interface Props {
  navigation: any;
  libraryVisible: boolean;
  setLibraryVisible: Function;
  route: object;
}

const TakePhoto: React.FC<Props> = ({
  navigation,
  libraryVisible,
  setLibraryVisible,
  route,
}) => {
  useEffect(() => {
    // @ts-ignore
    if (route.params) {
      setLibraryVisible(true);
    }
  }, [route]);

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
            quality: 0,
            base64: true,
          });
        })
        .then((result) => {
          if (!result.cancelled) {
            navigation.navigate('Modal', {
              params: result,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLibraryVisible(false);
          navigation.navigate('Modal');
        });
    }
  }, [libraryVisible]);

  return <></>;
};

export default TakePhoto;
