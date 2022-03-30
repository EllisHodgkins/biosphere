import {
    Text,
    View,
    ToastAndroid,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
  } from 'react-native';
  import { Dimensions, Button } from 'react-native';
  import * as React from 'react';
  import * as Location from 'expo-location';
  import { useState, useEffect, useRef } from 'react';
  import { getMarkers } from '../api/server';
  import { Modalize } from 'react-native-modalize';

  interface ArticleProps {
      navigation: any,
      route: object,
  }

  const FullArticle: React.FC<ArticleProps> = ({ route, navigation }) => {
    return (
        <View>
            <Text>Yay, it works</Text>
        </View>
    )
  }

  export default FullArticle;