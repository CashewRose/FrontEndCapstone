import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Stats extends Component {

// Player ally stats
  AllyHandler = function() {
    if (this.props.player.allyActive === true) {
      return (<ul>Here are your partner's current stats:
          <li>Partner = {this.props.ally.name}</li>
          <li>Max health = {this.props.ally.maxHealth}</li>
          <li>Current health = {this.props.ally.currentHealth}</li>
          <li>Attack = {this.props.ally.attack}</li>
        </ul>);
      }
    }.bind(this)

  render() {
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
