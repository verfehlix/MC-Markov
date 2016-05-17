var State = require('./mcMarkov').State;
var MarkovChain = require('./mcMarkov').MarkovChain;

var service = {};

var model = {};


function addToModel(text, order){
	//split text into words
	text = text.replace(/(\r\n|\n|\r)/gm," ");
	text = text.replace(/\s\s+/g, ' ');

	var textArray = text.split(" ");
	var wordCount = textArray.length - 1;

	console.log("Adding " + wordCount + " words");

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
	// console.log(JSON.stringify(model));
}

var alreadyCalculatedProbabilities = false;
function calcProbabilities(){
	if (alreadyCalculatedProbabilities) {
		console.log("alreadyCalculatedProbabilities");
		return;
	}
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
	alreadyCalculatedProbabilities = true;
}

function createStates(){
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
	return states;

}


function getMarkovText(amountOfWords, startWord){
	if(!startWord) startWord = Object.keys(model)[Math.floor(Math.random() * Object.keys(model).length - 1)  ];

	calcProbabilities();
	var states = createStates();
	var markovChain = new MarkovChain(states, startWord);

	var resultText = "";
	for (var i = 0; i < amountOfWords; i++) {
		resultText += markovChain.printText + " ";
		markovChain.goToNextState();
	};

	return resultText;

}




service.addToModel = addToModel;
service.calcProbabilities = calcProbabilities;
service.getMarkovText = getMarkovText;

module.exports = service;
