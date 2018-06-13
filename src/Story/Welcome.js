import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Story from './Story';

class Welcome extends Component {

  state ={
    player: {},
    ally: {}
  }
  componentDidMount() {
    fetch(`http://localhost:8089/players/${this.props.location.state.playerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(r => r.json())
      .then(player => this.setState({player: player}))
      .then(() => this.Allystats())
      
  }

  Allystats = function() {
    fetch(`http://localhost:8089/allies/${this.state.player.allyID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
        })
        .then(r => r.json())
        .then(ally => this.setState({ally: ally}))
  }.bind(this)

  AllyHandler = function() {
    if (this.state.player.allyActive === true) {
          return (<ul>Here are your partner's current stats:
          <li>Partner = {this.state.ally.name}</li>
          <li>Max health = {this.state.ally.maxHealth}</li>
          <li>Current health = {this.state.ally.currentHealth}</li>
          <li>Attack = {this.state.ally.attack}</li>
        </ul>);
      }
  }.bind(this)

  AllyActive = function() {
    this.setState({player: {...this.state.player, allyActive: true}})
  }.bind(this)

  render() {
    return (
      <div className="App">
        <ul>Here are your current stats:
          <li>Player = {this.state.player.firstName} {this.state.lastName}</li>
          <li>Max health = {this.state.player.maxHealth}</li>
          <li>Current health = {this.state.player.currentHealth}</li>
          <li>Attack = {this.state.player.attack}</li>
        </ul>
        {this.AllyHandler()}
        < Story activate={this.AllyActive} player={this.state.player}/>
      </div>
    );
  }
}

export default Welcome;
