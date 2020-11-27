import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import FileListView from './components/FilesListView';
import CameraScreen from './components/CameraScreen';
import Gallery from './components/Gallery';
import Preview from './components/Preview';
import ResetPassword from './components/ResetPassword';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {} from 'redux';
import {Provider as ReduxProvider} from 'react-redux';
import store from './store';

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'purple',
    accent: 'white',
  },
};

const App = (props) => {
  return (
    <PaperProvider theme={theme}>
      <ReduxProvider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Welcome">
              {() => <SplashScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="FilesList" component={FileListView} />
            <Stack.Screen name="Capture" component={CameraScreen} />
            <Stack.Screen name="Gallery" component={Gallery} />
            <Stack.Screen name="Preview" component={Preview} />
            <Stack.Screen name="PasswordReset" component={ResetPassword} />
          </Stack.Navigator>
        </NavigationContainer>
      </ReduxProvider>
    </PaperProvider>
  );
};
export default App;
