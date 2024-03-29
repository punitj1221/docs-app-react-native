import React, { Component } from 'react';
import { Alert, Linking, Dimensions, LayoutAnimation, Text, View, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo';
import * as Permissions from 'expo-permissions';

export default class ScanQRCode extends Component {
  constructor(props){
    super(props);
    this.state = {
        hasCameraPermission: null,
        lastScannedUrl: null,
    };
 }

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    })
  }

  _handleBarCodeRead = result => {
    if (result.data !== this.state.lastScannedUrl) {
      LayoutAnimation.spring();
      this.setState({ lastScannedUrl: result.data });
    }
  }

  _handlePressUrl = () => {
    Alert.alert(
      'Open this URL?',
      this.state.lastScannedUrl,
      [
        {
          text: 'Yes',
          onPress: () => Linking.openURL(this.state.lastScannedUrl),
        },
        { text: 'No', onPress: () => {} },
      ],
      { cancellable: false }
    );
  };

  _handlePressCancel = () => {
    this.setState({ lastScannedUrl: null });
  };

  render() {
    return (
      <View style={styles.container}>

        {this.state.hasCameraPermission &&
                <BarCodeScanner
                  onBarCodeRead={() => {this._handleBarCodeRead}}
                  style={{
                    height: 600,
                    width: 600,
                  }}
                />}
        {this.state.lastScannedUrl &&  
        <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.url} onPress={() => {this._handlePressUrl}}>
            <Text numberOfLines={1} style={styles.urlText}>
                {this.state.lastScannedUrl}
            </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={()=>{this._handlePressCancel}}
                >
            <Text style={styles.cancelButtonText}>
                Cancel
            </Text>
            </TouchableOpacity>
        </View>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
  },
});
