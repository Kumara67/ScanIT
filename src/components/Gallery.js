import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default Gallery = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Gallery Screen</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Preview');
        }}>
        <Text>Click here</Text>
      </TouchableOpacity>
    </View>
  );
};
