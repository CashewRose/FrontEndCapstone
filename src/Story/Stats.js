import React, { Component } from 'react';

class Stats extends Component {

  // Player specific ally stats
  AllyHandler = function() {
    // Stats are only displayed if the player has their ally active 
    if (this.props.player.allyActive === true) {
      return (<ul>Here are your partner's current stats:
          <li>Partner = {this.props.ally.name}</li>
          <li>Max health = {this.props.ally.maxHealth}</li>
          <li>Current health = {this.props.ally.currentHealth}</li>
          <li>Attack = {this.props.ally.attack}</li>
        </ul>);
      }
    }.bind(this)

  // Display stats
  render() {
    // Displays the player's stats and runs the ally function which checks if an ally's stats need to be displayed,
    // if so they are displayed below the player's stats
    return (
      <div className="App">
        <ul>Here are your current stats:
          <li>Player = {this.props.player.firstName} {this.props.player.lastName}</li>
          <li>Max health = {this.props.player.maxHealth}</li>
          <li>Current health = {this.props.player.currentHealth}</li>
          <li>Attack = {this.props.player.attack}</li>
        </ul>
        {this.AllyHandler()}
      </div>
    );
  }
}

export default Stats;
