import React, { Component } from 'react';
import './App.css';
import axios from 'axios'; 


class App extends Component {
  constructor(){
    super(); 
    this.state = {
        latitude: null, 
        longitude: null, 
        location: null, 
        today: {
          temp: null, 
          forecast: null, 
        },
        tomorrow: {
          temp: null,
          forecast: null
        }, 
        day_after_tomorrow: {
          temp: null, 
          forecast: null
        }
    }
  }

  getGeoLocation ()  {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position =>{
        let lat = position.coords.latitude; 
        let long = position.coords.longitude;

        this.setState({
          latitude: lat, 
          longitude: long
        })
      })
    }else {
      this.setState({   // New York, New York default setting
        latitude: -74.0060,
        longitude: 40.7128
      })
    }
  }

  componentDidMount(){
      this.getGeoLocation();
      
  }

  componentDidUpdate(prevProps, prevState){

    if(prevState.latitude !== this.state.latitude && prevState.longitude !== this.state.longitude){
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.latitude},${this.state.longitude}&key=AIzaSyAypr-JaVXvORTVxDQuFv0vGhGMeeGr64w`).then(response => {
      this.setState({location: response.data.results[2].formatted_address})
    })
    }


    
    
  }

  
  render() {
    return (
      <div className="App">

      </div>
    );
  }
}

export default App;
