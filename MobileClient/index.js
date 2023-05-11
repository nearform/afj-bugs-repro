/**
 * @format
 */
import 'isomorphic-webcrypto';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import 'react-native-get-random-values';

AppRegistry.registerComponent(appName, () => App);
