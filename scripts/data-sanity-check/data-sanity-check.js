/**
 * @file Checks the database for data correctness issues. It takes no arguments/parameters.
 *
 * @author Biswajyoti Pal <biswajyoti2607@gmail.com>
 * 
 */
 
// Imports
var fs = require('fs');
var request = require('request');
var monk = require('monk');
var env = require('../../env.js');

// Global Constants
var FILE_NAME = "data-sanity-errors.csv";
var YT_URI = "https://www.youtube.com/watch?v=";
var YT_API_URI = "https://www.googleapis.com/youtube/v3";
var YT_KEY = "AIzaSyBG-2QEXC_x99ZvlklSWdqGyTkN8rtiznA";

// Global Objects
var db = monk(process.env.MONGOLAB_URL);
var urlRetriesCount = {};
var videoIdRetriesCount = {};

// Function to check if a URL is valid (Currently used to check if poster URL is valid)
var checkUrlExists = function (url, callback, i) {
	// To prevent too many requests simultaneously, schedule the request after i*10 milliseconds.
	// On completion, call callback(bool, string)
	setTimeout(function() {
		urlRetriesCount[url] = (urlRetriesCount[url] || 0) + 1;
		request(url, function (error, response, body) {
			if(error) {
				if(urlRetriesCount[url] < 10 && (error.errno == "ECONNRESET" || error.errno == "ETIMEDOUT"  || error.code == "ECONNRESET")){
					checkUrlExists(url, callback, i);
				} else {
					callback(false, "Error :: " + error);
				}
			} else {
				callback(response.statusCode == 200, "Response Code :: " + response.statusCode);
			}
		});
	}, i*10);
}

// Function to check if a YouTube Video Id is valid
var youtubeVideoStatus = function(id, title, callback, i) {
	// To prevent too many requests simultaneously, schedule the request after i*10 milliseconds.
	// On completion, call callback(bool, string, string)
	setTimeout(function() {
		videoIdRetriesCount[id] = (videoIdRetriesCount[id] || 0) + 1;
		request(YT_API_URI + '/videos?part=status,contentDetails&id=' + id + '&key=' + YT_KEY, function (error, response, body) {
			if(error) {
				if(videoIdRetriesCount[id] < 10 && (error.errno == "ECONNRESET" || error.errno == "ETIMEDOUT" || error.code == "ECONNRESET")){
					youtubeVideoStatus(id, callback, i);
				} else {
					callback(false, "Error :: " + error, "");
				}
			} else {
				var bodyJson = JSON.parse(body);
				if(!bodyJson.hasOwnProperty("items") || bodyJson.items.length == 0) {
					// Video Id is not found
					youtubeVideoSuggest(title, function(suggestion) {
						callback(false, "Video not found", suggestion);
					});
				} else if(bodyJson.items[0].status.uploadStatus != "processed") {
					// This video cannot be played
					youtubeVideoSuggest(title, function(suggestion) {
						callback(false, "Video cannot be played :: uploadStatus = " + bodyJson.items[0].status.uploadStatus, suggestion);
					});
				} else if(bodyJson.items[0].status.privacyStatus == "private") {
					// This video has restricted access
					youtubeVideoSuggest(title, function(suggestion) {
						callback(false, "Video is private :: privacyStatus = " + bodyJson.items[0].status.privacyStatus, suggestion);
					});
				} else if(bodyJson.items[0].status.embeddable != true) {
					// This video cannot be embedded in a webapge
					youtubeVideoSuggest(title, function(suggestion) {
						callback(false, "Video cannot be embedded :: embeddable = " + bodyJson.items[0].status.embeddable, suggestion);
					});
				} else if(bodyJson.items[0].contentDetails.hasOwnProperty("regionRestriction") 
					&& ((bodyJson.items[0].contentDetails.regionRestriction.hasOwnProperty("allowed") && bodyJson.items[0].contentDetails.regionRestriction.allowed.length == 0) 
						|| (bodyJson.items[0].contentDetails.regionRestriction.hasOwnProperty("blocked") && bodyJson.items[0].contentDetails.regionRestriction.blocked.indexOf("US") > -1))) {
					// This video has Region restriction which does not work for us.
					youtubeVideoSuggest(title, function(suggestion) {
						callback(false, "Restricted Region :: US", suggestion);
					});
				} else {
					callback(true, "", "");
				}
			}
		});
	}, i*10);
}

