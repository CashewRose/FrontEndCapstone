export default class Functionlist {
    static Selfcompletion = function() {
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
}