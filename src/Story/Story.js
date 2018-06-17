import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

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
      console.log("true")
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
    if (bool === "true"){
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
        case 3:
          this.InitialDamage();
          break;
        case 2:
          this.InitialDamageFall();
          break;
        case 13:
          this.RandomDamage();
          break;
        case 25:
        case 31:
        case 48:
        case 56:
        case 47:
          this.props.activate(); 
          break;
        }
      this.setState({line: story.line})
  }).then(() => {
    //Check route when alone
    switch(parseInt(id)){
      case 61:
      case 62:
      case 63:
      case 64:
      case 65:
      case 66:
      // Run maze or get out of maze function
        this.DamageMove();
        break;
      case 11:
      case 24:
      case 51:
      // When alone run maze
        this.Selfcompletion();
        break;
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
        //Location and person specific vs default choices array loop through all the choices
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
        // Checks for more specific
        if (specificChoices.length) {
          this.setState({choices: specificChoices})
        }
        // if there are no options, run end of game
        else if ((specificChoices.length === 0) && (defaultChoices.length === 0)) {
          this.setState({choices: defaultChoices})
          const shift = this.props.props
          setTimeout(function(){ shift.push('/End') }, 3000)
        }
        // Runs default array if no specific choices
        else {
          this.setState({choices: defaultChoices})
        }
    })
  }.bind(this)

  render() {
    const line = this.state.line.replace("characterName", this.props.player.firstName)
    return (
      <div className="App">
        <p>{line}</p>
        {this.state.choices.map((choice, index) => {
          return (<button id={choice.nextStoryId} value={choice.correctWayOut} onClick={this.newStory} key={index}>{choice.decision}</button>);
        })}
      </div>
    );
  }
}

export default Story;
