import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default Preview = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Preview Screen</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Text>Click here to go Back</Text>
      </TouchableOpacity>
    </View>
  );
};
