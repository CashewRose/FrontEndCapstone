import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Welcome extends Component {


  componentDidMount() {
    fetch("http://localhost:8089/allies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(r => r.json())
      .then(player => this.setState({ allies: player }))
  }

  render() {
    return (
      <div className="App">
        <p>It's SHOWTIME!</p>
      </div>
    );
  }
}

export default Welcome;
