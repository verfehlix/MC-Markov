var fs = require('fs');
var markov = require('./modelBuilder_order1');

var order = 2;

markov.addToModel(fs.readFileSync("lyrics/trump.txt", 'utf8').toString(), order);
markov.addToModel(fs.readFileSync("lyrics/hitler.txt", 'utf8').toString(), order);

// markov.addToModel(fs.readFileSync("lyrics/Kollegah.txt", 'utf8').toString(), order);

var resultText = markov.getMarkovText(100, { rhymeEveryXCharacters: 25 });
console.log("\n"+resultText);
