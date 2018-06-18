import React, { Component } from 'react';
import Story from './Story';
import './Story.css'
import Stats from './Stats';

class Welcome extends Component {

  state ={
    player: {},
    ally: {}
  }
  componentDidMount() {
    fetch(`http://localhost:8089/players/${this.props.location.state.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(r => r.json())
      .then(player => this.setState({player: player}))
      .then(() => this.Allystats())
      
  }

  AdjustHealth = function(newAmount) {
    if(newAmount === null){
      const damage = "0"
      this.setState({damage})
      this.SnackBar("snackbar")
    }
    else if (newAmount <= 0) {
      const damage = this.state.player.currentHealth - newAmount
      this.setState({player: {...this.state.player, currentHealth: 0}})
      this.setState({damage})
      this.SnackBar("snackbar")
    }
    else {
      const damage = this.state.player.currentHealth - newAmount
      this.setState({player: {...this.state.player, currentHealth: newAmount}})
      this.setState({damage})
      this.SnackBar("snackbar")
    }
  }.bind(this)

  SnackBar = function(id) {
    // Get the snackbar DIV
    var x = document.getElementById(id);

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
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
    
  // Makes ally active
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
        < Stats player={this.state.player} ally={this.state.ally}/>
        < Story activate={this.AllyActive} AdjustHealth={this.AdjustHealth} player={this.state.player} props={this.props.history}/>
      </div>
    );
  }
}

export default Welcome;
