import React, { Component } from 'react';
import FunctionList from "./Functions"
class Story extends Component {
  
  state ={
    line: "Its time to start your story!",
    choices: [{decision :"Continue reading", nextStoryId: 1}],
    correctWayOut: 0
  }

  Selfcompletion = function() {
    const randomTrue = Math.floor(Math.random() * 3) + 1;
    const line = Math.floor(Math.random() * 6 + 61);
    const right = {decision: "Go right",
    correctWayOut: (randomTrue === 1),
    nextStoryId: line}
    const straight = {decision: "Keep straight",
    correctWayOut: (randomTrue === 2),
    nextStoryId: line}
    const left = {decision: "Go left",
    correctWayOut: (randomTrue === 3),
    nextStoryId: line}
    this.setState({choices: [right, straight, left]})
  }.bind(this)

  DamageMove = function() {
    if (this.state.correctWayOut >= 2) {
      const right = {decision: "Go right",
      nextStoryId: 67}
      const straight = {decision: "Keep straight",
      nextStoryId: 67}
      const left = {decision: "Go left",
      nextStoryId: 67}
    this.setState({choices: [right, straight, left]})
    }
    // else if (this.props.allyActive === true ) {
    //   if (this.props.allyID === 1) {
    //     const cont = {decision: "Continue reading",
    //     nextStoryId: 33}
    //     // id 33 for nausicaa or kiki
    //     this.setState({choices: [cont]})
    //   }
    //   else if (this.props.allyID === 2) {
    //     const cont = {decision: "Continue reading",
    //     nextStoryId: 33}
    //     // id 33 for nausicaa or kiki
    //     this.setState({choices: [cont]})
    //   }
    //   else if (this.props.allyID === 3 ) {
    //     const cont = {decision: "Continue reading",
    //     nextStoryId: 42}
    //     this.setState({choices: [cont]})
    //     // from random damage mononoke goes to 
    //     // 42
    //   }
    // }
    else {
      this.Selfcompletion()
    }
    const health = this.props.player.currentHealth - Math.floor((Math.random() * 6) + 1)
    this.props.AdjustHealth(health)
  }

  InitialDamage = function() {
    if(this.props.player.maxHealth > 15) {
      const adjust = this.props.player.currentHealth - Math.floor((Math.random() * 3)+1)
      this.props.AdjustHealth(adjust)
    }
    else {
    this.props.AdjustHealth(null)
    }
  }.bind(this)

  InitialDamageFall = function() {
    const adjust = this.props.player.currentHealth - Math.floor((Math.random() * 6)+2)
    this.props.AdjustHealth(adjust)
  }.bind(this)

  RandomDamage = function() {
    const adjust = this.props.player.currentHealth - Math.floor((Math.random() * 5)+1)
    this.props.AdjustHealth(adjust)
  }.bind(this)

  newStory = function(e) {
    const id = e.target.id
    const bool = e.target.value
    if (bool === "true") {
      this.state.correctWayOut++
    }
    // Get new story line
    fetch(`http://localhost:8089/story/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(r => r.json())
    .then(story => {
      switch(story.id){
        //Least amount of damage for inspecting your bump
        case 3:
          this.InitialDamage();
          break;
        // Double damage for ignoring your injury and falling down  
        case 2:
          this.InitialDamageFall();
          break;
        // Going the wrong way in the forest triggers this damage  
        case 13:
          this.RandomDamage();
          break;
        //Story id's for gaining an ally and adding their stats to yours down below
        case 25:
        case 31:
        case 48:
        case 56:
        case 47:
          this.props.activate(); 
          break;
        // Heals player back to max health
        case 68:
        case 69:
        case 70:
          this.props.heal();
          break;
        }
      this.setState({line: story.line})
    }).then(() => {
      //Handles the escape route when you are without an ally
      switch(parseInt(id)){
        case 61:
        case 62:
        case 63:
        case 64:
        case 65:
        case 66:
        // Checks if you made it out of the maze, otherwise damage and random damage cause
        // This then sets its responses accordingly
          this.DamageMove();
          break;
        case 11:
        case 24:
        case 51:
        // Initializes the random damage and damage line function,
        // This then sets its responses accordingly
          this.Selfcompletion();
          break;
        // Otherwise runs the choices in the json set for that line 
        default:
          this.newChoice(id)
      }
    })
  }.bind(this)

  newChoice =function(id) {
    //Choices for player to next choose from
    fetch(`http://localhost:8089/storyConnections?currentStoryId=${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(r => r.json())
    .then(choices => {

      const defaultChoices = [];
      const specificChoices = [];
      let playerAlly = this.props.player.allyID
      let playerLocation = this.props.player.locationID

      //Location and ally specific vs default choices array loop through all the choices
      //Push to their respective arrays
      choices.forEach(function(choice) {
          if ((choice.allyId === playerAlly ) && (choice.locationId === playerLocation)) {
            specificChoices.push(choice)
          } 
          else if ((choice.allyId === playerAlly) && (choice.locationId === null)) {
            specificChoices.push(choice)
          } 
          else if ((choice.locationId === playerLocation) && (choice.allyId === null)) {
            specificChoices.push(choice)
          } 
          else if ((choice.locationId === null) && (choice.allyId === null)) {
            defaultChoices.push(choice)
          }
        });

        // Checks for more specific choices and runs those instead
        if (specificChoices.length) {
          this.setState({choices: specificChoices})
        }
        // Runs default array if no specific choices
        else {
          this.setState({choices: defaultChoices})
        }
    })
  }.bind(this)

  // Moves the player back to the Ally page to they can change partner characters
  newAlly = function() {
    this.props.props.push({
      pathname: '/Ally',
      // Stores the unique players id so you can referance it in a patch method for their character
      state: {id: this.props.player.id}  
    })
  }.bind(this)

  // Restarts the Welcome component so the whole page doesn't rerender,
  // just Stats and Story and resets to intial state (restarts componentdidmount basically)
  replay = function() { 
    this.props.props.push({
      pathname: '/Welcome',
      //Stores the unique players id so you can referance it in a get fetch in componentdidmount
      state: {id: this.props.player.id}  
    })
  }.bind(this)

  render() {
    if (this.props.player.currentHealth === 0) {
      return (
        <div className="App">
          <h2>{this.state.line}</h2>
          <p>Unfortunately you lost all of your health and died!</p>
          <button onClick={this.replay}>Try again?</button>
          <button onClick={this.newAlly}>Pick a different ally?</button>
        </div>
      );
    }
    else if (this.state.choices.length === 0) {
      return (
        <div className="App">
          <h2>Congrats! {this.props.player.firstName} {this.props.player.lastName}</h2>
          <h2>You have completed the first part of the game!</h2>
          <h3>{this.state.line}</h3>
          <button onClick={this.replay}>Play again?</button>
          <button onClick={this.newAlly}>Pick a different ally?</button>
        </div>
      );
    }
    else{
      return(
        <div className="App">
          <p>{this.state.line.replace("characterName", this.props.player.firstName)}</p>
          {this.state.choices.map((choice, index) => {
            return (<button id={choice.nextStoryId} value={choice.correctWayOut} onClick={this.newStory} key={index}>{choice.decision}</button>);
          })}
      </div>
      )
    }
  }

}

export default Story;
