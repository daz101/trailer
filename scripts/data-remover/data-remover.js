/**
 * @file Script to remove data for a userid from DB. Takes one argument - userid.
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
var users = db.get('users');
var events = db.get('events');

// Command Line Arguments
if(process.argv.length < 3) {
	console.log("Need a userid for removal");
	process.exit();
}
var userid = utils.pad(process.argv[2]);

events.remove({userid: userid}, {}, function(e, evtCount) {
	if(e) return console.log("Could not remove events for userid = " + userid + " :: " + e);
	console.log("Deleted " + evtCount + " events for userid = " + userid);
	users.remove({userid: userid}, {}, function(err, userCount) {
		if(e) return console.log("Could not remove events for userid = " + userid + " :: " + e);
		console.log("Deleted " + userCount + " users for userid = " + userid);
		process.exit();
	});
});