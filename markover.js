var fs = require('fs');
var markov = require('./modelBuilder_order1');

var order = 2;

// markov.addToModel(fs.readFileSync("lyrics/trump.txt", 'utf8').toString(), order);
// markov.addToModel(fs.readFileSync("lyrics/hitler.txt", 'utf8').toString(), order);

// markov.addToModel(fs.readFileSync("lyrics/Kollegah.txt", 'utf8').toString(), order);

// var resultText = markov.getMarkovText(100, { rhymeEveryXCharacters: 25 });

markov.addToModels(fs.readFileSync("lyrics/hitler_ger.txt", 'utf8').toString(), order);
var resultText = markov.getMarkovText(70, { rhymeEveryXCharacters: 30, lang:'de' });
console.log("\n"+resultText);



// markov.addToModels("lieber lebertran als marmelade kran mkay", order);
// var resultText = markov.getMarkovText(70, { rhymeEveryXCharacters: 15, lang:'de', startWord:"lieber lebertran" });
// console.log("\n"+resultText);

