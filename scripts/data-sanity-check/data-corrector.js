/**
 * @file Updates the database from data-sanity-corrected.csv. It takes no arguments/parameters.
 *
 * @author Biswajyoti Pal <biswajyoti2607@gmail.com>
 * 
 */

// Imports
var MagicCSV = require("magic-csv");
var monk = require('monk');
var env = require('../../env.js');

// Global Objects
var csv = new MagicCSV({trim: true});
var db = monk(process.env.MONGOLAB_URL);
var movies = db.get('movies');

// Read from the csv, go through each of the movies, update their trailers and posters in DB
csv.readFile("data-sanity-corrected.csv", function(err, stats) {
	for(var i = 0; i < csv.getRowCount(); i++) {
		var updatedMovie = csv.getObject(i);
		if(updatedMovie.id_number == 1832) {
			//Book of Shadows: Blair Witch 2
			//Manually fixed
			continue;
		}
		if(updatedMovie.posterError == "POSTER_UNAVAILABLE") {
			var updatePoster = function(updatedMovie) {
				movies.findAndModify({_id: updatedMovie._id}, {$set: {poster: updatedMovie.poster}}, function(err, docs) {
					try {
						console.log("Updated Poster for id_number = " + docs.id_number + " , title = " + docs.title);
					} catch(e) {
						console.log(e);
					}
				});
			}(updatedMovie);
		}
		if(updatedMovie.youtubeError == "TRAILER_UNAVAILABLE") {
			var updateTrailer = function(updatedMovie) {
				var videoId = updatedMovie.youtubeSuggestion.split("=")[1];
				movies.findAndModify({_id: updatedMovie._id}, {$set: {trailer: videoId}}, function(err, docs) {
					try {
						console.log("Updated Trailer for id_number = " + docs.id_number + " , title = " + docs.title + " with videoId = " + videoId);
					} catch(e) {
						console.log(e);
					}
				});
			}(updatedMovie);
		}
	}
});