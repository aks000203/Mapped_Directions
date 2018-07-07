
import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';


let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var view = [];
var i=1;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      views: [],
      error: null
    };
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        if(this.state.latitude!=0 ){
          view.push(<Marker coordinate={{ latitude: position.coords.latitude,
            longitude: position.coords.longitude,}} title={i.toString()}
        />);}
        this.setState({
          region:{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,},
          views: view,
          error: null,
        });
      },
    (error) => console.log(error.message),
    {enableHighAccuracy: true, timeout: 40000, maximumAge: 1000 },
    );
    
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        view.push(<Marker coordinate={{ latitude: position.coords.latitude,
          longitude: position.coords.longitude,}} title={(i++).toString()}
      />);
        this.setState({
          region:{
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,},
          views: view,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      {enableHighAccuracy: true, maximumAge: 1000, distanceFilter: 50 },
    );
  }
  componentWillUnmount() {
    clearInterval(this.watchId);
  }

  render() {
    return (
      <View>
        <Text>Current Latitude: {this.state.region.latitude}</Text>
        <Text>Current Longitude: {this.state.region.longitude}</Text>
        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
        
    <MapView provider={ PROVIDER_GOOGLE }
        style={ styles.container }
        showsUserLocation={ true }
        initialRegion={{latitude: 28.5821909,
                        longitude: 77.3219138,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                      }}
        zoomEnabled= {true}
      >{this.state.views}</MapView>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  }
})