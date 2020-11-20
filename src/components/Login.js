import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default Login = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>LoginScreen</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('FilesList');
        }}>
        <Text>Click here</Text>
      </TouchableOpacity>
    </View>
  );
};
