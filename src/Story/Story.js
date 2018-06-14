import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Story extends Component {

  state ={
    line: "Its time to start your story!",
    choices: [{decision :"Continue reading", nextStoryId: 1}]
  }


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
      if (story.id === 25 || story.id === 31 || story.id === 48 || story.id === 56 || story.id === 47) {
        this.props.activate()
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
