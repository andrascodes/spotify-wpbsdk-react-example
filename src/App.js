import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    
    this.state = {
      player: undefined
    }
  }

  componentDidMount() {
    window.onSpotifyWebPlaybackSDKReady = this.initializeSpotifyWebPlaybackSDK
  }

  initializeSpotifyWebPlaybackSDK = async () => {
    console.log("Spotify Player ready")

    const Spotify = window.Spotify
    const player = new Spotify.Player({
      name: "Carly Rae Jepsen Player",
      getOAuthToken: function (callback) {
        // Run code to get a fresh access token
        callback("BQAE56ySZpSTV7k3NvWr2RLEEfd8-K3fH4wpSajJH4IljYXNc4cyqsEx206n__JE0ekU1Q6vuzs8tBUkoeHIYaiHdii-KpFr7bmk4uKeVZqDSCO-HL_Fk4qxcIQ3XpZaS9DA2P8tX9JUbVOZyKsJv6zH8hxGD9nzbp2OIA");
      },
      volume: 0.5
    })

    // TODO: setState to Ready Player or Device connecting...
    // Rerender on update, change to a new view, render ConnectPlayer view
    player.on('initialization_error', function (e) {
      console.error("Failed to initialize", e.message);
    })

    player.on('authentication_error', function (e) {
      console.error("Failed to authenticate", e.message);
    })

    player.on("ready", (data) => { 
      console.log("Connected with Device ID", data.device_id) 
    })

    player.on('account_error', function (e) {
      console.error("Failed to validate Spotify account", e.message);
    })

    player.on('playback_error', function (e) {
      console.error("Failed to perform playback", e.message);
    })

    player.on("player_state_ready", (playbackState) => {
      console.log('player state changed')
      const current_track = playbackState.track_window.current_track;
      const current_position = playbackState.position;
      const current_song_duration = playbackState.duration;
    
      console.log("Currently Playing", current_track);
      console.log("Position in Song", current_position);
      console.log("Duration of Song", current_song_duration);
    })

    try {
      const success = await player.connect()
      console.log('Connected')
      console.log(JSON.stringify(success))
      
      const playState = await player.getCurrentState()
      console.log(JSON.stringify(playState))

      this.setState(state => ({
        player
      }))
    }
    catch(error) {
      console.error(error)
    }
  }

  handlePlayButtonClick = e => {
    e.persist()
    e.preventDefault()
    this.state.player.resume()
  }

  handlePauseButtonClick = e => {
    e.persist()
    e.preventDefault()
    this.state.player.pause()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.handlePlayButtonClick}>Play</button>
        <button onClick={this.handlePauseButtonClick}>Pause</button>
      </div>
    );
  }
}

export default App;
