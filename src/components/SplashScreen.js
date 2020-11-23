import {useNavigation} from '@react-navigation/native';
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import { Appbar } from 'react-native-paper';

export default SplashScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1,}}>
     <Appbar.Header>
      <Appbar.Content title="Welcome To ScanIt" style={{alignItems:'center',}}/>
    </Appbar.Header>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        
        <Image source={require('../icons/MainLogo.png')} />
      </View>

      <TouchableOpacity
        style={{flex: 0.15, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => {
          navigation.navigate('Login');
        }}>
        <Text
          style={{
            backgroundColor: 'purple',
            textAlign: 'center',
            color: 'white',
            padding: 10,
            borderRadius: 15,
            elevation: 10,
            fontSize: 20,
            width: 200,
          }}>
          Let's Begin!!
        </Text>
      </TouchableOpacity>
    </View>
  );
};
