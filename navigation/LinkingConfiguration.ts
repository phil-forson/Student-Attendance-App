/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList, UserStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList | UserStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Root: {
        screens: {
          
        },
      },
      SignIn: 'signin',
      LogIn: 'login',
      NotFound: '*',

    },
  },
};

export default linking;
