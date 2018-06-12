import React, { Component } from 'react';
import { withRouter} from 'react-router-dom'



class Form extends Component {

  //Function runs when player presses submit
  DataSend = function (e) {
    e.preventDefault()
    // Gets information submitted in the input field and stores it
    const firstName = document.getElementById("firstName").value
    const lastName = document.getElementById("lastName").value
    // Makes random stats for the players health, attack, and location
    const attack = Math.floor((Math.random() * 2))
    const location = Math.floor((Math.random() * 3) + 1)
    const maxHealth = Math.floor((Math.random() * 10) + 10)

  // Sends the information to the json-server  
  fetch("http://localhost:8089/players", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ firstName: firstName, lastName: lastName, maxHealth: maxHealth, attack: attack, currentHealth: maxHealth, allyActive: false, locationID: location })
  })
    .then(r => r.json())
    // Adjusts the URL to end in /Ally and go to that route in the router
    .then( newPerson => this.props.history.push({
      pathname: '/Ally',
      //Stores the unique players id so you can referance it in a get fetch later
      state: {playerId: newPerson.id}  
  }) )
  }.bind(this)


  render() {
    return (
      <div>
        <h2>What is your character's name?</h2>
        <form onSubmit={this.DataSend}>
          <label> Player's First Name:
          <input type="text" placeholder="First Name" id="firstName"></input>
          </label>
          <label> Player's Last Name:
          <input type="text" placeholder="Last Name" id="lastName"></input>
          </label>
          <button type="submit" value="button">Submit</button>
        </form>
      </div>
    );
  }
}

export default withRouter(Form);
