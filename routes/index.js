"use strict";
var express = require('express');
var router = express.Router();
var utils = require('./utils.js');
var initId = 1000;

/* GET server status interceptor */
router.get('/status', function(req, res) {
	try {
		var result = {
			'success': false,
			'result': {
				'state': {
					'db': 'down',
					'recommendation_server': 'down'
				}
			}
		};
		var sendStatusResponse = function() {
			var responseCode = 500;
			if (req.db.hasOwnProperty('driver') && req.db.driver.hasOwnProperty('_native') && req.db.driver._native.hasOwnProperty('_state') &&
				req.db.driver._native._state === 'connected') {
				result.result.state.db = 'up';
			}
			if (result.result.state.db == 'up' && result.result.state.recommendation_server == 'up') {
				result.success = true;
				responseCode = 200;
			}
			res.status(responseCode).json(result);
			res.end();
		};
		var statusTimer = setTimeout(sendStatusResponse, 20000);
		var request = require('request');
		request('https://mmlitetrailer.azurewebsites.net/api/status', function(error, response, body) {
			try {
				if (response.statusCode == 200) {
					result.result.state.recommendation_server = 'up';
					sendStatusResponse();
					clearTimeout(statusTimer);
				}
			} catch (e) {

			}
		});
	} catch (e) {

	}
});

/* GET error if no user id specified in URL.*/
router.get('/', function(req, res, next) {
	var cookieValue = utils.getCookie(req, 'userid');
	if (cookieValue == null) {
		// No userid found in cookie, first time user
		redirectToNewId(req, res);
	} else {
		// userid found, redirect user to existing userid
		redirect(res, parseInt(cookieValue));
	}
});

/* GET N interceptor */
router.get('/N', function(req, res) {
	res.end();
});

/* GET Favicon interceptor */
router.get('/favicon.ico', function(req, res) {
	res.end();
});

/* GET home page. */
router.get('/:id', function(req, res, next) {
	if (!utils.isNumeric(req.params.id)) {
		redirectToNewId(req, res);
	}
	// Get the user id from the request
	var userid = utils.pad(req.params.id, 12);
	
	//Check if Browser if Compatible, else ask the user to download a compatible browser
	if(!checkBrowserCompatibility(req, res, userid)) {
		return;
	}
	try {
		// Check if user id exists
		var db = req.db;
		var users = db.get('users');
		users.findById(userid, function(err, doc) {
			try {
				// If user not found,
				if (doc === null) {
					return createNewUser(req, res, users, userid);
				}

				// If user is found,
				switch (doc.choice_number) {
					case -3:
						// Introduction page
						renderPageResponse(req, res, 'welcome.html', userid, {}, {
							page: 'welcome.html',
							message: 'Loaded Introduction page'
						});
						break;

					case -2:
						//Verbal Visual Survey
						renderPageResponse(req, res, 'firstsurvey.html', userid, {}, {
							page: 'firstsurvey.html',
							message: 'Loaded Verbal Visual Survey'
						});
						break;

					case -1:
						//Overview
						renderPageResponse(req, res, 'overview.html', userid, {}, {
							page: 'overview.html',
							message: 'Loaded Overview'
						});
						break;

					case 11:
						//Rating Page
						renderPageResponse(req, res, 'ratings.html', userid, {
							choiceNumber: doc.choice_number,
							choiceSetNumber: 9,
							movies: JSON.stringify(doc.choice_set[9] || []),
							conditionNum: doc.conditionNum
						}, {
							page: 'ratings.html',
							message: 'Loaded Ratings Page'
						});
						break;

					case 12:
						var finish = typeof doc.secondanswers != 'undefined' && doc.secondanswers !== null && doc.secondanswers.length > 0;
						if (finish) {
							// Finish page
							renderPageResponse(req, res, 'thankyou.html', userid, {
								hashId: utils.hash(req, userid)
							}, {
								page: 'thankyou.html',
								message: 'Loaded Finish page'
							}, false);
						} else {
							// Survey page
							renderPageResponse(req, res, 'secondsurvey.html', userid, {}, {
								page: 'secondsurvey.html',
								message: 'Loaded Survey page'
							});
						}
						break;

					default:
						// Choices page
						renderPageResponse(req, res, 'Info.html', userid, {
							choiceNumber: doc.choice_number,
							choiceSetNumber: doc.choice_number - 1,
							movies: JSON.stringify(doc.choice_set[doc.choice_number - 1] || []),
							conditionNum: doc.conditionNum
						}, {
							page: 'Info.html',
							choice_set: doc.choice_number + 1
						});
				}
			} catch (e) {
				console.log(e.stack);
				console.error("routes/index :: /:id :: Error in handling doc = " + JSON.stringify(
					doc) + " of id = " + userid);
				res = utils.deleteCookie(req, res, 'userid');
				res.end();
			}
		});

		// Save the user agent from which the user is connecting
		utils.updateEvent(db, 'CONNECT_USER', {user_agent: req.useragent, ip: utils.getClientIP(req)}, userid, res);
	} catch (e) {
		console.log(e.stack);
		console.error("routes/index :: /:id :: Error in handling id = " + userid);
		res = utils.deleteCookie(req, res, 'userid');
		res.end();
	}
});

