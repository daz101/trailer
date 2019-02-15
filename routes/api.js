"use strict";
var express = require('express');
var router = express.Router();
var request = require('request');
var utils = require('./utils.js');

/* GET movies by movie any id. */
router.get('/movies', function(req, res) {
	if (!(req.query.id && req.query.type)) return utils.sendErr(res, 'Missing parameter(s)');
	var db = req.db;
	var collection = db.get('movies');

	// Find movie in database
	var query = {};
	var id = req.query.id;
	if (!isNaN(Number(req.query.id))) {
		id = Number(req.query.id);
	}

	var type = req.query.type;
	query[type] = id;
	collection.find(query, {}, function(err, docs) {
		if (err) return utils.sendErr(res, 'Could not get movie info.');
		res.json({
			'success': true,
			'result': docs
		});
	});
});

/* GET number of movies in database. */
router.get('/count', function(req, res, next) {
	var db = req.db;
	var collection = db.get('movies');

	collection.count({}, function(err, count) {
		if (err) return next(err);
		res.json({
			'success': true,
			'result': count
		});
	});
});

/* GET trailer video key. */
router.get('/trailer', function(req, res, next) {
	// Get the movie id from the request
	if (!req.query.id) return utils.sendErr(res, 'Missing parameter(s)');
	var id = Number(req.query.id);
	var db = req.db;
	var collection = db.get('movies');

	// Find movie in database
	collection.findById(id, function(err, docs) {
		if (err) return utils.sendErr(res, 'Failed to find movie.');
		getID(docs.imdbID, getTrailer, res, next);
	});
});

/* POST events generated on page. */
router.post('/update/event', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.event && typeof req.body.eventdesc != 'undefined'))
		return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var event = req.body.event;
	var eventdesc = JSON.parse(req.body.eventdesc);
	utils.updateEvent(req.db, event, eventdesc, userid, res);
	res.json({
		'success': true
	});
});

/* POST update movies on page of user. */
router.post('/update/choicenumber', function(req, res, next) {
	// Get the user id from the request
	if (!req.body.userid) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var db = req.db;
	var users = db.get('users');

	// Update choice number in user session data
	users.findAndModify({
		_id: userid
	}, {
		$inc: {
			choice_number: 1
		}
	}, {
		new: true
	}, function(err, docs) {
		if (err) return utils.sendErr(res, 'Failed to update choice number.');
		res.json({
			'success': true,
			'result': docs.choice_number
		});
	});
});

/* POST update movies choice set. */
router.post('/update/movies', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.movies)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var movies = JSON.parse(req.body.movies);
	var db = req.db;
	var users = db.get('users');

	// Update movies in user session data
	users.updateById(userid, {
		$push: {
			choice_set: movies
		}
	}, function(err) {
		if (err) return next(err);

		res.json({
			'success': true
		});
	});
});

/* POST update initial movies choice set. */
router.post('/update/initialmovies', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.movies)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var movies = JSON.parse(req.body.movies);
	var db = req.db;
	var users = db.get('users');

	// Update movies in user session data
	users.updateById(userid, {
		$push: {
			initial_choice_set: movies
		}
	}, function(err) {
		if (err) return next(err);

		res.json({
			'success': true
		});
	});
});

/* POST update initial movies choice set. */
router.post('/update/finalmovies', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.movies)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var movies = JSON.parse(req.body.movies);
	var db = req.db;
	var users = db.get('users');

	// Update movies in user session data
	users.updateById(userid, {
		$push: {
			recommended_set: movies
		}
	}, function(err) {
		if (err) return next(err);

		res.json({
			'success': true
		});
	});
});

/* POST update watched trailers. */
router.post('/update/watchedtrailers', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.movie && req.body.choiceSetNumber)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var movie = req.body.movie;
	var choiceSetNumber = req.body.choiceSetNumber;
	var currentTime = req.body.currentTime || -1;
	var duration = req.body.duration || -1;
	var db = req.db;
	var users = db.get('users');

	// Update movie id whose trailer was watched
	users.updateById(userid, {
		$addToSet: {
			watched_trailers: {
				id: movie,
				choice_set_index: choiceSetNumber,
				watched_till: currentTime,
				duration: duration
			}
		}
	}, function(err) {
		if (err) return utils.sendErr(res, 'Failed to update watched trailer.');
		res.json({
			'success': true
		});
	});
});

