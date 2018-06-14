import React, { Component } from 'react';
import { withRouter  } from 'react-router-dom';

class End extends Component {

  render() {
    // Map must have a unique key in react, I used the second parameter on the map method to specify a unique counter.
    // A button is made for each ally in the json containing their unique allyId and their name
    return (
      <div className="App">
        <p>YOU HAVE COMPLETED THE GAME!</p>
      </div>
    );
  }
}

export default withRouter(End);