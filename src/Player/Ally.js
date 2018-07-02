import React, { Component } from 'react';
import { withRouter  } from 'react-router-dom';
import Kiki from '../Kiki.png';
import Nausicaa from '../Nausicaa.jpg';
import Mononoke from '../Mononoke.jpg';
import './Ally.css'

class Ally extends Component {

// Supply an empty initial state with an array named allies for the first time render loads. Render always loads once before componentDidMount()
  state = {
    allies: []
  }

  DefineCharacters = (e) => {
    // Fetch is then run finding the specific player's id from the playerId that was saved in forms. It is passed into the end of the URL with that paramater to specify where the updated information needs to go.
    fetch(`https://frontendcapstone.herokuapp.com/players/${this.props.location.state.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
    // Event.target.id returns a string for id, so parseInt is required to convert it back into a number before sending it to the json
      body: JSON.stringify({allyID: parseInt(e.target.id)})
    })
    // Router moves the player into the Welcome.js and provides them with their personal playerId
    .then(() => this.props.history.push({
      pathname: '/Welcome',
      state: {id: this.props.location.state.id}}))
  }


  componentDidMount() {
    // Pull allies from the json file
    fetch("https://frontendcapstone.herokuapp.com/allies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(r => r.json())
    // After converting the response to json format, save the recieved objects into the empty allies array in state
      .then(player => this.setState({ allies: player }))
  }

  render() {
    // Map must have a unique key in react, I used the second parameter on the map method to specify a unique counter.
    // A button is made for each ally in the json containing their unique allyId and their name
    return (
      <div className="AllyContainer">
        <h2>Pick your helper character!</h2>
        {this.state.allies.map((name, index) => {
            if (name.id === 1) {
            return (
            <div className="AllyPick">
              <img src={Kiki} alt="A girl is flying on a broom in the sky"></img>
              <button id={name.id} className='ally' key={index} onClick={this.DefineCharacters}>{name.name}</button>
            </div>);
            }
            else if (name.id === 2) {
            return (
            <div className="AllyPick">
              <img src={Nausicaa} alt="A girl is sitting on an airplane"></img>
              <button id={name.id} className='ally' key={index} onClick={this.DefineCharacters}>{name.name}</button>
            </div>);
            }
            else if (name.id === 3) {
            return (
            <div className="AllyPick">
              <img src={Mononoke} alt="A girl wearing an animal mask and sporting tribal tattoos"></img>
              <button id={name.id} className='ally' key={index} onClick={this.DefineCharacters}>{name.name}</button>
            </div>);
            }
        })}
      </div>
    );
  }
}

export default withRouter(Ally);
