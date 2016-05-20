var _ = require('lodash');
var rappable = require('rappable');

var service = {};

var MarkovChain = function(model, initialStateId) {

    this.currentStateId = initialStateId;
    this.currentText = _.last(initialStateId.split(" "));

    var RhymeFinder = function(rapWord, startStateId, minTextLength, maxTextLength, lang){
        var id_stack = [];
        id_stack.push(rapWord);

        function checkIfStateRhymes(id){
            for (var nachfolger in model[id]) {
                if(rappable.isRappable(nachfolger, rapWord, lang)){
                    return nachfolger;
                }
            }
        }

        this.goLevelDown = function(currentid, nachfolger){
            // var newStateid = generateNewId(currentid, nachfolger);
            var newStateid = nachfolger;            
            if (model[newStateid]) {
                id_stack.push(newStateid);
                var val = this.gimmeSomeMore();
                id_stack.pop();
                if (val) return val;
            }
        }

        this.gimmeSomeMore = function(){
            var currentid = _.last(id_stack);
            var currentVariant = getTextForStack(id_stack);
            for (var nachfolger in model[currentid]) {
                
                // console.log(currentVariant);
                // console.log(currentVariant.length + "<"+ minTextLength);
                if (currentVariant.length < minTextLength) {
                    // too shallow go deeper
                    var val = this.goLevelDown(currentid, nachfolger);
                    if (val) return val;
                }else{
                    var val = checkIfStateRhymes(currentid);
                    if (val) return currentVariant + " " + val;
                    else{
                        if (currentVariant.length < maxTextLength) {
                            var val = this.goLevelDown(currentid, nachfolger);
                            if (val) return val;
                        }
                    }

                }
            }
        }

        function getTextForStack(id_stack){
            if (id_stack.length <= 1) return "";
            var text = "";
            if (id_stack[1].split(" ")[1])
                text += id_stack[1].split(" ")[0] + " ";
            for (var i = 1; i < id_stack.length; i++) {
                if (id_stack[i].split(" ")[1]) {
                    text += id_stack[i].split(" ")[1]+ " ";
                }else{
                    text += id_stack[i].split(" ")[0]+ " ";
                }
                
            }
            text.trim();
            return text;
        }
    }

    this.findPathToRhyme = function(minTextLength, lang){
        var startPoint = this.currentText;
        var startStateid = this.currentStateId;

        var finder = new RhymeFinder(startPoint, startStateid, minTextLength, minTextLength+20, lang);
        var rhyme =  finder.gimmeSomeMore();
        console.log("rhyme: " + this.currentText + " "+ rhyme);
        return rhyme;
    }

    this.goToNextState =  function() {
        var currentState = model[this.currentStateId];
        
        if(!currentState){
            var nextTextPart = _.sample(Object.keys(model)).split(" ")[0];
            // console.log("Nothing found for '" + this.currentStateId + "' - Taking Random:" + nextTextPart);
            this.moveToNextId(nextTextPart);
            return;
        }

        var nextTextPart = getRandomNachfolger(currentState);

        this.moveToNextId(nextTextPart);
    };

    function generateNewId(currentStateId, nextTextPart, order){
        if (!order) order = 2;
        if (order == 2) {
            return _.last(currentStateId.split(" "))+ " "+ nextTextPart; //  jetzt gehts + los  --> gehts los 
        }else if(order == 1){
            return nextTextPart;
        }else{
            throw "not implemented";
        }
    }

    this.moveToNextId = function(nextTextPart){
        this.currentText = nextTextPart;

        var newPrefix = generateNewId(this.currentStateId, nextTextPart);
        this.currentStateId = newPrefix;
    }

    function getRandomNachfolger(state) {
            var sumArray = [];
            var sum = 0;

            var i = 0;
            for (var prop in state) {
                sum += state[prop];
                sumArray[i] = sum;
                i++;
            }

            var r = Math.random();

            for (i = 0; i < sumArray.length && r >= sumArray[i]; i++);
            
            return Object.keys(state)[i];
        };
    };


service.MarkovChain = MarkovChain;

module.exports = service;