import React, { Component } from 'react';
import FunctionList from "./Functions"
class Story extends Component {
  
  // Initial state for starting the game
  state ={
    line: "Its time to start your story!",
    choices: [{decision :"Continue reading", nextStoryId: 1}],
    correctWayOut: 0
  }

  // Runs a function to set the random maze route
  Selfcompletion = function() {

    // Makes a random number between 1-3 and sets that so 1 of the 3 booleans are randomly true
    const randomTrue = Math.floor(Math.random() * 3) + 1;

    // Generates a random line between 61-66 which will display why you recieved damage
    const line = Math.floor(Math.random() * 6 + 61);

    // Makes 3 new choices with the randoms from above
    const right = {decision: "Go right",
    correctWayOut: (randomTrue === 1),
    nextStoryId: line}

    const straight = {decision: "Keep straight",
    correctWayOut: (randomTrue === 2),
    nextStoryId: line}

    const left = {decision: "Go left",
    correctWayOut: (randomTrue === 3),
    nextStoryId: line}

    // Sets the new choices for the player
    this.setState({choices: [right, straight, left]})
  }.bind(this)


  // Checks your progress in the random maze
  DamageMove = function() {
    
    // Checks if you found the right path enough times to make it out sucessfully, 
    if (this.state.correctWayOut >= 2) {

      // Makes new choices that proceed the story,
      const right = {decision: "Go right",
      nextStoryId: 67}
      const straight = {decision: "Keep straight",
      nextStoryId: 67}
      const left = {decision: "Go left",
      nextStoryId: 67}

      // Set the new choices for the player
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

    // Otherwise random damage and random damage reason function is run,
    else {
      this.Selfcompletion()
    }

    // Runs random damage 1-6 and calls function to adjust player's stats in state above
    const health = this.props.player.currentHealth - Math.floor((Math.random() * 6) + 1)
    this.props.AdjustHealth(health)
  }

  // If the player has more than 15 health,
  // Makes a random damage of 1-3 and calls function to adjust player's stats in state above
  // Otherwise player takes no damage
  InitialDamage = function() {
    if(this.props.player.maxHealth > 15) {
      const adjust = this.props.player.currentHealth - Math.floor((Math.random() * 3)+1)
      this.props.AdjustHealth(adjust)
    }
    else {
    this.props.AdjustHealth(null)
    }
  }.bind(this)

  // Makes a random damage from 2-6 and calls function to adjust player's stats in state above
  InitialDamageFall = function() {
    const adjust = this.props.player.currentHealth - Math.floor((Math.random() * 6)+2)
    this.props.AdjustHealth(adjust)
  }.bind(this)

  // Makes a random damage from 1-5 and calls function to adjust player's stats in state above
  RandomDamage = function() {
    const adjust = this.props.player.currentHealth - Math.floor((Math.random() * 5)+1)
    this.props.AdjustHealth(adjust)
  }.bind(this)



  newStory = function(e) {

    // Get the id from the button event which is the id to the next line of the story
    const id = e.target.id

    // If there is a boolean value of true, increase the correctWayOut state by one
    // This is used for the maze if you are alone
    const bool = e.target.value
    if (bool === "true") {
      this.state.correctWayOut++
    }

    // Get new story line based on id
    fetch(`http://localhost:8089/story/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(r => r.json())

    // Return the story with the id specified
    .then(story => {
      // Checks the story line and makes cases if they match
      switch(story.id){

        //Run least/no amount of initial damage for inspecting your bump
        case 3:
          this.InitialDamage();
          break;

        // Run double damage function for ignoring your injury and falling down  
        case 2:
          this.InitialDamageFall();
          break;

        // Going the wrong way in the forest or mountains triggers this damage  
        case 13:
          this.RandomDamage();
          break;

        //Changes ally to active in state and adds their stats as you are now a party
        case 25:
        case 31:
        case 48:
        case 56:
        case 47:
          this.props.activate(); 
          break;
          
        // Runs the function to heal the player back to max health
        case 68:
        case 69:
        case 70:
          this.props.heal();
          break;
        }
        
      // Set the new line for the story 
      this.setState({line: story.line})

    }).then(() => {

      // Handles the escape route when you are without an ally
      // Checks the story line and makes cases if they match
      switch(parseInt(id)){

        // Checks if you found the right path enough times to make it out sucessfully, 
        // Otherwise random damage and random damage reason
        // This then sets the responses accordingly
        case 61:
        case 62:
        case 63:
        case 64:
        case 65:
        case 66:
          this.DamageMove();
          break;

        // Initializes the random damage and damage line function,
        // This then sets its responses accordingly
        case 11:
        case 24:
        case 51:
          this.Selfcompletion();
          break;

        // Otherwise runs the choices in the json set for that line 
        default:
          this.newChoice(id)
      }
    })
  }.bind(this)

  newChoice =function(id) {
    // Get choices for player to next choose from depending on the new line in the story
    fetch(`http://localhost:8089/storyConnections?currentStoryId=${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(r => r.json())

    //Return the fetch with all of the choices for that particular line
    .then(choices => {

      // Array made for default choices
      const defaultChoices = [];

      // Array made for more specific choices
      const specificChoices = [];

      // Get player's location in game and their ally's id
      const playerAlly = this.props.player.allyID
      const playerLocation = this.props.player.locationID

      // Location and ally specific vs default choices, 
      // Loop through all the choices and push to their respective arrays
      choices.forEach(function(choice) {

          // When both location and ally match, move choice to more specific array
          if ((choice.allyId === playerAlly ) && (choice.locationId === playerLocation)) {
            specificChoices.push(choice)
          } 

          // When only ally matches and its not location specific, move choice to more specific array
          else if ((choice.allyId === playerAlly) && (choice.locationId === null)) {
            specificChoices.push(choice)
          } 
          // When only location matches and its not ally specific, move choice to more specific array
          else if ((choice.locationId === playerLocation) && (choice.allyId === null)) {
            specificChoices.push(choice)
          } 
          // When nothing is dependant on an ally or a location, move choice to the default array
          else if ((choice.locationId === null) && (choice.allyId === null)) {
            defaultChoices.push(choice)
          }
        });

        // Checks for more specific choices and runs those instead of default
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
    // If the player's health is now zero display the last line that caused them to die
    // Tell the character they've lost the game and why, 
    // They then have the option to try again as is or try again with a different ally
    if (this.props.player.currentHealth === 0) {
      return (
        <div className="App">
          <h2>Game Over!</h2>
          <p>Unfortunately you lost all of your health and died!</p>
          <h3>{this.state.line}</h3>
          <button onClick={this.replay}>Try again?</button>
          <button onClick={this.newAlly}>Pick a different ally?</button>
        </div>
      );
    }

    // If there are no more lines to run, the player has suceeded in not dying and making it to the end of the game
    // Display last line about updates and a congrats message with player's name
    // Tell the character they've lost the game and why, 
    // They then have the option to try again as is or try again with a different ally
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

    // Run the current line and also run all of the choices they have for that line
    // If you receive a placeholder for character's name, change it to the specific player's first name
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
