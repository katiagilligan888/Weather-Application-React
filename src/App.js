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
      this.setState({
        today: {
          tempLow: Math.floor(response.data.daily.data[0].apparentTemperatureLow), 
          tempHigh: Math.floor(response.data.daily.data[0].apparentTemperatureHigh), 
          icon: response.data.daily.data[0].icon, 
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
    return (
      <div className="App">
        <div className = "weather-info">
          <p>{this.state.location}</p>
          <p>{this.state.time}</p>
          <p>High: {this.state.today.tempHigh} F</p>
          <p>Low: {this.state.today.tempLow} F</p>
        </div>
        <div className = "summary">

          <p> {this.state.today.summary} </p>
        </div>
      </div>
    );
  }
}

export default App;