// Function to obtain a YouTube video for cases where our YouTube is unavailable
var youtubeVideoSuggest = function(title, callback) {
	// Search request takes up too many credits, schedule the request after 1 second.
	// On completion, call callback(string)
	setTimeout(function() {
		// Search for title + " trailer"
		// Filter Search for video which can be embedded and played in US
		request(YT_API_URI + '/search?part=id&q=' + encodeURIComponent(title + " trailer") + '&regionCode=US&type=video&videoEmbeddable=true&key=' + YT_KEY, function (error, response, body) {
			var bodyJson = JSON.parse(body);
			if(!bodyJson.hasOwnProperty("items") || bodyJson.items.length == 0) {
				callback("");
			} else {
				// Check for just the first two results, not sure if we can trust the subsequent results to be trailers
				checkYoutubeVideoIsValid(bodyJson.items[0].id.videoId, function(shouldSuggest) {
					if(shouldSuggest) {
						callback(YT_URI + bodyJson.items[0].id.videoId);
					} else {
						checkYoutubeVideoIsValid(bodyJson.items[1].id.videoId, function(shouldSuggest) {
							if(shouldSuggest) {
								callback(YT_URI + bodyJson.items[1].id.videoId);
							} else {
								callback("");
							}
						});
					}
				});				
			}
		});
	}, 1000);
}

// Function to double check if YouTube video suggestion satisfies our requirements
var checkYoutubeVideoIsValid = function(id, callback) {
	// To prevent too many requests simultaneously, schedule the request after 10 milliseconds.
	// On completion, call callback(bool)
	// TODO: Very similar to youtubeVideoStatus, need to refactor
	setTimeout(function() {
		request(YT_API_URI + '/videos?part=status,contentDetails&id=' + id + '&key=' + YT_KEY, function (error, response, body) {
			var bodyJson = JSON.parse(body);
			if(!bodyJson.hasOwnProperty("items") || bodyJson.items.length == 0) {
				callback(false);
			} else if(bodyJson.items[0].status.uploadStatus != "processed") {
				callback(false);
			} else if(bodyJson.items[0].status.privacyStatus == "private") {
				callback(false);
			} else if(bodyJson.items[0].status.embeddable != true) {
				callback(false);
			} else if(bodyJson.items[0].contentDetails.hasOwnProperty("regionRestriction") 
				&& ((bodyJson.items[0].contentDetails.regionRestriction.hasOwnProperty("allowed") && bodyJson.items[0].contentDetails.regionRestriction.allowed.length == 0) 
					|| (bodyJson.items[0].contentDetails.regionRestriction.hasOwnProperty("blocked") && bodyJson.items[0].contentDetails.regionRestriction.blocked.indexOf("US") > -1))) {
				callback(false);
			} else {
				callback(true);
			}
		});
	}, 10);
}

// Function to append an array into a file as csv
var writeLineToFile = function(csvArr) {
	var line = "";
	for(var i in csvArr) {
		line = line + csvArr[i] + ",";
	}
	line = line.substring(0, line.length - 1) + "\n";
	fs.appendFile(FILE_NAME, line, function(err) {
		if(err) {
			return console.log(err);
		}
	});
}

// Read from the db, go through each of the movies, check their trailers and posters
var movies = db.get('movies');
movies.find({}, {}, function(err, docs) {
	if(err) return utils.sendErr(res, 'Could not get movie info.');
	// Delete the output file if present
	if(fs.existsSync(FILE_NAME)) fs.unlinkSync(FILE_NAME);
	writeLineToFile(['_id', 'id_number', 'movieID', 'imdbID', 'title', 'poster', 'trailer', 'posterError', 'posterErrorDetails', 'youtubeError', 'youtubeErrorDetails', 'youtubeSuggestion']);
	var completedDocs = 0;
	var totalDocs = docs.length;
	for(var i in docs) {
		var writeToFile = function(i) {
			youtubeVideoStatus(docs[i].trailer, docs[i].title, function(youtubeExists, youtubeErrorDetails, youtubeSuggestion) {
				checkUrlExists(docs[i].poster, function(posterExists, posterErrorDetails) {
					if(!posterExists || !youtubeExists) {
						// Data Error found
						var errorArr = [docs[i]._id, docs[i].id_number, docs[i].movieID, docs[i].imdbID, docs[i].title, docs[i].poster, YT_URI + docs[i].trailer, "POSTER_FOUND", "", "TRAILER_FOUND", "", ""];
						if(!posterExists) {
							errorArr[7] = "POSTER_UNAVAILABLE";
							errorArr[8] = posterErrorDetails;
						}
						if(!youtubeExists) {
							errorArr[9] = "TRAILER_UNAVAILABLE";
							errorArr[10] = youtubeErrorDetails;
							errorArr[11] = youtubeSuggestion;
						}
						// Escape with quotes
						for(var item in errorArr) {
							errorArr[item] = '"' + errorArr[item] + '"';
						}
						writeLineToFile(errorArr);
					}
					completedDocs++;
				}, i);
			}, i);
		}(i);
	}
	setInterval(function() {
		// Report progress on command line
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		process.stdout.write(
			`Completed: ${completedDocs} out of ${totalDocs}`
		);
		// Done
		if(completedDocs >= totalDocs) {
			process.exit();
		}
	}, 100);
});