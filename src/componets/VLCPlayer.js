import React, {Component} from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
// Import library
import VlcPlayer from 'react-native-vlc-player';
 
export default class App extends Component {
  vlcplayer = React.createRef();
 
  componentDidMount() {
    console.log(this.vlcplayer)
  }
 
  render() {
    return (
      <View
        style={[
          styles.container
        ]}>
        <VlcPlayer
          ref={this.vlcplayer}
          style={{
            width: 300,
            height: 200,
          }}
          paused={false}
          autoplay={true}
          source={{
            uri: 'file:///storage/emulated/0/Download/example.mp4',
            autoplay: true,
            initOptions: ['--codec=avcodec'],
          }}  />
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
});