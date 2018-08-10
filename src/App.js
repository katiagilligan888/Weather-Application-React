import React, { Component } from 'react';
import './App.css';
import axios from 'axios'; 
import ReactAnimatedWeather from 'react-animated-weather';

import ClearSky from './clearday.jpg'; 
import ClearNight from './clearnight.jpg' 
import Rain from './rain.jpg'; 
import Snow from './snow.jpg';
import Cloudy from './cloudy.jpg'; 
import PartlyCloudy from './partlycloudy.jpg'; 
import PartlyCloudyDay from './partlycloudyday.jpg'; 
import Windy from './windy.jpg'; 

class App extends Component {
  constructor(){
    super(); 
    this.state = {
        latitude: null, 
        longitude: null, 
        location: null, 
        time: null,
        today: {
          tempLow: null, 
          tempHigh: null, 
          summary: null, 
          icon: null
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
      this.displayTime(); 
      
  }

  componentDidUpdate(prevProps, prevState){

    if(prevState.latitude !== this.state.latitude && prevState.longitude !== this.state.longitude){
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.latitude},${this.state.longitude}&key=AIzaSyAypr-JaVXvORTVxDQuFv0vGhGMeeGr64w`).then(response => {
      this.setState({location: response.data.results[2].formatted_address})
    })
    }

    if(this.state.today.summary === null){
      axios.get(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/2c1796047341253aa42573d20f77f040/${this.state.latitude},${this.state.longitude}`).then(response => {
      
        const icon = response.data.currently.icon;
        const skyCon = icon.split("-").join("_").toUpperCase();
      this.setState({
        today: {
          tempLow: Math.floor(response.data.daily.data[0].apparentTemperatureLow), 
          tempHigh: Math.floor(response.data.daily.data[0].apparentTemperatureHigh), 
          icon: skyCon,
          summary: response.data.hourly.summary
        }
      })
      console.log(response.data)
    })
    
  }  
  }

  displayTime(){
    let time; 
    let newTime; 
    setInterval(()=> {
      time = new Date();
      const options = {hour12: true, hour: "numeric", minute: "numeric", weekday: "long"};
      newTime = time.toLocaleString('en-US', options); 
      this.setState({
        time: newTime
      })
    }, 3000)
    
}


  
  render() {

    let divStyle;
    let skyConColor; 
    let color;
    if(this.state.today.icon === "CLEAR_DAY"){
      divStyle = {
        backgroundImage: `url(${ClearSky})`,
        backgroundSize: "cover"
      }
      skyConColor = "white"
      color = {
        backgroundColor: "rgb(1, 93, 158, 0.6)"
      }
    }else if(this.state.today.icon === "CLEAR_NIGHT"){
      divStyle = {
        backgroundImage: `url(${ClearNight}`, 
        backgroundSize: "cover"
      }
      skyConColor = "white"
      color = {
        backgroundColor: "rgba(24, 60, 69, 0.6)"
      }
    }else if(this.state.today.icon === "RAIN"){
      divStyle = {
        backgroundImage: `url(${Rain}`, 
        backgroundSize: "cover"
      }
      skyConColor = "white"
      color = {
        backgroundColor: "rgba(15, 68, 79, 0.9)"
      }
    }else if (this.state.today.icon === "SNOW"){
        divStyle = {
          backgroundImage: `url(${Snow}`, 
          backgroundSize: "cover"
        }
        skyConColor = "white"
        color = {
          backgroundColor: "rgba(101, 133, 172, 0.9)"
      }
    }else if(this.state.today.icon === "CLOUDY"){
      divStyle = {
        backgroundImage: `url(${Cloudy}`, 
        backgroundSize: "cover"
      }
      skyConColor = "white"
      color = {
        backgroundColor: "rgba(40, 46, 11, 0.7)"
    }
    }else if(this.state.today.icon === "PARTLY_CLOUDY_NIGHT"){
      divStyle = {
        backgroundImage: `url(${PartlyCloudy}`, 
        backgroundSize: "cover"
      }
      skyConColor = "white"
      color = {
        backgroundColor: "rgba(116, 158, 170, 0.9)"
    }
    }else if(this.state.today.icon === "PARTLY_CLOUDY_DAY"){
      divStyle = {
        backgroundImage: `url(${PartlyCloudyDay}`, 
        backgroundSize: "cover"
      }
      skyConColor = "white"
      color = {
        backgroundColor: "rgba(120, 138, 149, 0.9)"
    }
  }else if(this.state.today.icon === "WIND"){
    divStyle = {
      backgroundImage: `url(${Windy}`, 
      backgroundSize: "cover"
    }
    skyConColor = "white"
    color = {
      backgroundColor: "rgba(81, 144, 161, 0.7)"
  }
}
    
    return (
      <div className = "App" style ={divStyle}>
      <div className = "weather-card" style = {color}>
          <div className = "weather-info">
            <div className = "location-info">
              <p className = "location">{this.state.location}</p>
              <p className = "time">{this.state.time}</p>
            </div>
            <div className = "temp-info">
              <p ><span className = "high-temp">{this.state.today.tempHigh} &deg;  F</span></p>
              <p className = "low-temp" >{this.state.today.tempLow} &deg;  F</p>
            </div>
          </div>
          <div className = "summary">
          <ReactAnimatedWeather className = "skycon"
          color={skyConColor}
          size = {200}
          icon={this.state.today.icon}
          autoplay={true}
        />
            <p> {this.state.today.summary} </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
