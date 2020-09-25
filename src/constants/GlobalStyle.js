import { StyleSheet, Platform } from 'react-native';

import Colors from './Colors';

let sbHeight = Platform.OS === 'ios' ? 20 : 32;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: sbHeight,
      backgroundColor: Colors.ac,
      paddingHorizontal: 15
    },
  });

export default styles;