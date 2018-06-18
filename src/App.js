import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Form from './Player/Form';
import { BrowserRouter as Router, Route, } from 'react-router-dom'
import Ally from './Player/Ally'
import Welcome from './Story/Welcome';
import End from './Story/End';
class App extends Component {


  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to your own adventure story!</h1>
          </header>
          <Route exact path="/Ally" component={Ally} />
          <Route exact path="/" component={Form} />
          <Route exact path="/Welcome" render={(props) => {
            return <Welcome {...props} key={Date.now()} />
          }} />
          <Route exact path="/End" component={End} />
        </div>
      </Router>
    );
  }
}

export default App;
