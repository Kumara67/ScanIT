import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import FilesView from './components/FilesView';
import CameraScreen from './components/CameraScreen';
import Gallery from './components/Gallery';
import Preview from './components/Preview';

const Stack = createStackNavigator();

export default App = (props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          options={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: 'purple'},
          }}>
          {() => <SplashScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: 'purple'},
          }}
        />
        <Stack.Screen
          name="FilesList"
          component={FilesView}
          options={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: 'purple'},
          }}
        />
        <Stack.Screen
          name="Capture"
          component={CameraScreen}
          options={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: 'purple'},
          }}
        />
        <Stack.Screen
          name="Gallery"
          component={Gallery}
          options={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: 'purple'},
          }}
        />
        <Stack.Screen
          name="Preview"
          component={Preview}
          options={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: 'purple'},
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