/* POST update to use trailers or not. */
router.post('/update/usetrailers', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.useTrailers)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var useTrailers = (req.body.useTrailers == "true");
	var db = req.db;
	var users = db.get('users');

	// Update movie id whose trailer was watched
	users.updateById(userid, {
		$set: {
			use_trailers: useTrailers
		}
	}, function(err) {
		if (err) return utils.sendErr(res, 'Failed to update trailer usage.');
		res.json({
			'success': true
		});
	});
});

/* POST update movies hovered/clicked on. */
router.post('/update/hoveredmovies', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.movie && req.body.choiceSetNumber)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var movie = req.body.movie;
	var choiceSetNumber = req.body.choiceSetNumber;
	var db = req.db;
	var users = db.get('users');

	// Update movie id whose info was loaded
	users.updateById(userid, {
		$addToSet: {
			hovered_movies: {
				id: movie,
				choice_set_index: choiceSetNumber
			}
		}
	}, function(err) {
		if (err) return utils.sendErr(res, 'Failed to update hovered movies.');
		res.json({
			'success': true
		});
	});
});

/* POST update movies info hovered on. */
router.post('/update/hoveredinfo', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.movie && req.body.choiceSetNumber)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var movie = req.body.movie;
	var choiceSetNumber = req.body.choiceSetNumber;
	var db = req.db;
	var users = db.get('users');

	// Update movie id whose info was loaded
	users.updateById(userid, {
		$addToSet: {
			hovered_info: {
				id: movie,
				choice_set_index: choiceSetNumber
			}
		}
	}, function(err) {
		if (err) return utils.sendErr(res, 'Failed to update hovered movies.');
		res.json({
			'success': true
		});
	});
});

/* POST update movies info hovered on. */
router.post('/update/hoveredposter', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.movie && req.body.choiceSetNumber)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var movie = req.body.movie;
	var choiceSetNumber = req.body.choiceSetNumber;
	var db = req.db;
	var users = db.get('users');

	// Update movie id whose info was loaded
	users.updateById(userid, {
		$addToSet: {
			hovered_poster: {
				id: movie,
				choice_set_index: choiceSetNumber
			}
		}
	}, function(err) {
		if (err) return utils.sendErr(res, 'Failed to update hovered movies.');
		res.json({
			'success': true
		});
	});
});

/* POST update movies chosen by user. */
router.post('/update/choices', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.movie)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var movie = req.body.movie;
	var db = req.db;
	var users = db.get('users');

	// Update selected movie in user session data
	users.updateById(userid, {
		$push: {
			choices: movie
		}
	}, function(err) {
		if (err) return next(err);
		res.json({
			'success': true
		});
	});
});

/* POST update final movie chosen by user. */
router.post('/update/recommendedchoice', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.movie)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var movie = req.body.movie;
	var db = req.db;
	var users = db.get('users');

	// Update selected movie in user session data
	users.updateById(userid, {
		$push: {
			recommended_choices: movie
		}
	}, function(err) {
		if (err) return next(err);
		res.json({
			'success': true
		});
	});
});

/* POST update ratings chosen by user. */
router.post('/update/ratings', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.ratings)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var ratings = JSON.parse(req.body.ratings);
	//var ratings.known = JSON.parse(req.body.known);
	// var movie = req.body.movie;
	var db = req.db;
	var users = db.get('users');

	// Update ratings chosen in user session data
	users.updateById(userid, {
		$set: {
			ratings: ratings
		}
	}, function(err) {
		if (err) return utils.sendErr(res, 'Failed to update ratings.');
		res.json({
			'success': true
		});
	});
});

