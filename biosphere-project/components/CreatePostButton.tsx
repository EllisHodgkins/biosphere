import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';

interface Props {
  setIsPressed: React.Dispatch<React.SetStateAction<any>>;}

const CreatePostButton: React.FC<Props> = ({setIsPressed}) => {

  const overlayButton = (e) => {
    console.log(e)
    setIsPressed(true);
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={(e) => overlayButton(e)}>
        <Text style={{ fontSize: 20, color: '#fff' }}>Pick a photo</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 20,
  },
  instructions: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  button: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 50,
  }
});

export default CreatePostButton;
