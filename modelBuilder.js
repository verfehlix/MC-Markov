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

var fs = require('fs');

var fileName = "lyrics/Kollegah.txt";

var text = fs.readFileSync(fileName, 'utf8').toString();

var order = 0;

var regex = /[ \n]/;
var textArray = text.split(regex);
var wordCount = textArray.length - 1;

// for (var i = 1; i <= wordCount; i++) {
// 	console.log("Word " + i + " / " + wordCount + " : " + textArray[i]);
// };

var wordOccurences = textArray.reduce(function(fruitsCount, currentFruit){
    if(typeof fruitsCount[currentFruit] !== "undefined"){
      fruitsCount[currentFruit]++; 
      return fruitsCount;
    } else {
        fruitsCount[currentFruit]=1; 
        return fruitsCount;
    }
}, {});

//console.log(JSON.stringify(wordOccurences));
var wordArray = [];
var wordPropabilityArray = [];


for (var word in wordOccurences) {
    // console.log("WORD: " + word + " COUNT " + wordOccurences[word] + " PERCENTAGE " + wordOccurences[word] / wordCount);    		
    wordArray.push(word);
    wordPropabilityArray.push(wordOccurences[word] / wordCount);
}

var getNextWord = function(words, propabilites){
	var sumArray = [];
	var sum = 0;

	for (var i = 0; i < propabilites.length - 1; i++) {
	    sum += propabilites[i];
	    sumArray[i] = sum;
	}

	var r = Math.random();

	for (var i = 0; i < sumArray.length && r >= sumArray[i]; i++);

	return words[i];
};

var resultingText = "";

for (var i = 0; i < 75; i++) {
	resultingText += getNextWord(wordArray, wordPropabilityArray) + " ";
};

console.log(resultingText);