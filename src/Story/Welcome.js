import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
      this.SnackBar()
    }
    else if (newAmount <= 0) {
      const damage = this.state.player.currentHealth - newAmount
      this.setState({player: {...this.state.player, currentHealth: 0}})
      this.setState({damage})
      this.SnackBar()
    }
    else {
      const damage = this.state.player.currentHealth - newAmount
      this.setState({player: {...this.state.player, currentHealth: newAmount}})
      this.setState({damage})
      this.SnackBar()
    }
  }.bind(this)

  SnackBar = function() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);
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
    this.setState({player: {...this.state.player, allyActive: true}})
  }.bind(this)

  render() {
    return (
      <div className="App">
        <div id="snackbar">You have taken {this.state.damage} damage</div>
        < Stats player={this.state.player} ally={this.state.ally}/>
        < Story activate={this.AllyActive} AdjustHealth={this.AdjustHealth} player={this.state.player} props={this.props.history}/>
      </div>
    );
  }
}

export default Welcome;
