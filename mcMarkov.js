var State = function(id, transitionStates, transitionPropabilites) {
    this.id = id;
    this.transitionStates = transitionStates;
    this.transitionPropabilites = transitionPropabilites;
};

var MarkovChain = function(states, initialStateId) {
    this.states = states;

    this.currentStateId = initialStateId;

    this.getCurrentStateById =  function(id) {
        for (var i = 0; i < this.states.length; i++) {
            if(this.states[i].id === this.currentStateId){
                return this.states[i];
            }
        };
    };

    this.goToNextState =  function() {
        var currentState = this.getCurrentStateById(this.currentStateId);
    
        var nextStateId = this.transition(currentState.transitionStates, currentState.transitionPropabilites);

        this.currentStateId = nextStateId;
    };

    this.transition = function(states, propabilites) {
        var sumArray = [];
        var sum = 0;

        for (var i = 0; i < propabilites.length - 1; i++) {
            sum += propabilites[i];
            sumArray[i] = sum;
        }

        var r = Math.random();

        for (var i = 0; i < sumArray.length && r >= sumArray[i]; i++);
        
        return states[i];
    };
};




var stateA = new State("A", ["A", "B", "C"], [0.9, 0.05, 0.05]);
var stateB = new State("B", ["A", "B", "C"], [0.05, 0.9, 0.05]);
var stateC = new State("C", ["A", "B", "C"], [0.05, 0.05, 0.9]);

var markovChain = new MarkovChain([stateA, stateB, stateC], "A");

var i = 0;
setInterval(function() {
    console.log(i + " " + markovChain.currentStateId);
    markovChain.goToNextState();
    i++;
}, 250);