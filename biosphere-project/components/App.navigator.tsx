import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MainMap from './Map';

const { Navigator, Screen } = createNativeStackNavigator();

const AppNav = () => (
  <NavigationContainer>
    <Navigator initialRouteName="Map">
      <Screen name="Map" component={MainMap}></Screen>
    </Navigator>
  </NavigationContainer>
);

export default AppNav;
