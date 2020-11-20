import {useNavigation} from '@react-navigation/native';
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

export default SplashScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1,}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontWeight: 'bold', fontSize: 20, width: 200, textAlign:'center'}}>
          Welcome To..
        </Text>
        <Image source={require('../icons/MainLogo.png')} />
      </View>

      <TouchableOpacity
        style={{flex: 0.1, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => {
          navigation.navigate('Login');
        }}>
        <Text
          style={{
            backgroundColor: 'purple',
            textAlign: 'center',
            color: 'white',
            padding: 10,
            borderRadius: 10,
            elevation: 10,
            fontSize: 20
          }}>
          Click Here To Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};
