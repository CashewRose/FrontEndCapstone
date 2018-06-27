import React, { Component } from 'react';
import { Progress, withHelpersModifiers } from 'bloomer';
import './Stats.css'
class Stats extends Component {

  // Player specific ally stats
  AllyHandler = function() {
    // Stats are only displayed if the player has their ally active 
    if (this.props.player.allyActive === true) {
      return (<ul className="partner" >
          <li>{this.props.ally.name}</li>
          <li><Progress isSize='medium' isColor='primary' id="Progress2" value={this.props.ally.currentHealth} max={this.props.ally.maxHealth} /></li>
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
      <div className="Stats container">
        <ul>
          <li>{this.props.player.firstName} {this.props.player.lastName}</li>
          <li><Progress id="Progress1" isSize='medium' isColor='primary' value={this.props.player.currentHealth} max={this.props.player.maxHealth} /> </li>
          <li>Max health = {this.props.player.maxHealth}</li>
          <li>Current health = {this.props.player.currentHealth}</li>
          <li>Attack = {this.props.player.attack}</li>
        </ul>
        {this.AllyHandler()}
      </div>
    );
  }
}

export default withHelpersModifiers(Stats);
