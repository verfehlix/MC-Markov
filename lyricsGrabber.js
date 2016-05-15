//imports
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

//settings
var baseUrl = "http://www.magistrix.de"
var artistOverviewPath = "/lyrics/Kollegah/?order=name";
var fileName = "Kollegah";

//variables
var songUrls = [];
var amount = 0;
var count = 0;

//initial request
request(baseUrl + artistOverviewPath, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        parseArtistOverViewPage(body);
    }
})

//function to get list of songs from artist page
function parseArtistOverViewPage(body) {
    $ = cheerio.load(body);

    $("a").each(function() {
        if ($(this).attr("class") === "lyricIcon bgMove") {
            songUrls.push(baseUrl + $(this).attr("href"));
        }
    });
    amount = songUrls.length;
    console.log("Found " + amount + " Songs to parse.");

    //process all urls consecutively
    processUrls(songUrls);
};

function processUrls(urls) {
    var songUrl = songUrls.shift();
    logStatus(songUrl, function() {
        if (songUrls.length > 0) {
            setTimeout(processUrls.bind(this, songUrls));
        }
    });
}

function logStatus(url, done) {
    request(url, function(err, res, body) {
        if (!err && res.statusCode == 200) {
            count++;
            parseSongPage(body);
        } else {
            console.log("ERROR IN GETTING SONG PAGE");
            console.log(err);
        }
        done();
    });
}

//function to get lyrics from song page to write it into a file
function parseSongPage(body) {
    console.log(new Date() + ": Parsing Song #" + count + " / " + amount);
    $ = cheerio.load(body);

    $("div").each(function() {
        if ($(this).attr("itemprop") === "text") {
            $(this).children("p").each(function() {
                var lyrics = $(this).text();
                appendToFile(lyrics);
            });
        }
    });
};

//write text to file
function appendToFile(text){
    fs.appendFile("texts/" + fileName + ".txt", text + "\n", function(err) {
        if (err) {
            console.log("ERROR DURING FILE WRITE");
            console.log(err);
        }
    });
}