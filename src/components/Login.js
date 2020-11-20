import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';

export default Login = (props) => {
  const [user, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [userPass, setUserPass] = React.useState('admin');

  const handlePassChange = (nPass) => {
    setUserPass(nPass);
  };
//   React.useEffect(() => {
//     try {
//       if (
//         props.route.hasOwnProperty('params') &&
//         props.route.params.hasOwnProperty('nPass')
//       ) {
//         console.log(`>> Got val: ${props.route.params.nPass}`);
//       }
//     } catch (err) {
//       console.log(err.message);
//     }
//   }, [props.route.params.nPass]);

  function validation() {
    let regEx = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');
    if (!user.trim() || !pass.trim()) {
      Alert.alert('username and passwords cannot be empty');
    }

    if (user.includes('@')) {
      if (!regEx.test(user)) {
        Alert.alert('Enter a valid email id');

        return;
      }
    }
    if (
      (user.includes('admin') ||
        user.includes('admin@') ||
        user.includes('Admin')) &&
      pass === userPass
    ) {
      Keyboard.dismiss();
      props.navigation.navigate('FilesList');
    } else {
      setUser('');
      setPass('');
      Alert.alert('Username and Passwords doesnot matched.!!');
    }
  }
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            flex: 0.09,
            textAlign: 'center',
            width: 350,
            fontWeight: 'bold',
            fontSize: 18,
            fontFamily: 'sans',
          }}>
          Please enter your Username and Password to Login..!!
        </Text>
        <TextInput
          style={{
            width: 300,
            borderRadius: 15,
            borderColor: 'purple',
            borderWidth: 3,
            paddingLeft: 10,
            marginBottom: 10,
          }}
          placeholder={'UserName'}
          onChangeText={(user) => setUser(user)}
        />
        <TextInput
          style={{
            width: 300,
            borderRadius: 15,
            borderColor: 'purple',
            borderWidth: 3,
            paddingLeft: 10,
          }}
          placeholder={'Password'}
          secureTextEntry={true}
          onChangeText={(Pass) => setPass(Pass)}
        />
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
            marginTop: 35,
          }}
          onPress={() => {
            props.navigation.navigate('PasswordReset', {
              callbackPass: handlePassChange,
            });
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: 'purple',
              padding: 4,
              borderRadius: 10,
              fontSize: 15,
              width: 200,
            }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{
          flex: 0.1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
        }}
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
            width: 300,
          }}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};
