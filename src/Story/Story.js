import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Story extends Component {

  state ={
    line: "Its time to start your story!",
    choices: [{decision :"Continue reading", nextStoryId: 1}]
  }

  InitialDamage = function() {
    if(this.props.player.maxHealth > 15) {
      const adjust = this.props.player.currentHealth - Math.floor((Math.random() * 3))
      this.props.AdjustHealth(adjust)
    }
    this.props.AdjustHealth(null)
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
  })
    .then(this.newChoice(id))
  }.bind(this)

  newChoice =function(id) {
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
        // const shift = this.props.props
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
        if (specificChoices.length) {
          this.setState({choices: specificChoices})
        }
        else if ((specificChoices.length === 0) && (defaultChoices.length === 0)) {
          this.setState({choices: defaultChoices})
          const shift = this.props.props
          setTimeout(function(){ shift.push('/End') }, 3000)
        }
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
          return (<button id={choice.nextStoryId} onClick={this.newStory} key={index}>{choice.decision}</button>);
        })}
      </div>
    );
  }
}

export default Story;
