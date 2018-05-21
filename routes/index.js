"use strict";
var express = require('express');
var router = express.Router();
var utils = require('./utils.js');
var useTrailerProbability = 0.5;
var durationOfStudy = 604800; //7 days
var initId = 1000;

/* GET error if no user id specified in URL.*/
router.get('/', function(req, res, next) {
	var cookieValue = getCookieValue(req, 'userid');
	console.log(cookieValue);
	if(cookieValue == null) {
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
	if(!isNumeric(req.params.id)) {
		redirectToNewId(req, res);
	}
	// Get the user id from the request
	var userid = utils.pad(req.params.id, 12);
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
						renderPageResponse(req, res,  'welcome.html', userid, {}, 'Loaded Introduction page');
						break;

					case -2:
						//Verbal Visual Survey
						renderPageResponse(req, res,  'firstsurvey.html', userid, {}, 'Loaded Verbal Visual Survey');
						break;

					case -1:
						//Overview
						renderPageResponse(req, res,  'overview.html', userid, {}, 'Loaded Overview');
						break;

					case 11:
						//Rating Page
						renderPageResponse(req, res,  'ratings.html', userid, {
							choiceNumber: doc.choice_number, 
							movies: JSON.stringify(doc.choice_set[9] || [])
						}, 'Loaded Ratings Page');
						break;

					case 12:
						var finish = typeof doc.secondanswers != 'undefined' && doc.secondanswers !== null && doc.secondanswers.length > 0;
						if (finish) {
							// Finish page
							renderPageResponse(req, res,  'thankyou.html', userid, {}, 'Loaded Finish page', false);
						} else {
							// Survey page
							renderPageResponse(req, res,  'secondsurvey.html', userid, {}, 'Loaded Survey page');
						}
						break;

					default:
						// Choices page
						renderPageResponse(req, res,  'Info.html', userid, {
							choiceNumber: doc.choice_number, 
							movies: JSON.stringify(doc.choice_set[doc.choice_number - 1] || []),
							conditionNum: doc.conditionNum
						}, {choice_set : doc.choice_number + 1});
				}
			} catch (e) {
				console.log(e.stack);
				console.error("routes/index :: /:id :: Error in handling doc = " + JSON.stringify(
					doc) + " of id = " + userid);
				res = deleteCookie(req, res, 'userid');
				res.end();
			}
		});

		// Save the user agent from which the user is connecting
		utils.updateEvent(db, 'New connection Made', req.useragent, userid, res);
	} catch (e) {
		console.log(e.stack);
		console.error("routes/index :: /:id :: Error in handling id = " + userid);
		res = deleteCookie(req, res, 'userid');
		res.end();
	}
});

//////////////////////////////////
//
// Helper Functions
//
/////////////////////////////////

//TODO: Move some of these functions to the utils module

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
			if(doc != null || doc.length > 0) {
				newUserId = parseInt(doc[0].userid) + 1;
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
	/* conditionNum:1=>Info only, conditionNum:2=>Trailer only, conditionNum:3=>Info-left Trailer-right, conditionNum:4=>Info-right Trailer-left */
	var randomNum = Math.random();
	var expCondition = 0;
	if (randomNum < 0.3)
		expCondition = 1;
	else
	if (randomNum < 0.6)
		expCondition = 2;
	else
	if (randomNum < 0.8)
		expCondition = 3;
	else
		expCondition = 4;

	return users.insert({
		_id: userid,
		userid: userid,
		choice_number: -3,
		choice_set: [],
		//use_trailers: Math.random() < useTrailerProbability,
		conditionNum: expCondition,
		watched_trailers: [],
		hovered_movies: [],
		hovered_info: [],
		hovered_poster: [],
		choices: [],
		ratings: [],
		known: [],
		feedback: null,
		firstanswers: null,
		secondanswers: null
	}, function(err) {
		if (err) {
			console.error("Error in createNewUser while users.insert :: " + err);
			return next(err);
		}
		renderPageResponse(req, res,  'welcome.html', userid, {}, 'Loaded Introduction page');
	});
}

function renderPageResponse(req, res, page, userid, info, eventDesc, setCookie) {
	setCookie = typeof setCookie === 'undefined' ? true : setCookie;
	var data = {
		userid: userid
	};
	for(var key in info) {
		data[key] = info[key];
	}
	res.render(page, {
		data: data
	}, function(err, html) {
		if(setCookie) {
			res = setCookieValue(req, res, 'userid', userid);
		} else {
			res = deleteCookie(req, res, 'userid');
		}
		res.send(html);
		utils.updateEvent(req.db, 'PAGE_LOAD', eventDesc, userid, res);
	});
}

function getCookieValue(req, key) {
	try {
		var encryptedKey = encrypt(req, key);
		if(Object.keys(req.cookies).length > 0 && req.cookies.hasOwnProperty(encryptedKey)) {
			return decrypt(req, req.cookies[encryptedKey]);
		}
	} catch(e) {
		console.log(e.stack);
		console.error("Exception in getCookieValue :: key = " + key + " : error = " + e);
	}
	return null;
}

function setCookieValue(req, res, key, value) {
	res.cookie(encrypt(req, key), encrypt(req, value), { maxAge: durationOfStudy, httpOnly: true });
	return res;
}

function deleteCookie(req, res, key) {
	res.clearCookie(encrypt(req, key));
	return res
}

function getCryptoObj(req) {
	return {
		lib : require('crypto'),
		algorithm : 'aes-256-ctr',
		password : req.settings.encryptionPassword
	}
}

function encrypt(req, text){
	var crypto = getCryptoObj(req);
	var cipher = crypto.lib.createCipher(crypto.algorithm, crypto.password)
	var crypted = cipher.update(text,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}

function decrypt(req, text){
	var crypto = getCryptoObj(req);
	var decipher = crypto.lib.createCipher(crypto.algorithm, crypto.password)
	var dec = decipher.update(text,'hex','utf8')
	dec += decipher.final('utf8');
	return dec;
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = router;