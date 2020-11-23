import React, {Component} from 'react';
import {Appbar} from 'react-native-paper';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';

export default ResetPassword = ({navigation, ...props}) => {
  const [user, setUser] = React.useState('');
  const [nPass, setNpass] = React.useState('');
  const [cPass, setCpass] = React.useState('');
  function validation() {
    if (!user.trim() || !nPass.trim() || !cPass.trim()) {
      Alert.alert('username and passwords cannot be empty');
      return;
    }
    if ((user.includes('admin') || user.includes('Admin')) && nPass === cPass) {
      Keyboard.dismiss();
      navigation.navigate('Login');
      props.route.params.callbackPass(cPass);
    } else {
      Alert.alert('New Password and Confirm Passwords donot match..!!');
    }
  }

  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Reset Password" />
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TextInput
          style={{
            width: 300,
            borderRadius: 15,
            borderColor: 'purple',
            borderWidth: 3,
            paddingLeft: 10,
            marginBottom: 10,
          }}
          placeholder={'User Name'}
          onChangeText={(user) => setUser(user)}
        />
        <TextInput
          style={{
            width: 300,
            borderRadius: 15,
            borderColor: 'purple',
            borderWidth: 3,
            paddingLeft: 10,
            marginBottom: 10,
          }}
          placeholder={'New Password'}
          secureTextEntry={true}
          onChangeText={(nPass) => setNpass(nPass)}
        />
        <TextInput
          style={{
            width: 300,
            borderRadius: 15,
            borderColor: 'purple',
            borderWidth: 3,
            paddingLeft: 10,
          }}
          placeholder={'Confirm password'}
          secureTextEntry={true}
          onChangeText={(cPass) => setCpass(cPass)}
        />
      </View>
      <View
        style={{
          flex: 0.1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            navigation.goBack();
          }}>
          <Text
            style={{
              backgroundColor: 'purple',
              textAlign: 'center',
              color: 'white',
              padding: 10,
              borderRadius: 10,
              elevation: 10,
              fontSize: 20,
              width: 150,
            }}>
            CANCEL
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            validation();
          }}>
          <Text
            style={{
              backgroundColor: 'purple',
              textAlign: 'center',
              color: 'white',
              padding: 10,
              borderRadius: 10,
              elevation: 10,
              fontSize: 20,
              width: 150,
            }}>
            SUBMIT
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
