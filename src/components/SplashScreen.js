import {useNavigation} from '@react-navigation/native';
import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default SplashScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>SplashScreen</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Login');
        }}>
        <Text>Click here</Text>
      </TouchableOpacity>
    </View>
  );
};
