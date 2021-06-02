import React, { Component } from 'react';
import { View, Text,SafeAreaView,StyleSheet } from 'react-native';
import FlatListExample from './src/FlatListExample';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatListExample/>
      </SafeAreaView>
    );
  }
}
const styles=StyleSheet.create({
    container:{
      flex:1,
    }
});