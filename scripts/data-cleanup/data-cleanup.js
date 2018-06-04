/**
 * @file Script to remove all data from DB.
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
//var db = monk("mongodb://localhost:27017/heroku_ln6dp8f9");
var users = db.get('users');
var events = db.get('events');

events.remove({}, {}, function(e, evtCount) {
	if(e) return console.log("Could not remove events :: " + e);
	console.log("Deleted " + evtCount + " events");
	users.remove({}, {}, function(err, userCount) {
		if(e) return console.log("Could not remove users :: " + e);
		console.log("Deleted " + userCount + " users");
		process.exit();
	});
});