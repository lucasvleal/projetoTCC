import React from 'react';
import { Text } from 'react-native';

export class BoldText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'mont-bold' }]} />;
  }
}

export class RegularText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'mont-regular' }]} />;
  }
}

export class LightText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'mont-light' }]} />;
  }
}
