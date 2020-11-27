import {useNavigation} from '@react-navigation/native';
import React, {Component, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image, Alert, NativeModule} from 'react-native';
import {Appbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RSA} from 'react-native-rsa-native';

export default SplashScreen = () => {
  const navigation = useNavigation();
  let userName = null;
  let userPass = '';
  let defaultPass = null;

  const decryptCredentials = async () => {
    try {
      let priKey = await AsyncStorage.getItem('privateKey');
      if (priKey !== null) {
        let encUserName = await AsyncStorage.getItem('userName');
        let encUserPass = await AsyncStorage.getItem('userPass');
        let encDefaultPass = await AsyncStorage.getItem('defaultPass');
        const user = await RSA.decrypt(encUserName, priKey);
        const pass = await RSA.decrypt(encUserPass, priKey);
        const defPass = await RSA.decrypt(encDefaultPass, priKey);
        userName = user;
        userPass = pass;
        defaultPass = defPass;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.Content
          title="Welcome To ScanIt"
          style={{alignItems: 'center'}}
        />
      </Appbar.Header>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image source={require('../icons/MainLogo.png')} />
      </View>

      <TouchableOpacity
        style={{flex: 0.15, alignItems: 'center', justifyContent: 'center'}}
        onPress={async () => {
          try {
            await decryptCredentials();
            if (userName === null && userPass == '' && defaultPass == null) {
              navigation.navigate('Login');
              Alert.alert('All creds are empty');
              return;
            } else {
              if (defaultPass === userPass) {
                navigation.navigate('FilesList', {
                  userName: userName,
                });
              } else {
                Alert.alert(
                  'Saved Credentials are not working please Login Again..!!',
                );
                navigation.navigate('Login');
              }
            }
          } catch (error) {
            console.log(error.message);
          }
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
