/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {Paper as PaperProvider} from 'react-native-paper';

AppRegistry.registerComponent(appName, () => App);
