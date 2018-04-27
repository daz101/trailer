"use strict";
var express = require('express');
var router = express.Router();
var utils = require('./utils.js');
//var title = ' | MRS';
var useTrailerProbability = 0.5;
var randomNum;
var expCondition;

/* GET error if no user id specified in URL.*/
router.get('/', function(req, res, next) {
  next(new Error("Please type in some unique user ID at the end of the URL after the '/'"));
}); 

/* GET N interceptor */
router.get('/N', function (req, res) {
  res.end();
});

/* GET Favicon interceptor */
router.get('/favicon.ico', function (req, res) {
  res.end();
});

/* conditionNum:1=>Info only, conditionNum:2=>Trailer only, conditionNum:3=>Info-left Trailer-right, conditionNum:4=>Info-right Trailer-left */
/* GET home page. */
router.get('/:id', function(req, res, next) {
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
				
				randomNum=Math.random();
				if(randomNum<0.3)
					expCondition=1;
				else 
				if(randomNum<0.6)
					expCondition=2;
				else
				if(randomNum<0.8)
					expCondition=3;
				else
					expCondition=4;
				
			  return users.insert({
				_id: userid,
				userid: userid,
				choice_number: -3,
				choice_set: [],
				//use_trailers: Math.random() < useTrailerProbability,
				conditionNum:expCondition,
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
				if (err) return next(err);
				res.render('welcome.html', {
				  //title: 'Introduction' + title,
				  data: {
					userid: userid
				  }
				}, function(err, html) {
				  res.send(html);
				  utils.updateEvent(db, 'Loaded Introduction page', null, userid, res);
				});
			  });
			}

			// If user is found,
			switch(doc.choice_number) {
			   case -3:
				// Introduction page
				res.render('welcome.html', {
				  //title: 'Introduction' + title,
				  data: {
					userid: userid
				  }
				}, function(err, html) {
				  res.send(html);
				  utils.updateEvent(db, 'Loaded Introduction page', null, userid, res);
				});
				break;
				
				case -2:
				res.render('firstsurvey.html', {
				  //Verbal Visual Survey,
				  data: {
					userid: userid
				  }
				}, function(err, html) {
				  res.send(html);
				  utils.updateEvent(db, 'Loaded Verbal Visual Survey', null, userid, res);
				});
				break;
				
				case -1:
				res.render('overview.html', {
				  //Verbal Visual Survey,
				  data: {
					userid: userid
				  }
				}, function(err, html) {
				  res.send(html);
				  utils.updateEvent(db, 'Loaded Overview', null, userid, res);
				});
				break;
				
				case 11:
				res.render('ratings.html', {
				  //Rating Page
				  data: {
					userid: userid,
					choiceNumber: doc.choice_number,
					movies: JSON.stringify(doc.choice_set[9] || [])
				  }
				}, function(err, html) {
				  res.send(html);
				  utils.updateEvent(db, 'Loaded Ratings Page', null, userid, res);
				});
				break;
				
			  case 12:
				var finish = typeof doc.secondanswers != 'undefined' && doc.secondanswers !== null;
				if(finish) {
				  // Finish page
				  res.render('thankyou.html', {
					data: { userid: userid }
				  }, function(err, html) {
					res.send(html);
					utils.updateEvent(db, 'Loaded Finish page', null, userid, res);
				  });
				} else {
				  // Survey page
				  res.render('secondsurvey.html', {
					data: { userid: userid }
				  }, function(err, html) {
					res.send(html);
					utils.updateEvent(db, 'Loaded Survey page', null, userid, res);
				  });
				}
				break;

			  default:
				// Choices page
				//FIXME: Remove all titles being passed to the rendering object
				res.render('Info.html', {
				  //title: 'Choices' + title,
				  data: {
					userid: userid,
					choiceNumber: doc.choice_number,
					movies: JSON.stringify(doc.choice_set[doc.choice_number-1] || []),
					conditionNum: doc.conditionNum
					//useTrailers: doc.use_trailers
				  }
				}, function(err, html) {
				  res.send(html);
				  utils.updateEvent(db, 'Loaded Choice set', doc.choice_number+1, userid, res);
				});
			}
		} catch (e) {
			console.log(e.stack);
			console.log("routes/index :: /:id :: Error in handling doc = " + JSON.stringify(doc) + " of id = " + userid);
			res.end();
		}
	  });

	  // Save the user agent from which the user is connecting
	  utils.updateEvent(db, 'New connection Made', req.useragent, userid, res);
  } catch (e) {
	console.log(e.stack);
	console.log("routes/index :: /:id :: Error in handling id = " + userid);
	res.end();
  }
});

module.exports = router;