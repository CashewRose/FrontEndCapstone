import React, { Component } from 'react';
import logo from './totoro.svg';
import './App.css';
import Form from './Player/Form';
import { BrowserRouter as Router, Route, } from 'react-router-dom'
import Ally from './Player/Ally'
import Welcome from './Story/Welcome';
class App extends Component {


  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/Ally" component={Ally} />
          <Route exact path="/" component={Form} />
          <Route exact path="/Welcome" render={(props) => {
            return <Welcome {...props} key={Date.now()} />
          }} />
          <img src={logo} className="App-logo" alt="logo" />
        </div>
      </Router>
    );
  }
}

export default App;
