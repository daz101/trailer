/**
 * @file This file is not a standalone runnable script. This file contains snippets to update the database as required.
 * Be careful, in running these snippets as they make irreversible changes to the DB.
 *
 * @author Biswajyoti Pal <biswajyoti2607@gmail.com>
 * 
 */
 
// Imports
var monk = require('monk');
var env = require('../../env.js');
var utils = require('../../routes/utils.js');

// Global Objects
var db = monk(process.env.MONGOLAB_URL);
var movies = db.get('movies');
var db_bkp = monk("mongodb://localhost:27017/heroku_ln6dp8f9");
var movies_bkp = db_bkp.get('movies');

// SNIPPET 1 - CODE TO CHECK FROM BACKUP AND UPDATE DB
/*
movies_bkp.find({}, {}, function(err_bkp, docs_bkp) {
	console.log(docs_bkp.length);
	for(var i in docs_bkp) {
		var checker = function(doc_bkp) {
			movies.find({id_number: doc_bkp.id_number}, {}, function(err, docs) {
				if(docs.length == 0) {
					console.log(doc_bkp.title + " :: not found!");
					var inserter = function(doc_insert) {
						delete doc_insert._id;
						movies.insert(doc_insert, function(err_insert) {
							if(err_insert) return console.error("Error inserting : " + err_insert, doc_insert.title, doc_insert.id_number);
							console.log("Inserted : ", doc_insert.title, doc_insert.id_number);
						});
					}(doc_bkp);
				}
			});
		}(docs_bkp[i]);
	}
});
*/

// SNIPPET 2 - CODE TO CORRECT URLS IN SUMMARY
/*
movies.find({summary: {$regex: '<a href="/'}}, {}, function(err, docs) {
	if(err) return console.log("Could not get movies :: " + err);
	console.log(docs.length);
	for(var i in docs) {
		console.log("Fixing summary for movie = " + docs[i].title);
		var summary = docs[i].summary.split('<a href="/').join('<a href="http://www.imdb.com/');
		var updater = function(doc_update, summary) {
			movies.findAndModify({_id: doc_update._id}, {$set: {summary: summary}}, function(err, doc) {
				if(err) return console.log("Could not modify movies :: " + err + " for " + doc.title);
				console.log("Fixed summary for movie = " + doc.title);
			});
		}(docs[i], summary);
	}
});
*/

// SNIPPET 3 - CODE TO DELETE EMPTY OBJECTS
/*
movies.remove({id_number: null}, function(e, count) {
	if(e) return console.log("Could not remove movies :: " + e);
	console.log("Deleted " + count + " movies");
})
*/