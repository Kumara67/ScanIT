import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default FilesView = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>FileView</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Capture');
        }}>
        <Text>Click here</Text>
      </TouchableOpacity>
    </View>
  );
};
