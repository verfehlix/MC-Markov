var State = require('./mcMarkov').State;
var MarkovChain = require('./mcMarkov').MarkovChain;

var fs = require('fs');

var fileName = "lyrics/Kollegah.txt";
var text = fs.readFileSync(fileName, 'utf8').toString();
// var text = "I am not a number! I am a free man!";

//split text into words
var regex = /[ \n]/;
var textArray = text.split(regex);
var wordCount = textArray.length - 1;

var model = {};

for (var i = 0; i < textArray.length - 1; i++) {
	var word = textArray[i];
	var nachfolger = textArray[i+1];

	if(!model[word]){ 
		model[word] = {};
	}

	if(model[word][nachfolger]){
		model[word][nachfolger]++;
	} else {
		model[word][nachfolger] = 1;
	}	
};


for (var wordKey in model) {
	var word = model[wordKey];

	var sum = 0;
	for (var nachfolgerKey1 in word){
		// var nachfolger = word[nachfolgerKey];
		sum += word[nachfolgerKey1];
	}

	for (var nachfolgerKey2 in word){
		word[nachfolgerKey2] = word[nachfolgerKey2] / sum;
	}
};


var states = [];

for (var wordKey in model) {
	var word = model[wordKey];

	var nachfolgeStates = [];
	var nachfolgeStatePropabilites = [];
	for (var nachfolgerKey in word){
		nachfolgeStates.push(nachfolgerKey);
		nachfolgeStatePropabilites.push(word[nachfolgerKey]);
	}

	var state = new State(wordKey, nachfolgeStates, nachfolgeStatePropabilites);

	states.push(state);
};


var markovChain = new MarkovChain(states, "I");

var i = 0;
setInterval(function() {
    console.log(i + " " + markovChain.currentStateId);
    markovChain.goToNextState();
    i++;
}, 250);


// var stateA = new State("A", ["A", "B", "C"], [0.9, 0.05, 0.05]);
// var stateB = new State("B", ["A", "B", "C"], [0.05, 0.9, 0.05]);
// var stateC = new State("C", ["A", "B", "C"], [0.05, 0.05, 0.9]);

// var stateArray = [stateA, stateB, stateC];

// var markovChain = new MarkovChain(stateArray, "A");

// var i = 0;
// setInterval(function() {
//     console.log(i + " " + markovChain.currentStateId);
//     markovChain.goToNextState();
//     i++;
// }, 250);