var _ = require('lodash');
var MarkovChain = require('./mcMarkov').MarkovChain;

var service = {};


var allWords = {};
var model = {};
// var modelOrder1 = {};

function addToModels(text, order){
	addToModel(text, 1, model);
	addToModel(text, 2, model);
}

function cleanupArray(arr){
	//cleanup
	for (var i = arr.length; i--> 0 ;) {
		if(arr[i].trim().length == 1 && arr[i].trim().match(/^[A-Za-z]/i) == null) {
			arr.splice(i, 1);
		}
	}
	return arr;

}

function addToModel(text, order, model){
	//split text into words
	text = text.replace(/(\r\n|\n|\r)/gm," ");
	text = text.replace(/\s\s+/g, ' ');

	var textArray = text.split(" ");

	cleanupArray(textArray);

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

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function findSimilarEnding(word, lang){
	var rappable = require('rappable');

	word = word.replace(/['"“”\[\]\)\(]+/g, '')

	var similars = [];

	for (var wordKey in model) {
		var words = wordKey.split(" ");
		var lastWordKey = words[words.length -1];
		lastWordKey = lastWordKey.replace(/[\-\,'"“”\[\]\)\(]+/g, '')
		if (lastWordKey.toLowerCase() == word.toLowerCase() || !isNaN(lastWordKey)) continue;
		if (lastWordKey.match(/^[A-Za-z]/i) == null) continue;

		if(rappable.isRappable(word, lastWordKey, lang)){
			similars.push(wordKey);
		}
	}
	if (similars.length == 0) {
		console.log( "word not found:  " +word);
		return "";
	}else{
		var wordCombo = similars[Math.floor(Math.random() * similars.length)] // get random
		console.log( "Found word " +wordCombo+ " for  " + word);
		return wordCombo;
	}

}

function getMarkovText(amountOfWords, options){
	if(!options) options = {};
	if(!options.startWord) options.startWord = _.sample(Object.keys(model));

	calcProbabilities();
	var markovChain = new MarkovChain(model, options.startWord);
	// return  options.startWord + markovChain.findPathToRhyme(options.rhymeEveryXCharacters, options.lang);

	var lastToRhyme;
	var charsSinceLastRhyme = 0;
	var shouldMarkWordForRhyme = true;

	var resultText = "";
	// for (var i = 0; i < amountOfWords; i++) {
	while(resultText.split(" ").length < amountOfWords){
		resultText += markovChain.currentText + " ";
		if (markovChain.currentText) charsSinceLastRhyme += markovChain.currentText.length;

		if (options.rhymeEveryXCharacters) {

			if (charsSinceLastRhyme > options.rhymeEveryXCharacters && shouldMarkWordForRhyme) {
				lastToRhyme = markovChain.currentText;
				resultText += " \n";
				var rhyme = markovChain.findPathToRhyme(options.rhymeEveryXCharacters, options.lang)
				if (rhyme) {
					resultText += rhyme;
					resultText += " \n";
					this.currentStateId = rhyme.split(" ").slice(-2).join(" ");
					charsSinceLastRhyme = 0;
				}else{
					shouldMarkWordForRhyme = false;
					console.log("alternative rhyme");
				}

			}

			// if (charsSinceLastRhyme > options.rhymeEveryXCharacters && shouldMarkWordForRhyme) {
			// 	lastToRhyme = markovChain.currentText;
			// 	resultText += " \n";
			// 	shouldMarkWordForRhyme = false;
			// }

			if (charsSinceLastRhyme>options.rhymeEveryXCharacters*2  && !shouldMarkWordForRhyme) {
				var rhyme = findSimilarEnding(lastToRhyme, options.lang);
				resultText += rhyme + " \n";
				this.currentStateId = rhyme;
				charsSinceLastRhyme = 0;
				shouldMarkWordForRhyme = true;
			}
		}

		// if (options.rhymeEveryXWord) {
		// 	if (i % (options.rhymeEveryXWord*2) == 0 && i != 0) {
		// 		var rhyme = findSimilarEnding(lastToRhyme, options.lang);
		// 		resultText += rhyme;
		// 	}

		// 	if (i == 0 || i % options.rhymeEveryXWord == 0) {
		// 		lastToRhyme = markovChain.currentText;
		// 		resultText += " \n";			
		// 	}
		// }
		
		markovChain.goToNextState();
		
	};

	return resultText;

}

service.addToModels = addToModels;
service.addToModel = addToModel;
service.calcProbabilities = calcProbabilities;
service.getMarkovText = getMarkovText;
service.findSimilarEnding = findSimilarEnding;
service.cleanupArray = cleanupArray;

module.exports = service;
