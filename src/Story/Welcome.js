import React, { Component } from 'react';
import Story from './Story';
import './Story.css'
import Stats from './Stats';

class Welcome extends Component {

  // Initial empty state for render pre-componentDidMount
  state ={
    player: {},
    ally: {}
  }

  // Get the player specific information of:
  // firstName, lastName, maxHealth, currentHealth, attack, allyActive, locationID, id, allyID
  componentDidMount() {
    fetch(`http://localhost:8089/players/${this.props.location.state.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(r => r.json())

      // Set the player information into state
      .then(player => this.setState({player: player}))

      // Run the function that does the same thing for the Ally
      .then(() => this.Allystats())  
  }

  // Returns the player back to max health in state
  MaxHeal = function() {
    const max = this.state.player.maxHealth
    this.setState({player: {...this.state.player, currentHealth: max}})
    // Runs the toaster that pops us and tell the user they've healed
    this.SnackBar("snackbarHeal")
  }.bind(this)

  // Adjust the players health based on the damage they've received
  AdjustHealth = function(newAmount) {
    // If they didn't take damage
    if(newAmount === null){
      // Make the damage in state = 0
      const damage = "0"
      this.setState({damage})
    }
    else if (newAmount <= 0) {
      // Calculate the amount of damage they have recieved
      const damage = this.state.player.currentHealth - newAmount

      // Sets their new current health to zero in state (so they don't get negative numbers)
      this.setState({player: {...this.state.player, currentHealth: 0}})

      // Sets damage amount to state
      this.setState({damage})
    }
    else {
      // Calculate the amount of damage they have recieved
      const damage = this.state.player.currentHealth - newAmount

      // Sets their new current health to the amount of health they now have
      this.setState({player: {...this.state.player, currentHealth: newAmount}})

      // Sets damage amount to state
      this.setState({damage})
    }
    // Runs toaster display with damage
    this.SnackBar("snackbar")
  }.bind(this)

  SnackBar = function(id) {
    // Get the snackbar DIV
    var x = document.getElementById(id);

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

  // Get the ally specific information of:
  // name, maxHealth, currentHealth, attack, id
  Allystats = function() {
    fetch(`http://localhost:8089/allies/${this.state.player.allyID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(r => r.json())

    // Sets the ally information into state
    .then(ally => this.setState({ally: ally}))
  }.bind(this)
    
  // Makes ally active so their stats will now be displayed and adjusted accordingly
  AllyActive = function() {
    this.setState({player: {...this.state.player, allyActive: true}}, () => {
      this.SnackBar("snackbarAlly");
    })
  }.bind(this)

  render() {
    return (
      <div className="App">
        <div id="snackbar">You have taken {this.state.damage} damage</div>
        <div id="snackbarAlly">You have gained {this.state.ally.name} as an ally!</div>
        <div id="snackbarHeal">You have returned to maximum health!!</div>
        <div id="snackbarLevelPlayer"> 
          <p>{this.state.player.name} has gained + {} max health!</p>
          <p>{this.state.player.name} has gained + {} to attack!</p>
        </div>
        <div id="snackbarLevelAlly"> 
          <p>{this.state.ally.name} has gained + {} max health!</p>
          <p>{this.state.ally.name} has gained + {} to attack!</p>
        </div>
        < Stats player={this.state.player} ally={this.state.ally}/>
        < Story activate={this.AllyActive} AdjustHealth={this.AdjustHealth} heal={this.MaxHeal} player={this.state.player} props={this.props.history}/>
      </div>
    );
  }
}

export default Welcome;
