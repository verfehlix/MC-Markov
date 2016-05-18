var State = require('./mcMarkov').State;
var MarkovChain = require('./mcMarkov').MarkovChain;

var service = {};


var allWords = {};
var model = {};


function addToModel(text, order){
	//split text into words
	text = text.replace(/(\r\n|\n|\r)/gm," ");
	text = text.replace(/\s\s+/g, ' ');

	var textArray = text.split(" ");
	var wordCount = textArray.length - 1;

	console.log("Adding " + wordCount + " words");

	for (var i = 0; i < textArray.length - order; i++) {
		if (isNaN(textArray[i])) // no numbers
			allWords[textArray[i]] = "ha";

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

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function findSimilarEnding(word){
	var rappable = require('rappable');

	word = word.replace(/['"“”\[\]\)\(]+/g, '')

	for (var wordKey in allWords) {
		wordKey = wordKey.replace(/['"“”\[\]\)\(]+/g, '')
		if (wordKey.toLowerCase() == word.toLowerCase()) continue;

		if(rappable.isRappable(word, wordKey)){
			console.log( "Found word " +wordKey+ " for  " + word);
			return wordKey;
		}
	}
	return "";

}


function getMarkovText(amountOfWords, options){
	if(!options) options = {};
	if(!options.startWord) options.startWord = Object.keys(model)[Math.floor(Math.random() * Object.keys(model).length - 1)  ];

	calcProbabilities();
	var states = createStates();
	var markovChain = new MarkovChain(states, options.startWord);

	var lastToRhyme;
	var charsSinceLastRhyme = 0;
	var setit = true;

	var resultText = "";
	for (var i = 0; i < amountOfWords; i++) {
		resultText += markovChain.currentText + " ";

		if (options.rhymeEveryXCharacters) {
			if (charsSinceLastRhyme > options.rhymeEveryXCharacters && setit) {
				lastToRhyme = markovChain.currentText;
				resultText += " \n";
				setit = false;
			}

			if (charsSinceLastRhyme>options.rhymeEveryXCharacters*2 ) {
				var rhyme = findSimilarEnding(lastToRhyme);
				resultText += rhyme + " \n";
				charsSinceLastRhyme = 0;
				setit = true;
			}
		}

		if (options.rhymeEveryXWord) {
			if (i % (options.rhymeEveryXWord*2) == 0 && i != 0) {
				var rhyme = findSimilarEnding(lastToRhyme);
				resultText += rhyme;
			}

			if (i == 0 || i % options.rhymeEveryXWord == 0) {
				lastToRhyme = markovChain.currentText;
				resultText += " \n";			
			}
		}
		
		markovChain.goToNextState();
		charsSinceLastRhyme += markovChain.currentText.length;
	};

	return resultText;

}


service.addToModel = addToModel;
service.calcProbabilities = calcProbabilities;
service.getMarkovText = getMarkovText;

module.exports = service;
