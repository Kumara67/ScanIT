import React, {Component} from 'react';
import {Appbar} from 'react-native-paper';
import {connect} from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';

import {
  updateConfirmPassword,
  updateDefaultPassword,
  updatePassword,
  updateUserName,
} from '../actions/actionDefs';
const ResetPassword = (props) => {
  function validation() {
    const {userName, userPass, conPass} = props;

    if (!userName.trim() || !userPass.trim() || !conPass.trim()) {
      Alert.alert('username and passwords cannot be empty');
      props.updateUsername('');
      props.updatePassword('');
      props.updateConfirmPassword('');
      return;
    }
    if (userName.toLowerCase().includes('admin') && userPass === conPass) {
      Alert.alert('Password sucessfully changed.!!');
      Keyboard.dismiss();
      props.updateUsername('');
      props.updatePassword('');
      props.updateConfirmPassword('');
      props.updateDefaultPassword(conPass);
      props.navigation.navigate('Login');
    } else {
      props.updateUsername('');
      props.updatePassword('');
      props.updateConfirmPassword('');
      Alert.alert('New Password and Confirm Passwords donot match..!!');
      return;
    }
  }

  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
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
          onChangeText={(user) => props.updateUsername(user)}
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
          onChangeText={(nPass) => props.updatePassword(nPass)}
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
          onChangeText={(cPass) => props.updateConfirmPassword(cPass)}
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
            props.navigation.goBack();
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

const mapStateToProps = (state) => {
  return {
    userName: state.LoginReducer.userName,
    userPass: state.LoginReducer.userPass,
    conPass: state.LoginReducer.conPass,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUsername: (userName) => dispatch(updateUserName(userName)),
    updatePassword: (pass) => dispatch(updatePassword(pass)),
    updateConfirmPassword: (conPass) =>
      dispatch(updateConfirmPassword(conPass)),
    updateDefaultPassword: (nPass) => dispatch(updateDefaultPassword(nPass)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