/* POST update known items chosen by user. */
router.post('/update/known', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.known)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var known = JSON.parse(req.body.known);
	// var movie = req.body.movie;
	var db = req.db;
	var users = db.get('users');

	// Update known items chosen in user session data
	users.updateById(userid, {
		$set: {
			known: known
		}
	}, function(err) {
		if (err) return utils.sendErr(res, 'Failed to update known items.');
		res.json({
			'success': true
		});
	});
});

/* POST update visual verbal survey answers. */
router.post('/update/firstanswers', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.firstanswers)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var firstanswers = JSON.parse(req.body.firstanswers);
	var db = req.db;
	var users = db.get('users');

	// Update survey answers in user session data
	users.updateById(userid, {
		$set: {
			firstanswers: firstanswers
		}
	}, function(err) {
		if (err) return utils.sendErr(res, 'Failed to update survey answers.');
		res.json({
			'success': true
		});
	});
});

/* POST update second survey answers. */
router.post('/update/secondanswers', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.secondanswers)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var secondanswers = JSON.parse(req.body.secondanswers);
	var db = req.db;
	var users = db.get('users');

	// Update survey answers in user session data
	users.updateById(userid, {
		$set: {
			secondanswers: secondanswers
		}
	}, function(err) {
		if (err) return utils.sendErr(res, 'Failed to update survey answers.');
		res.json({
			'success': true
		});
	});
});

/* POST update check if anything went wrong (before start of final survey). */
router.post('/update/feedback', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.feedback)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var feedback = req.body.feedback;
	var db = req.db;
	var users = db.get('users');

	// Update survey answers in user session data
	users.updateById(userid, {
		$set: {
			feedback: feedback
		}
	}, function(err) {
		if (err) {
			console.error("routes/api :: /update/feedback :: Error in users.updateById :: " + err);
			return utils.sendErr(res, 'Failed to update survey answers.');
		}
		res.json({
			'success': true
		});
	});
});


/* POST MTurk HIT number for user. */
router.post('/update/hitNo', function(req, res, next) {
	// Get the user id from the request
	if (!(req.body.userid && req.body.hitNo)) return utils.sendErr(res, 'Missing parameter(s)');
	var userid = utils.pad(req.body.userid, 12);
	var hitNo = JSON.parse(req.body.hitNo);
	var db = req.db;
	var users = db.get('users');

	// Update known items chosen in user session data
	users.updateById(userid, {
		$set: {
			hitNo: hitNo
		}
	}, function(err) {
		if (err) return utils.sendErr(res, 'Failed to update hit number.');
		res.json({
			'success': true
		});
	});
});

