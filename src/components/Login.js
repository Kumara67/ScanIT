import React, {Component, useEffect, useState} from 'react';
import {Appbar, Menu, Divider} from 'react-native-paper';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {updatePassword, updateUserName} from '../actions/actionDefs';
import {RSA} from 'react-native-rsa-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SaveCreds from './SaveCreds';

const regEx = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');
const Login = (props) => {
  // function savePopup() {
  //   Alert.alert('Save Credentials', 'Do you want to save your credentials?', [
  //     {
  //       text: 'Save',
  //       onPress: async () =>
  //         await saveCreds(props.userName, props.userPass, props.defaultPass),
  //     },
  //     {
  //       text: 'Cancel',
  //       onPress: () => false,
  //     },
  //   ]);
  // }

  function validation() {
    const {userName, userPass, defaultPass} = props;
    if (!userName.trim() || !userPass.trim()) {
      props.updateUsername('');
      props.updatePassword('');
      Alert.alert('username and passwords cannot be empty');
      return;
    }

    if (userName.includes('@')) {
      if (!regEx.test(userName)) {
        props.updateUsername('');
        props.updatePassword('');
        Alert.alert('Enter a valid email id');
        return;
      }
    }
    if (
      (userName.toLowerCase().includes('admin') ||
        userName.includes('admin@')) &&
      userPass === defaultPass
      // (await RSA.decrypt(
      //   await AsyncStorage.getItem('defaultPass'),
      //   await AsyncStorage.getItem('privateKey'),
      // ))
    ) {
      Keyboard.dismiss();
      props.navigation.navigate('FilesList', {
        userName: props.userName,
      });
    } else {
      props.updateUserName('');
      props.updatePassword('');
      Alert.alert('Username and Passwords doesnot matched.!!');
    }
  }
  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
        <Appbar.Content title="Login" />
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>

      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.loginText}>
          Login using your Username and Password
        </Text>
        <TextInput
          style={styles.textInput}
          value={props.userName}
          placeholder={'UserName'}
          onChangeText={(user) => props.updateUserName(user)}
        />
        <TextInput
          style={styles.textInput}
          value={props.userPass}
          placeholder={'Password'}
          secureTextEntry={true}
          onChangeText={(Pass) => props.updatePassword(Pass)}
        />
        <TouchableOpacity
          style={styles.passwordResetContainer}
          onPress={() => {
            props.navigation.navigate('PasswordReset');
          }}>
          <Text style={styles.textBasic}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          validation();
        }}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    userName: state.LoginReducer.userName,
    userPass: state.LoginReducer.userPass,
    defaultPass: state.LoginReducer.defaultPass,
    showModal: '',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePassword: (password) => dispatch(updatePassword(password)),
    updateUserName: (userName) => dispatch(updateUserName(userName)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  loginText: {
    flex: 0.09,
    textAlign: 'center',
    width: 250,
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'tahoma',
    marginBottom: 10,
  },
  textInput: {
    width: 300,
    borderRadius: 15,
    borderColor: 'purple',
    borderWidth: 3,
    paddingLeft: 10,
    marginBottom: 10,
  },
  passwordResetContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 35,
  },
  textBasic: {
    textAlign: 'center',
    color: 'purple',
    padding: 4,
    borderRadius: 10,
    fontSize: 15,
    width: 200,
  },
  buttonContainer: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  buttonText: {
    backgroundColor: 'purple',
    textAlign: 'center',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 10,
    fontSize: 20,
    width: 300,
  },
});
