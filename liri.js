// Key requirements

var dataKeys = require("./keys.js");
var fs = require('fs');
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

var writeToLog = function (data) {
    fs.appendFile("log.txt", '\r\n\r\n', function (error) {
        if (error) {
            console.log(error);
        }
    });

    fs.appendFile("log.txt", JSON.stringify(data), function (error) {
        if (error) {
            return console.log(error);
        }

        console.log("log.txt was updated!");
    });
}

var getTweets = function () {
    var client = new twitter(dataKeys);

    var params = { screen_name: 'Gelmax1' };
    client.get("statuses/user_timeline/", params, function (error, data, response) {
        if (!error) {
            for (var i = 0; i < data.length; i++) {
                //console.log(response); // Show the full response in the terminal
                var twitterResults =
                    "@" + data[i].user.screen_name + ": " +
                    data[i].text + "\r\n" +
                    data[i].created_at + "\r\n" +
                    "------------------------------ " + i + " ------------------------------" + "\r\n";
                console.log(twitterResults);
                writeToLog(twitterResults); // calling log function
            }
        } else {
            console.log("Error :" + error);
            return;
        }
    });
};

//Creates a function for finding artist name from spotify
var getArtistNames = function (artist) {
    return artist.name;
};

//Function for finding songs on Spotify
var spotify = new Spotify({
    id: "e6bbbd53bc6642ca9b652b1366b61a4b",
    secret: "48d326da9f1d4944806a2752aaf18212"
  });

function spotifyThisSong(songName) {
    if(!songName){
        songName = "The Sign";
    }
    params = songName;
    spotify.search({ type: "track", query: params }, function(err, data) {
        if(!err){
            var songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                    "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                    "Song: " + songInfo[i].name + "\r\n" +
                    "Album the song is from: " + songInfo[i].album.name + "\r\n" +
                    "Preview Url: " + songInfo[i].preview_url + "\r\n" + 
                    "------------------------------ " + i + " ------------------------------" + "\r\n";
                    console.log(spotifyResults);
                    writeToLog(spotifyResults); // calling log function
                }
            }    
        }	else {
            console.log("Error :"+ err);
            return;
        }
    });
};

function movieThis(movie) {
    if (!movie) {
        movie = "mr nobody";
    }
    params = movie
    request("http://www.omdbapi.com/?apikey=trilogy&t=" + params + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieObject = JSON.parse(body);
            //console.log(movieObject); // Show the text in the terminal
            var movieResults =
                "------------------------------ begin ------------------------------" + "\r\n" +
                "Title: " + movieObject.Title + "\r\n" +
                "Year: " + movieObject.Year + "\r\n" +
                "Imdb Rating: " + movieObject.imdbRating + "\r\n" +
                "Rotten Tomatoes Rating: " + movieObject.tomatoRating + "\r\n" +
                "Country: " + movieObject.Country + "\r\n" +
                "Language: " + movieObject.Language + "\r\n" +
                "Plot: " + movieObject.Plot + "\r\n" +
                "Actors: " + movieObject.Actors + "\r\n" +
                "------------------------------ fin ------------------------------" + "\r\n";
            console.log(movieResults);
            writeToLog(movieResults); // calling log function
        } else {
            console.log("Error :" + error);
            return;
        }
    });
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error) {
            doWhatItSaysResults = data.split(",");
            spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
        } else {
            console.log("Error occurred" + error);
        }
    });
};

var pick = function (caseData, functionData) {
    switch (caseData) {
        case 'my-tweets':
            getTweets();
            break;
        case 'spotify-this-song':
            spotifyThisSong(functionData);
            break;
        case 'movie-this':
            movieThis(functionData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log('LIRI doesn\'t know that');
    }
}

//run this on load of js file
var runThis = function (argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);