router.get('/report/users', function(req, res) {
	var i;
	var db = req.db;
	var users = db.get('users');
	users.find({}, {}, function(err, docs) {
		if(err) {
			console.error("routes/api :: /report/users :: Error in users.find :: " + err);
			return utils.sendErr(res, 'Failed to obtain list of users');
		}
		try {
			var result = "userid,mTurkCode,experimentalCondition,stepsCompleted,moviesSelected,trailersWatched,moviesHovered,infoHovered,posterHovered,feedback";
			for(i = 0; i < 11; i++) {
				result = result + ",movieSelectionPos_" + i;
			}
			for(i = 0; i < 10; i++) {
				result = result + ",ratings_" + i;
			}
			for(i = 0; i < 10; i++) {
				result = result + ",known_" + i;
			}
			for(i = 0; i < 11; i++) {
				result = result + ",firstanswers_" + i;
			}
			for(i = 0; i < 39; i++) {
				result = result + ",secondanswers_" + i;
			}
			result = result + "\n";
			
			for(var idx in docs) {
				try {
					var docResult = "";
					docResult = docResult + parseInt(docs[idx].userid) + ",";
					try {
						docResult = docResult + utils.hash(req, docs[idx].userid) + ",";
					} catch(ex) {
						docResult = docResult + "NULL,";
					}
					try {
						docResult = docResult + docs[idx].conditionNum + ",";
					} catch(ex) {
						docResult = docResult + "NULL,";
					}
					try {
						docResult = docResult + docs[idx].choice_number + ",";
					} catch(ex) {
						docResult = docResult + "NULL,";
					}
					try {
						docResult = docResult + docs[idx].choices.length + ",";
					} catch(ex) {
						docResult = docResult + "NULL,";
					}
					try {
						docResult = docResult + docs[idx].watched_trailers.length + ",";
					} catch(ex) {
						docResult = docResult + "NULL,";
					}
					try {
						docResult = docResult + docs[idx].hovered_movies.length + ",";
					} catch(ex) {
						docResult = docResult + "NULL,";
					}
					try {
						docResult = docResult + docs[idx].hovered_info.length + ",";
					} catch(ex) {
						docResult = docResult + "NULL,";
					}
					try {
						docResult = docResult + docs[idx].hovered_poster.length + ",";
					} catch(ex) {
						docResult = docResult + "NULL,";
					}
					try {
						docResult = docResult + docs[idx].feedback;
					} catch(ex) {
						docResult = docResult + "NULL";
					}
					
					try {
						docResult = docResult + "," + docs[idx].initial_choice_set[0].indexOf(docs[idx].choices[0]);
					} catch(ex) {
						docResult = docResult + ",NULL";
					}
					for(i = 1; i < 11; i++) {
						try {
							docResult = docResult + "," + docs[idx].choice_set[i - 1].indexOf(docs[idx].choices[i]);
						} catch(ex) {
							docResult = docResult + ",NULL";
						}
					}
					for(i = 0; i < 10; i++) {
						try {
							docResult = docResult + "," + docs[idx].ratings[i];
						} catch(ex) {
							docResult = docResult + ",NULL";
						}
					}
					for(i = 0; i < 10; i++) {
						try {
							docResult = docResult + "," + docs[idx].known[i];
						} catch(ex) {
							docResult = docResult + ",NULL";
						}
					}
					for(i = 0; i < 11; i++) {
						try {
							docResult = docResult + "," + docs[idx].firstanswers[i];
						} catch(ex) {
							docResult = docResult + ",NULL";
						}
					}
					for(i = 0; i < 39; i++) {
						try {
							docResult = docResult + "," + docs[idx].secondanswers[i];
						} catch(ex) {
							docResult = docResult + ",NULL";
						}
					}
					result = result + docResult + "\n";
				} catch(e) {
					console.warn("Exception in transforming to csv for userid = " + docs[idx].userid + " :: " + e);
				}
			}
			
			res.setHeader('Content-disposition', 'attachment; filename=report_users.csv');
			res.setHeader('Content-Type', 'text/csv');
			res.status(200).send(result);
		} catch(e) {
			console.trace();
			console.error("routes/api :: /report/users :: Exception in users.find :: " + e);
		}
	});
});

/**
 * Get TheMovieDB movie id using ImDB id.
 */
function getID(imdbID, cb, res, next) {
	imdbID = "tt" + utils.pad(imdbID, 7);
	request({
		uri: "https://api.themoviedb.org/3/find/" + imdbID,
		qs: {
			api_key: process.env.THEMOVIEDB_API_KEY,
			external_source: 'imdb_id'
		},
		json: true
	}, function(err, response, data) {
		if (err || response.statusCode != 200) return utils.sendErr(res, 'Could not find trailer. Code "1".');
		var id = data.movie_results[0].id;
		cb(id, res, next);
	});
}

/**
 * Get trailer video key from TheMovieDB API.
 */
function getTrailer(id, res) {
	request({
		uri: "https://api.themoviedb.org/3/movie/" + id + "/videos",
		qs: {
			api_key: process.env.THEMOVIEDB_API_KEY
		},
		json: true
	}, function(err, response, data) {
		if (err || response.statusCode != 200) return utils.sendErr(res, 'Could not find trailer. Code "2".');
		var videos = data.results;
		for (var i in videos) {
			var video = videos[i];
			if (video.type == "Trailer" && video.key) {
				return res.json({
					'success': true,
					'result': video.key
				});
			}
		}
		utils.sendErr(res, 'Could not find trailer. Code "3".');
	});
}

module.exports = router;