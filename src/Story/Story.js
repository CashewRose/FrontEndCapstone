import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Story extends Component {

  state ={
    line: "Its time to start your story!",
    choices: [{decision :"continue reading", nextStoryId: 1}]
  }
  componentDidMount() {
    // fetch(`http://localhost:8089/players/${this.props.location.state.playerId}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // })
    //   .then(r => r.json())
    //   .then(player => this.setState({player: player}))
  }

  newStory = (e) => {
    const id = e.target.id
    fetch(`http://localhost:8089/story/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(r => r.json())
    .then(story => this.setState({line: story.line}))
    .then(this.newChoice(id))
  }

  newChoice =function(id) {
    fetch(`http://localhost:8089/storyConnections?currentStoryId=${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(r => r.json())
    .then(choices => {
        const rightChoice = [];
        let playerAlly = this.props.player.allyID
        let playerLocation = this.props.player.locationID
        choices.forEach(function(choice) {
            if ((choice.allyId === playerAlly ) && (choice.locationId === playerLocation)) {
              rightChoice.push(choice)
            } 
            else if ((choice.allyId === playerAlly) && (choice.locationId === null)) {
              rightChoice.push(choice)
            } 
            else if ((choice.locationId === playerLocation) && (choice.allyId === null)) {
              rightChoice.push(choice)
            } 
            else if ((choice.locationId === null) && (choice.allyId === null)) {
              rightChoice.push(choice)
            }
        });
        this.setState({choices: rightChoice})
    })
  }.bind(this)

  render() {
    return (
      <div className="App" onClick={this.newStory}>
        <p>{this.state.line}</p>
        {this.state.choices.map((choice, index) => {
          return (<button id={choice.nextStoryId} key={index}>{choice.decision}</button>);
        })}
      </div>
    );
  }
}

export default Story;
