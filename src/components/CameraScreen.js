import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default CameraScreen = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>CameraScreen</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Gallery');
        }}>
        <Text>Click here</Text>
      </TouchableOpacity>
    </View>
  );
};
