/**
 * @file Checks the database for data correctness issues. It takes no arguments/parameters.
 *
 * @author Biswajyoti Pal <biswajyoti2607@gmail.com>
 * 
 */
 
// Imports
var monk = require('monk');
var env = require('../../env.js');

// Global Objects
var db = monk(process.env.MONGOLAB_URL);
var users = db.get('users');
var events = db.get('events');

events.remove({userid: "000000030000"}, {}, function(e, evtCount) {
	if(e) return console.log("Could not remove events :: " + e);
	console.log("Deleted " + evtCount + " events");
	users.remove({userid: "000000030000"}, {}, function(err, userCount) {
		if(e) return console.log("Could not remove events :: " + e);
		console.log("Deleted " + userCount + " movies");
		process.exit();
	});
});