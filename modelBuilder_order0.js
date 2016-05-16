var fs = require('fs');

//read in text file
var fileName = "lyrics/Kollegah.txt";
var text = fs.readFileSync(fileName, 'utf8').toString();

//split text into words
var regex = /[ \n]/;
var textArray = text.split(regex);
var wordCount = textArray.length - 1;

//create word count object
var wordOccurences = textArray.reduce(function(fruitsCount, currentFruit){
    if(typeof fruitsCount[currentFruit] !== "undefined"){
      fruitsCount[currentFruit]++; 
      return fruitsCount;
    } else {
        fruitsCount[currentFruit]=1; 
        return fruitsCount;
    }
}, {});

//create single arrays with reduced words and their counts
var wordArray = [];
var wordPropabilityArray = [];

for (var word in wordOccurences) {
    wordArray.push(word);
    wordPropabilityArray.push(wordOccurences[word] / wordCount);
}

//function to select a random word depending on its "propability"
var getNextWord = function(words, propabilites){
	var sumArray = [];
	var sum = 0;

	for (var i = 0; i < propabilites.length - 1; i++) {
	    sum += propabilites[i];
	    sumArray[i] = sum;
	}

	var r = Math.random();

	var i = 0;
	for (i = 0; i < sumArray.length && r >= sumArray[i]; i++);

	return words[i];
};

//create resulting text
var resultingText = "";

for (var i = 0; i < 75; i++) {
	resultingText += getNextWord(wordArray, wordPropabilityArray) + " ";
};

console.log(resultingText);