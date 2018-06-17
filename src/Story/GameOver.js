import React, { Component } from 'react';
import { withRouter  } from 'react-router-dom';
import Stats from './Stats';

class GameOver extends Component {

  render() {
    // Map must have a unique key in react, I used the second parameter on the map method to specify a unique counter.
    // A button is made for each ally in the json containing their unique allyId and their name
    return (
      <div className="App">
        <p>Unfortunately you lost all of your health and died!</p>
        {/* <Stats /> */}
      </div>
    );
  }
}

export default withRouter(GameOver);