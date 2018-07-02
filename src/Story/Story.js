import React, { Component } from 'react';
class Story extends Component {
  
  // Initial state for starting the game
  state ={
    line: "Its time to start your story!",
    choices: [{decision :"Continue reading", nextStoryId: 1}],
    correctWayOut: 0,
    i: 0
  }

  // Runs a function to set the random maze route
  Selfcompletion = function(newLine) {

    // Makes a random number between 1-3 and sets that so 1 of the 3 booleans are randomly true
    const randomTrue = Math.floor(Math.random() * 3) + 1;

    // Generates a random line between 61-66 which will display why you recieved damage
    let line = Math.floor(Math.random() * 6 + 61);

    // Makes sure that you dont get the same damage reasoning 2X 
    // (Otherwise it wont rerun the typewriter function which wont display buttons for the player to proceed)
    if(line === newLine) {
      this.Selfcompletion(newLine)
    }

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
  DamageMove = function(newLine) {
    // Checks if you have an ally but you went your own way
    if (this.props.player.allyActive === true ) {

      // Checks if you managed to get out by yourself
      if (this.state.correctWayOut >= 2) {
        // Makes new choices that proceed the story,
        const cont = {decision: "Continue reading",
        nextStoryId: 37}
        // Set the new choices for the player
        this.setState({choices: [cont]})
      }  

      // Checks which ally you have and sets you back on track accordingly
      else if (this.props.player.allyID === 1) {
        const cont = {decision: "Continue reading",
        nextStoryId: 33}
        this.setState({choices: [cont]})
      }
      else if (this.props.player.allyID === 2) {
        const cont = {decision: "Continue reading",
        nextStoryId: 33}
        this.setState({choices: [cont]})
      }
      else if (this.props.player.allyID === 3 ) {
        const cont = {decision: "Continue reading",
        nextStoryId: 42}
        this.setState({choices: [cont]})
      }   
    }
    // Checks if you found the right path enough times to make it out sucessfully, 
    else if (this.state.correctWayOut >= 2) {

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
    
    // Otherwise random damage and random damage reason function is run,
    else {
      this.Selfcompletion(newLine)
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

  // Makes a random damage from 2-7 and calls function to adjust player's stats in state above
  InitialDamageFall = function() {
    const adjust = this.props.player.currentHealth - Math.floor((Math.random() * 6)+2)
    this.props.AdjustHealth(adjust)
  }.bind(this)

  // Makes a random damage from 1-5 and calls function to adjust player's stats in state above
  RandomDamage = function() {
    const adjust = this.props.player.currentHealth - Math.floor((Math.random() * 5)+1)
    this.props.AdjustHealth(adjust)
  }.bind(this)

  // Levels up the player's/ally stats for making it sucessfully to this point in the game
  // More points are awarded to the player if they went through without an ally
  // If there is an ally, they also gain a level up
  LevelUp = function() {
    if (this.props.player.allyActive === true) {
      // Random 1-2 point increase on player's attack
      const Pattack = Math.floor((Math.random() * 2)+1)
      // Random 3-5 point increase on player's health
      const Phealth = Math.floor((Math.random() * 3)+3)

      // Random 5-7 point increase on ally's health
      const Ahealth = Math.floor((Math.random() * 3)+5)
      // Random 2-3 point increase on ally's attack
      const Aattack = Math.floor((Math.random() * 2)+2)
      this.props.PlayerUp(Phealth, Pattack)
      this.props.AllyUp(Ahealth, Aattack)
    }
    else {
      // Random 2-3 point increase on player's attack
      const attack = Math.floor((Math.random() * 2)+2)
      // Random 6-8 point increase on player's health
      const health = Math.floor((Math.random() * 3)+6)
      this.props.PlayerUp(health, attack)
    }
  }

  newStory = function(e) {
    //Hide buttons now that they've been selected
    const button = document.getElementById("Buttons");
    button.className = button.className.replace("Show", "Hide")

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
        case 72:
        case 73:
          this.LevelUp()
          break;
        }
        
      // Set the new line for the story 
      this.setState({line: story.line})

    }).then(() => {

      // Handles the escape route when you are without an ally or not following their instructions
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
          this.DamageMove(parseInt(id));
          break;

        // Initializes the random damage and damage line function,
        // This then sets its responses accordingly
        case 11:
        case 24:
        case 51:
        case 75:
          this.Selfcompletion(parseInt(id));
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

  
  // Creates a typewriter like function so the text gets displayed slowly
  typeWriter = function() {
    let txt = this.state.line.replace("characterName", this.props.player.firstName);
    let speed = 60; /* The speed/duration of the effect in milliseconds */
  if (document.getElementById("typewriter") !== null) {
    if(this.state.i < txt.length) {
      document.getElementById("typewriter").innerHTML += txt.charAt(this.state.i);
      this.state.i++;
      setTimeout(this.typeWriter, speed);
    }
    else {
      this.state.i = 0;

      // Buttons only appear after text animation has finished 
      const button = document.getElementById("Buttons")
      button.className = "Show"
    }
  }
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

  // Runs typing animation on the story line only when the line itself updates
  componentDidUpdate(prevProps, prevState) {
    // Typical usage (don't forget to compare state):
    if ((this.state.line !== prevState.line) && this.props.player.currentHealth !== 0) {
      document.getElementById("typewriter").innerHTML = ""
      this.typeWriter();  
    }

  // Runs typing animation on the story line the first time
  }
  componentDidMount() {
    this.typeWriter();
  }


  render() {
    
    // If the player's health is now zero display the last line that caused them to die
    // Tell the character they've lost the game and why, 
    // They then have the option to try again as is or try again with a different ally
    if (this.props.player.currentHealth === 0) {
      return (
        <div className="App">
          <h2>Game Over!</h2>
          <h3>{this.state.line}</h3>
          <p>Unfortunately you lost all of your health and died!</p>
          <button className="Choice" onClick={this.replay}>Try again?</button>
          <button className="Choice" onClick={this.newAlly}>Pick a different ally?</button>
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
          <h2>Congratulations {this.props.player.firstName} {this.props.player.lastName}!</h2>
          <h2>You have completed the first part of the game!</h2>
          <h3>{this.state.line}</h3>
          <button className="Choice" onClick={this.replay}>Play again?</button>
          <button className="Choice" onClick={this.newAlly}>Pick a different ally?</button>
        </div>
      );
    }

    // Run the current line and also run all of the choices they have for that line
    // If you receive a placeholder for character's name, change it to the specific player's first name
    else{
      return(
        <div className="App">
          <p id="typewriter">{}</p>
          <div id="Buttons" className="Hide">
          {this.state.choices.map((choice, index) => {
            return (<button id={choice.nextStoryId} className="Choice" value={choice.correctWayOut} onClick={this.newStory} key={index}>{choice.decision}</button>);
          })}
        </div>
      </div>
      )
    }
  }

}

export default Story;
