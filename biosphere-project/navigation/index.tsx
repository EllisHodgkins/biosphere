/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */

import { useState } from 'react';

//Icons
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderBackButton } from '@react-navigation/elements';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

// Custom properties from the template
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';

// Screens
import NotFoundScreen from '../screens/NotFoundScreen';
import MapScreen from '../screens/MapScreen';
import CameraScreen from '../screens/CameraScreen';
import ImageLibrary from '../screens/ImageLibrary';
import UploadPhoto from '../screens/UploadPhoto';

import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
  PagesParamList,
} from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
      {/* <Stack.Screen
        name="Pages"
        component={NativeStackNavigator}
      /> */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [libraryVisible, setLibraryVisible] = useState(false);

  return (
    <BottomTab.Navigator
      initialRouteName="MapPage"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="MapPage"
        component={MapScreen}
        options={({ navigation }: RootTabScreenProps<'MapPage'>) => ({
          title: 'Map',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="map-marked" size={24} color={color} />
          ),

          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            />
          ),
        })}
      />

      <BottomTab.Screen
        name="CameraPage"
        // component={() => <CameraScreen clicked={1}/>}
        initialParams={{ test: false }}
        options={{
          title: 'Take a photo',
          tabBarIcon: ({ color }) => (
            <Entypo name="camera" size={24} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            setCameraVisible(true);
          },
        }}
      >
        {(props) => (
          <CameraScreen
            {...props}
            cameraVisible={cameraVisible}
            setCameraVisible={setCameraVisible}
          />
        )}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="LibraryPage"
        options={{
          title: 'Choose a photo',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="add-photo-alternate" size={24} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            setLibraryVisible(true);
          },
        }}
      >
        {(props) => (
          <ImageLibrary
            {...props}
            libraryVisible={libraryVisible}
            setLibraryVisible={setLibraryVisible}
          />
        )}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  );
}

// const PageStack = createNativeStackNavigator<PagesParamList>()
// function NativeStackNavigator({ navigation: {setParams}, navigation }) {

//   return (
//     <PageStack.Navigator
//       initialRouteName="UploadPhoto"
//     >
//       <PageStack.Screen
//         name="UploadPhoto"
//         component={UploadPhoto}
//       />
//     </PageStack.Navigator>
//   )
// }

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
