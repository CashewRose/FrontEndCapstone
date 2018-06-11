import React, { Component } from 'react';



class Form extends Component {
  state = {
  }    
  DataSend = function () {
    const firstName = document.getElementById("firstName").value
    const lastName = document.getElementById("lastName").value
    const attack = Math.floor((Math.random() * 2))
    const location = Math.floor((Math.random() * 3) + 1)
    const maxHealth = Math.floor((Math.random() * 10) + 10)
  fetch("http://localhost:8089/players", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ firstName: firstName, lastName: lastName, maxHealth: maxHealth, attack: attack, currentHealth: maxHealth, allyActive: false, locationID: location })
  })
    .then(r => r.json())
    .then(newPerson => this.setState({playerId: newPerson.id}))
  }.bind(this)

  render() {
    return (
      <div>
        <form onSubmit={this.DataSend}>
          <label> Player's First Name:
          <input type="text" placeholder="First Name" id="firstName"></input>
          </label>
          <label> Player's Last Name:
          <input type="text" placeholder="Last Name" id="lastName"></input>
          </label>
          <input type="submit" value="button" /> <p>{this.state.firstName}</p>
        </form>
      </div>
    );
  }
}

export default Form;
