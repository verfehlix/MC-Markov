var service = {};

var State = function(id, transitionStates, transitionPropabilites) {
    this.id = id;
    this.transitionStates = transitionStates;
    this.transitionPropabilites = transitionPropabilites;
};

var MarkovChain = function(states, initialStateId) {
    this.states = states;

    this.currentStateId = initialStateId;

    this.printText = initialStateId;

    this.getCurrentStateById =  function(id) {
        for (var i = 0; i < this.states.length; i++) {
            if(this.states[i].id === this.currentStateId){
                return this.states[i];
            }
        };
    };

    this.goToNextState =  function() {
        var currentState = this.getCurrentStateById(this.currentStateId);
        
        if(!currentState){
            return;
        }

        var nextStateId = this.transition(currentState.transitionStates, currentState.transitionPropabilites);

        this.printText = nextStateId;

        var newPrefix = (this.currentStateId + " " + nextStateId).split(" ").slice(1).join(" ");

        this.currentStateId = newPrefix;
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

service.State = State;
service.MarkovChain = MarkovChain;

module.exports = service;