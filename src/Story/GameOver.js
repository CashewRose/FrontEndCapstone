import React, { Component } from 'react';
import { withRouter  } from 'react-router-dom';

class GameOver extends Component {

  render() {
    // Map must have a unique key in react, I used the second parameter on the map method to specify a unique counter.
    // A button is made for each ally in the json containing their unique allyId and their name
    return (
      <div className="App">
        <p>Unfortunately you lost!</p>
      </div>
    );
  }
}

export default withRouter(GameOver);