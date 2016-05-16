var State = require('./mcMarkov').State;
var MarkovChain = require('./mcMarkov').MarkovChain;

var fs = require('fs');

var fileName = "lyrics/trump.txt";
var text = fs.readFileSync(fileName, 'utf8').toString();
// var text = "I am not a number! I am a free man!";

var order = 2;
var amountOfWords = 100;

//split text into words

text = text.replace(/(\r\n|\n|\r)/gm," ");
text = text.replace(/\s\s+/g, ' ');

var textArray = text.split(" ");
var wordCount = textArray.length - 1;

var model = {};

for (var i = 0; i < textArray.length - order; i++) {
	var word = "";
	
	for (var j = i; j < i + order ; j++) {
		word += textArray[j] + " ";
	}

	word = word.trim();

	var nachfolger = textArray[i+order];

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

// console.log(JSON.stringify(model));

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

var randomModelWort = Object.keys(model)[Math.floor(Math.random() * Object.keys(model).length - 1)  ];

var markovChain = new MarkovChain(states, randomModelWort);
// var markovChain = new MarkovChain(states, 'useless."');


var resultText = "";
for (var i = 0; i < amountOfWords; i++) {
	resultText += markovChain.printText + " ";
	markovChain.goToNextState();
};

console.log(resultText);