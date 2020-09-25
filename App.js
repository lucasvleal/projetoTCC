import React, { useState } from 'react';
import { StyleSheet, Text, View, AppRegistry } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

import Main from './src/screens/Main/Main';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  
  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({ 
        // fonts       
        'mont-bold': require('./assets/fonts/Montserrat-Bold.ttf'),
        'mont-regular': require('./assets/fonts/Montserrat-Regular.ttf'),
        'mont-light': require('./assets/fonts/Montserrat-Light.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {    
    console.warn(error);
  };

  _handleFinishLoading = () => {
    setLoaded(true);
  };

  if (loaded) {
    return (
      <Main />
    );
  } else {
    return (
      <AppLoading
        startAsync={this._loadResourcesAsync}
        onError={this._handleLoadingError}
        onFinish={this._handleFinishLoading}
      />
    )
  } 
}

AppRegistry.registerComponent('main', App);