//////////////////////////////////
//
// Helper Functions
//
/////////////////////////////////

function checkBrowserCompatibility(req, res, userid) {
	try {
		var compatibilityMatrix = {
			'Microsoft Windows': ['Chrome', 'Firefox', 'Opera', 'Edge'],
			'Apple Mac': ['Chrome', 'Firefox', 'Opera', 'Safari'],
			'Linux': ['Chrome', 'Firefox'],
			'Other': ['Chrome']
		}
		var platform = req.useragent.platform;
		if(!compatibilityMatrix.hasOwnProperty(req.useragent.platform)) {
			platform = 'Other';
		}
		if(compatibilityMatrix[platform].indexOf(req.useragent.browser) == -1) {
			res.render('browser.html', {
				data: compatibilityMatrix[platform]
			}, function(err, html) {
				res.send(html);
				utils.updateEvent(req.db, 'LOAD_BROWSER_COMPATIBILITY_PAGE', {user_agent: req.useragent, ip: utils.getClientIP(req)}, userid, res);
			});
			return false;
		}
	} catch(e) {
		console.error("Exception in checkBrowserCompatibility :: Error = " + e + " , useragent = " + JSON.stringify(req.useragent));
	}
	return true;
}

function redirect(res, id) {
	res.redirect('/' + id);
}

function redirectToNewId(req, res) {
	var db = req.db;
	var users = db.get('users');
	try {
		users.find({
			userid: /^\d+$/
		}, {
			sort: {
				userid: -1
			},
			limit: 1
		}, function(err, doc) {
			var newUserId = initId;
		
			
			if (doc != null || doc.length > 0) {
				newUserId = parseInt(doc[0].userid) + 1;
			}
			//MADE CHANGE HERE
			else if (doc == null || doc.length == 0){
				newUserId = doc.userid + 1;
			}
			redirect(res, newUserId);
		});
	} catch (e) {
		console.log(e.stack);
		console.error("Exception in redirectToNewId :: " + e);
		res.end();
	}
}

function createNewUser(req, res, users, userid) {
	return getExperimentCondition(req, userid, function(err, expCondition) {
		if (err) {
			console.error("Error in createNewUser while getExperimentCondition :: " + err);
			return res.end();
		}
		return users.insert({
			_id: userid,
			userid: userid,
			choice_number: -3,
			initial_choice_set: [],
			choice_set: [],
			recommended_set: [],
			conditionNum: expCondition,
			watched_trailers: [],
			hovered_movies: [],
			hovered_info: [],
			hovered_poster: [],
			choices: [],
			recommended_choices: [],
			ratings: [],
			known: [],
			feedback: null,
			firstanswers: null,
			secondanswers: null
		}, function(err) {
			if (err) {
				console.error("Error in createNewUser while users.insert :: " + err);
				return res.end();
			}
			renderPageResponse(req, res, 'welcome.html', userid, {}, {
				page: 'welcome.html',
				message: 'Loaded Introduction page'
			});
		});
	});
}

function renderPageResponse(req, res, page, userid, info, eventDesc, setCookie) {
	setCookie = typeof setCookie === 'undefined' ? true : setCookie;
	var data = {
		userid: userid
	};
	for (var key in info) {
		data[key] = info[key];
	}
	res.render(page, {
		data: data
	}, function(err, html) {
		if (setCookie) {
			res = utils.setCookie(req, res, 'userid', userid);
		} else {
			res = utils.deleteCookie(req, res, 'userid');
		}
		res.send(html);
		utils.updateEvent(req.db, 'LOAD_PAGE', eventDesc, userid, res);
	});
}

function getExperimentCondition(req, userid, cb) {
	try {
		var db = req.db;
		var conditions = db.get('conditions');
		conditions.find({}, {
				sort: {
					assigned: 1
				},

			},
			function(err, docs) {
				if (err) {
					console.error("Error while obtaining conditions, error = " + err);
					cb(err, -1);
				}
				var possibleConditions = [];
				for (var i in docs) {
					if (docs[i].assigned == docs[0].assigned) {
						possibleConditions.push(docs[i]);
					} else {
						break;
					}
				}
				var expCondition = possibleConditions[Math.floor(Math.random() * possibleConditions.length)];
				conditions.findAndModify({
					conditionNum: expCondition.conditionNum
				}, {
					$inc: {
						assigned: expCondition.incrementBy
					}
				}, {
					new: true
				}, function(err, doc) {
					if (err) {
						console.error("Error while incrementing selected condition, error = " + err);
						cb(err, -1);
					}
					cb(err, doc.conditionNum);
				});
			});
	} catch (e) {
		console.log(e.stack);
		console.error("Exception in getExperimentCondition :: " + e);
		cb(e, -1);
	}
}

module.exports = router;