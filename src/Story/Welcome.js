import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Story from './Story';

class Welcome extends Component {

  state ={
    player: {},
    ally: []
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
  }

  Allystats() {
    if(this.state.player.allyActive === true) {
      fetch(`http://localhost:8089/allies/${this.state.player.allyID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
        })
        .then(r => r.json())
        .then(ally => this.setState({ally: [ally]}))
    }
  }

  render() {
    return (
      <div className="App">
        <ul>Here are your current stats:
          <li>Player = {this.state.player.firstName} {this.state.lastName}</li>
          <li>Max health = {this.state.player.maxHealth}</li>
          <li>Current health = {this.state.player.currentHealth}</li>
          <li>Attack = {this.state.player.attack}</li>
        </ul>
        {this.state.ally.map((ally, index) => {
          return (<ul key={index} >Here are your partner's current stats:
            <li>Partner = {ally.name}</li>
            <li>Max health = {ally.maxHealth}</li>
            <li>Current health = {ally.currentHealth}</li>
            <li>Attack = {ally.attack}</li>
          </ul>);
        })}
        < Story player={this.state.player}/>
        {/* {this.Allystats()} */}
      </div>
    );
  }
}

export default Welcome;
