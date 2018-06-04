"use strict";
//data="";
//confirmUnload = true;
//$('a').click(function() { confirmUnload = false});

var nrOfMovies = $(".movie-block").length;
var learnRate = "0,7";
var discardRate = "0,5";
var maxChoices = 10;
var diversification = '0,7';
//var userid = data.userid;
var userFromUrl = window.location.pathname;
var userid = userFromUrl.replace('/', '');
var choiceNumber = data.choiceNumber;
var choiceSetNumber = data.choiceSetNumber;
var movies = JSON.parse(data.movies);
var player, useTrailers = data.useTrailers,
	conditionNum = data.conditionNum,
	currentTrailer = null;
var timer, delay = 1000;
var ratings = [];
var known = [];

$(document).ready(function() {
	// Update the remaining number of choices to make
	refreshChoicesCount();

	// Check if existing session info exists
	if (choiceNumber === 0) {
		// Load random set of movies
		loadRandomMovies();
	} else {
		// Load movies from last session
		for (var i in movies) {
			var mID = movies[i];
			loadMovieInfo(i, mID, 'id');
		}
	}

	// conditionNum:3 => Info:left, Blur: right
	// conditionNum:4 => Info:right, Blur: left 
	// Blur the content when conditionNum is 3 or 4
	if (conditionNum == 3 || conditionNum == 4) {
		$('#blurred_content').css("filter", "blur(10px)");
		if (conditionNum == 4) {
			$('#mouseCap_video').css("float", "left");
			$('.movie_info').css("float", "right");
		} else {
			$('#mouseCap_video').css("float", "right");
			$('.movie_info').css("float", "left");
		}
	} else {
		$('#blurred_content').css("filter", "blur(0px)");
	}

	// For trailer-only condition; when conditionNum is 2 display only trailer  
	if (conditionNum == 2) {
		$('#mouseCap_video').css("width", "100%");
		$('.movie_info').css("display", "none");
	}
	
	$('.movie-block').mouseover(function() {
		var idArr = $(this).prop('id').split("_");
		var moviePos = idArr[idArr.length - 1] - 1;
		updateHoveredMovies(movies[moviePos].id_number);
		postEvent('MOUSEOVER_MOVIE', {id: movies[moviePos]._id});
	});
	
	$('.movie-block').mouseout(function() {
		var idArr = $(this).prop('id').split("_");
		var moviePos = idArr[idArr.length - 1] - 1;
		postEvent('MOUSEOUT_MOVIE', {id: movies[moviePos]._id});
	});
	
	$('.movie-block').click(function() {
		var idArr = $(this).prop('id').split("_");
		var moviePos = idArr[idArr.length - 1] - 1;
		postEvent('SELECT_MOVIE', {id: movies[moviePos]._id});
	});

	$('.movie_info').mouseover(function() {
		updateHoveredInfo($(this).attr('data-movie-id-number'));
		postEvent('MOUSEOVER_INFO', {id: $(this).attr('data-movie-id')});
	});
	
	$('.movie_info').mouseout(function() {
		postEvent('MOUSEOUT_INFO', {id: $(this).attr('data-movie-id')});
	});

	$('.movie_img').mouseover(function() {
		updateHoveredPoster($(this).attr('data-movie-id-number'));
		postEvent('MOUSEOVER_POSTER', {id: $(this).attr('data-movie-id')});
	});
	
	$('.movie_img').mouseout(function() {
		postEvent('MOUSEOUT_POSTER', {id: $(this).attr('data-movie-id')});
	});

	// Look for trailer/poster when hovering over movie in movieblock
	$('.movie-block .wrapper-block').click(function() {
		// Find which movie was clicked
		var parentIdArr = $(this).parent().prop('id').split('_'); //["movie","1"]
		var moviePos = parentIdArr[parentIdArr.length - 1] - 1; //1 - 1 = 0
		loadSelectedMovie(moviePos); //0
	});

	$('.movie-block .choose').click(function() {
		// Find which movie was clicked
		var parentIdArr = $(this).parent().prop('id').split('_'); //["movie","1"]
		var moviePos = parentIdArr[parentIdArr.length - 1] - 1; //1 - 1 = 0
		loadSelectedMovie(moviePos); //0
	});

	//When ratings is selected 
	$('.movie-block .icon-holder').click(function() {
		// Find which movie was clicked
		var parentIdArr = $(this).parent().prop('id').split('_'); //["movie","1"]
		var moviePos = parentIdArr[parentIdArr.length - 1] - 1; //1 - 1 = 0
		//if clicked then send value and movie id to array 
	});

	$('#confirmYes').click(function() {
		// Find which movie was clicked
		var movieSelectedIdArr = $('.movie-block[data-movieSelected=true]').prop('id').split("_");
		var moviePos = movieSelectedIdArr[movieSelectedIdArr.length - 1] - 1;
		// Update choice number && Get new recommendations

		//change state of progress bar according to the choiceNumber 
		if (choiceNumber == 3) {
			var element = document.getElementById("pb_8");
			element.classList.add("done");
		} else if (choiceNumber == 7) {
			var element = document.getElementById("pb_9");
			element.classList.add("done");
		} else if (choiceNumber == 11) {
			var element = document.getElementById("pb_10");
			element.classList.add("done");
		}

		if (choiceNumber + 1 < maxChoices)
			showLoading(function(cb) {
				getChoiceSet(moviePos, cb);
			});
		else if (choiceNumber < maxChoices) {
			// Change appearance of the infobox
			delayAndShowRecommendation(function(cb) {
				getFinalRecommendationSet(moviePos, cb);
			});
		} else {
			var promises = [];

			promises.push(postChoices(movies[moviePos]._id));
			promises.push(postRecommendedChoice(movies[moviePos]._id));
			promises.push(postEvent('CHOOSE_FINAL_MOVIE', {message: "Final movie selected", id: movies[moviePos]._id}));

			promises.push(postChoiceNumber(function() {}));

			// When the final movie selected has been saved and the event logged,
			$.when.apply($, promises).done(function() {
				confirmUnload = false;
				location.reload(true);
			});
		}
	});

	$('#nextPage12').click(function() {
		var promises = [];
		promises.push(postChoiceNumberNoRefresh(function() {}));

		// When the ratings have been saved and the event logged,
		$.when.apply($, promises).done(function() {
			// Reload the page to the survey
			confirmUnload = false;
			location.reload(true);
		});
	});

	//ratings push 
	$('#ratingsButton').click(function() {
		for (var i = 1; i <= nrOfMovies; i++) {
			if(!$('input[name=rating_' + i + ']:checked').val()) {
				return;
			}
		}
		
		for (var i = 1; i <= nrOfMovies; i++) {
			if(!$('input[name=known_' + i + ']:checked').val()) {
				return;
			}
		}
		postRatings();
		postKnown();
		postEvent('RATE_MOVIE', {message: "Movies Rated", ratings: ratings, known: known});
		nextPage();
	});

	// Make sure client wants leave
	$(window).on('beforeunload', function() {
		if (confirmUnload)
			return 'We would really appreciate it if you could complete this survey for our project.' +
				' You can also come back to complete it later on from where you left.';
	});

	$(window).on("unload", function() {
		try {
			postEvent('DISCONNECT_USER', {message : 'Closed Connection'});
		} catch(e) {
			console.warn("Exception while window.onunload :: " + e);
		}
	});
});
//end of document 

function nextPage() {
	$.ajax({
		type: 'POST',
		url: '/api/update/choicenumber',
		// url: 'http://localhost:3000/mrs/events',
		data: {
			userid: userid
		},
		dataType: 'json',
		success: function() {
			confirmUnload = false;
			location.reload(true);
		},
		error: function(err) {
			console.log(err.responseText);
		}
	});
}
/**
 * Callback for when youtube IFrame script loads.
 * Load the youtube player.
 */
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		videoId: '',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
			'onError': onPlayerError
		}
	});
}

/**
 * Callback for when youtube player is loaded.
 */
function onPlayerReady() {
	$('#player').addClass('video');
}

/**
 * Callback for when youtube player state changes.
 */
function onPlayerStateChange(e) {
	if (e.data == YT.PlayerState.PAUSED) {
		if (currentTrailer !== null) {
			updateWatchedTrailers(currentTrailer, player.getCurrentTime());
			currentTrailer = null;
		}
	}
}

/**
 * Callback for when youtube player state encounters an error.
 */
function onPlayerError(e) {
	console.warn("Error in YT.Player :: " + JSON.stringify(e));
}

/**
 * Load the movie info, trailer and send events when
 * movie has been hovered/selected.
 */
function loadSelectedMovie(pos) {
	loadMovieDescription(pos);
	try {
		if (conditionNum == 2 || conditionNum == 3 || conditionNum == 4)
			loadTrailer(pos);
	} catch (e) {
		console.warn("Exception in loadSelectedMovie :: loadTrailer failed with error = " + e);
	}
}

/**
 * Get the total number of movies in our database
 */
function getMoviesCount(cb) {
	return $.ajax({
		type: 'GET',
		url: '/api/count',
		dataType: 'json',
		success: function(data) {
			cb(data.result);
		},
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * Load random movies
 */
function loadRandomMovies() {
	getMoviesCount(function(count) {
		var promises = [];
		for (var i = 0; i < nrOfMovies; i++) {
			var mID = 1 + Math.floor(Math.random() * count);
			//match randomly selected movie to movieID
			promises.push(loadMovieInfo(i, mID, 'num'));
		}
		$.when.apply($, promises).done(function() {
			postInitialMovies();
		});
	});
}

/**
 * Load the movie info on screen
 */
function loadMovieInfo(itemNr, mID, mType) {

	return getMovieInfo(mID, mType, function(movieInfo) {
		movies[itemNr] = movieInfo;
		itemNr++;

		// Load the correct poster URL
		var pictureURL;
		//if (movieInfo.rtPictureURL.length > 0) 
		// pictureURL = movieInfo.rtPictureURL;
		if (movieInfo.poster.length > 0)
			pictureURL = movieInfo.poster;
		else
			pictureURL = '/img/placeholder.png';

		$('#c' + itemNr).prop('src', pictureURL);
		//$('.block_holder li:nth-child(' + itemNr + ') .img-block').css('background-image', 'url(' + pictureURL + ')');
		//$('.block_holder li:nth-child(' + itemNr + ') .movietitle').text(movieInfo.title);
		//$('.block_holder li:nth-child(' + itemNr + ') .movieyear').text(movieInfo.year);
	});
}

/**
 * Retrieve movie info from database
 */
function getMovieInfo(mID, mType, cb) {
	// Choose the correct key type
	switch (mType) {
		case 'imdb':
			mType = 'imdbID';
			break;
		case 'movieid':
			mType = 'movieID';
			break;
		case 'num':
			mType = 'id_number';
			break;
		default:
			mType = '_id';
	}

	return $.ajax({
		type: 'GET',
		url: '/api/movies',
		data: {
			id: mID,
			type: mType
		},
		dataType: 'json',
		success: function(data) {
			cb(data.result[0]);
		},
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * Get trailer for a movie and load on screen
 */
function loadTrailer(pos) {
	if (movies[pos]) {
		if (movies[pos].trailer) {
			embedTrailer(movies[pos].trailer);
			currentTrailer = movies[pos].id_number;
		} else {
			getTrailer(movies[pos]._id, function(trailerKey) {
				movies[pos].trailer = trailerKey;
				embedTrailer(trailerKey);
				currentTrailer = movies[pos].id_number;
			});
		}
	}
}

/**
 * Embed the trailer on screen
 */
function embedTrailer(key) {
	//TEMP_FIX: Check if youtube player is loaded, else retry after 100 milliseconds
	//TODO: Implement proper callback structure involving youtube player and document ready.
	if ($('#player').hasClass('video')) {
		// Create and place the embed code on the page
		player.loadVideoById({
			'videoId': key
		});
		player.stopVideo();
		// var embed = '<iframe id="player" src="https://www.youtube.com/embed/' + key +
		//   '" frameborder="0" allowfullscreen class="video"></iframe>';
		// $('.trailer').html(embed);
	} else {
		setTimeout(function() {
			embedTrailer(key);
		}, 100);
	}
}

/**
 * Retreive trailer video data
 */
function getTrailer(mID, cb) {
	return $.ajax({
		type: 'GET',
		url: '/api/trailer',
		data: {
			id: mID
		},
		dataType: 'json',
		success: function(data) {
			cb(data.result);
		},
		error: function(err) {
			cb(null);
			currentTrailer = null;
			console.log(err.responseText);
		}
	});
}

/**
 * Load movie description like plot summary, cast, 
 * genre and director on-screen.
 */
function loadMovieDescription(pos) {
	//FIXME: Remove the data elements not needed
	$('#moviesummary').text(movies[pos].summary);
	$('#moviegenres').text(movies[pos].Genres);
	$('#moviedirector').text(movies[pos].director);
	$('#moviecast').text(movies[pos].cast);
	$('#movietitle').text(movies[pos].title);
	$('#movieyear').text(movies[pos].year);
	$('#movieposter').prop("src", movies[pos].poster);
	$('#mouseCap_video').attr('data-movie-id', movies[pos]._id).attr('data-movie-id-number', movies[pos].id_number);
	$('.movie_img').attr('data-movie-id', movies[pos]._id).attr('data-movie-id-number', movies[pos].id_number);
	$('.movie_info').attr('data-movie-id', movies[pos]._id).attr('data-movie-id-number', movies[pos].id_number);
}

/**
 * POST id of movie whose trailer was watched.
 */
function updateWatchedTrailers(mID, duration) {
	return $.ajax({
		type: 'POST',
		url: '/api/update/watchedtrailers',
		data: {
			userid: userid,
			movie: mID,
			choiceSetNumber: choiceSetNumber,
			duration: duration
		},
		dataType: 'json',
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * GET (POST) new recommendation set
 */
function getChoiceSet(pos, cb) {
	return $.ajax({
		type: 'POST',
		timeout: 10000,			
		url: 'http://131.155.121.165:8080/json/asynconeway/Choice',
		data: {
			userid: "" + userid,
			movieid: "" + movies[pos].movieID,
			learn_rate: learnRate,
			choice_number: "" + choiceNumber,
			discard_rate: discardRate,
			number_of_candidates: "" + nrOfMovies
		},
		dataType: 'json',
		success: function(data) {
			// Load the new choice set
			setTimeout(function() {
				loadChoiceSet('CHOOSE_MOVIE', movies[pos]._id, data, false, cb);
			}, delay);
		},
		error: function(err) {
			console.log("Error in getChoiceSet :: " + JSON.stringify(err));
			loadRandomMoviesOnError('CHOOSE_RANDOM_MOVIE_ON_ERROR', movies[pos]._id, false, cb);
		}
	});
}

/**
 * POST update choice number without refreshChoicesCount.
 */
function postChoiceNumberNoRefresh(cb) {
	return $.ajax({
		type: 'POST',
		url: '/api/update/choiceNumber',
		data: {
			userid: userid
		},
		dataType: 'json',
		success: function(data) {
			choiceNumber = data.result;

			// Execute callback if any
			if (typeof cb != 'undefined') cb();
		},
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * POST update choice number.
 */
function postChoiceNumber(cb) {
	return $.ajax({
		type: 'POST',
		url: '/api/update/choiceNumber',
		data: {
			userid: userid
		},
		dataType: 'json',
		success: function(data) {
			choiceNumber = data.result;
			refreshChoicesCount();

			// Execute callback if any
			if (typeof cb != 'undefined') cb();
		},
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * Update the remaining number of choices to
 * be made on-screen.
 */
function refreshChoicesCount() {
	$(".intro span:first-child").text(maxChoices - choiceNumber + " More Choice(s) To Go!");
	$("#pageno span").text(maxChoices - choiceNumber);
	if (choiceNumber == maxChoices) /*For page no. 11*/ {
		$("body").css({
			"background-color": "#69A9DA",
			"opacity": "1"
		});
		$(".intro span:first-child").text("Final Recommendation");
	}
	if (choiceNumber == maxChoices + 1) /*For page no. 12*/ {
		$(".intro span:first-child").text("Now Rate these movies");
		$("#pageno span").text("0");
	}
	if (conditionNum == 2 || conditionNum == 3 || conditionNum == 4) {
		$("#mouseCap_video").hide();
	}
}

/**
 * Show Loading Overlay for loading delays
 * 
 */
function showLoading(cb) {
	$('body').loading('start');
	$('#confirmation_modal .close').click();
	cb(function() {
		$('body').loading('stop');
	});
}

/**
 * Show Loading screen for Final Recommendation
 * 
 */
function delayAndShowRecommendation(cb) {
	$(".parent_container").addClass("hide");
	$(".loading_container").removeClass("hide");
	$('#confirmation_modal .close').click();
	setTimeout(function() {
		cb(function() {
			$(".loading_container").addClass("hide");
			$(".parent_container").removeClass("hide");
		});
	}, delay*3);
}

/**
 * GET (POST) final recommendation set
 */
function getFinalRecommendationSet(pos, cb) {
	return $.ajax({
		type: 'GET',
		timeout: 10000,
		url: 'http://131.155.121.165:8080/recommendation/' + userid + '/' +
			nrOfMovies + '/' + diversification + '/alternative',
		data: {
			format: 'json'
		},
		dataType: 'json',
		success: function(data) {
			// Load the new choice set
			setTimeout(function() {
				loadChoiceSet('CHOOSE_MOVIE', movies[pos]._id, data, true, cb);
			}, delay);
		},
		error: function(err) {
			console.log("Error in getFinalRecommendationSet :: " + JSON.stringify(err));
			loadRandomMoviesOnError('CHOOSE_RANDOM_MOVIE_ON_ERROR', movies[pos]._id, true, cb);
		}
	});
}

/**
 * Load the new choice set on-screen
 */
function loadChoiceSet(event, selectedId, data, isFinal, cb) {
	// First, reset movies list on-screen
	resetMovies();

	// Filter the new recommendation set
	data = data.map(function(movie) {
		return movie.itemid;
	});
	data.shift();

	// Load the new recommendation set
	var promises = [];
	for (var i in data) {
		var mID = data[i];
		promises.push(loadMovieInfo(i, mID, 'movieid'));
	}

	// Save the movie selected
	postChoices(selectedId);

	// Update choice number
	postChoiceNumber(function() {
		// Log choice set load event
		postEvent(event, {id: selectedId, choiceNumber: choiceNumber});
	});

	// When movie info is loaded for all movies
	$.when.apply($, promises).done(function() {
		// Update the movies list on the backend for the user
		postMovies();
		// Update Index of the choice set being shown
		choiceSetNumber++;
		if(isFinal) postFinalMovies();
		if(typeof cb != 'undefined') cb();
	});
}

/**
 * Load the new choice set on-screen with random movies
 * NOTE: This will be called only on Error and is for TESTING purposes only.
 */
function loadRandomMoviesOnError(event, selectedId, isFinal, cb) {
	// First, reset movies list on-screen
	resetMovies();

	// Load the new recommendation set
	getMoviesCount(function(count) {
		var promises = [];
		for (var i = 0; i < nrOfMovies; i++) {
			var mID = 1 + Math.floor(Math.random() * count);
			//match randomly selected movie to movieID
			promises.push(loadMovieInfo(i, mID, 'num'));
		}
		
		// Save the movie selected
		promises.push(postChoices(selectedId));

		// Update choice number
		promises.push(postChoiceNumber(function() {
			// Log choice set load event
			postEvent(event, {id: selectedId, choiceNumber: choiceNumber});
		}));
		
		// When movie info is loaded for all movies
		$.when.apply($, promises).done(function() {
			// Update the movies list on the backend for the user
			postMovies();
			// Update Index of the choice set being shown
			choiceSetNumber++;
			if(isFinal) postFinalMovies();
			if(typeof cb != 'undefined') cb();
		});
	});
}

/**
 * Reset movies info in movies list.
 */
function resetMovies() {
	movies = [];
	for (var i = 1; i <= nrOfMovies; i++) {
		var pictureURL = 'img/placeholder.png';
		$('#confirmation_modal .close').click();
		$(".movie_img").hide();
		$(".movie_info").hide();
		$('#movie_display_block').css("outline", "none");
		var movieSelectedIdArr = $('.movie-block[data-movieSelected=true]');
		$(movieSelectedIdArr).find("button").css("background-color", "#8c8c8c");
		$(movieSelectedIdArr).find("button").text("Choose");
		$(movieSelectedIdArr).find(".wrapper-block").css("outline", "none");
		$(movieSelectedIdArr).find(".hover-block").text("Click to read info");
		$(movieSelectedIdArr).find(".hover-block").hide();
		$(".next-button").children("button").css({
			"cursor": "not-allowed",
			"opacity": "0.6",
			"background-color": "#8c8c8c"
		});
		$(".next-button").children("button").prop("disabled", true);
		$(".intro span:first-child").text(9 - choiceNumber + " More Choices To Go!");
		$(".intro").show();
		$("#pageno span").text(9 - choiceNumber);
		$(".highlight").css({
			"background-color": "#FFFFFF",
			"opacity": "0"
		});
		/*$('.movieslist li:nth-child(' + i + ') .cover').css('background-image', 'url(' + pictureURL + ')');
		$('.movieslist li:nth-child(' + i + ') .movietitle').text('{title}');
		$('.movieslist li:nth-child(' + i + ') .movieyear').text('{year}');*/
	}
}

/**
 * POST update the final set of movie choices.
 */
function postChoices(mID) {
	return $.ajax({
		type: 'POST',
		url: '/api/update/choices',
		data: {
			userid: userid,
			movie: mID
		},
		dataType: 'json',
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * POST final selected recomended choice.
 */
function postRecommendedChoice(mID) {
	return $.ajax({
		type: 'POST',
		url: '/api/update/recommendedchoice',
		data: {
			userid: userid,
			movie: mID
		},
		dataType: 'json',
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * POST update the selected ratings.
 */
function postRatings() {

	//var stars= ('input[name=rating_'+i+']:checked').val();
	//var known= ('input[name=known_'+i+']:checked').val(); 
	for (var i = 1; i <= nrOfMovies; i++) {
		ratings.push($('input[name=rating_' + i + ']:checked').val());
		//known.push($('input[name=known_'+i+']:checked').val());
	}

	$.ajax({
		type: 'POST',
		url: '/api/update/ratings',
		data: {
			userid: userid,
			//movie: mID,
			ratings: JSON.stringify(ratings)
			//known: JSON.stringify(known)
		},
		dataType: 'json',
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * POST update the known items.
 */
function postKnown() {

	//var stars= ('input[name=rating_'+i+']:checked').val();
	//var known= ('input[name=known_'+i+']:checked').val(); 
	for (var i = 1; i <= nrOfMovies; i++) {
		//ratings.push($('input[name=rating_'+i+']:checked').val());
		known.push($('input[name=known_' + i + ']:checked').val());
	}

	$.ajax({
		type: 'POST',
		url: '/api/update/known',
		data: {
			userid: userid,
			//movie: mID,
			//ratings: JSON.stringify(ratings)
			known: JSON.stringify(known)
		},
		dataType: 'json',
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * Update the movies that are on-screen to the backend
 * to reload the same movies next time.
 */
function postMovies() {
	var movieIds = movies.map(function(movie) {
		return movie._id;
	});
	return $.ajax({
		type: 'POST',
		url: '/api/update/movies',
		data: {
			userid: userid,
			movies: JSON.stringify(movieIds)
		},
		dataType: 'json',
		success: function() {
			postEvent("LOAD_MOVIES", {ids: movieIds, choiceNumber: choiceNumber});
		},
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * Update the intial set of movies that are on-screen to the backend
 */
function postInitialMovies() {
	var movieIds = movies.map(function(movie) {
		return movie._id;
	});
	return $.ajax({
		type: 'POST',
		url: '/api/update/initialmovies',
		data: {
			userid: userid,
			movies: JSON.stringify(movieIds)
		},
		dataType: 'json',
		success: function() {
			postEvent("LOAD_INITIAL_MOVIES", {ids: movieIds, choiceNumber: choiceNumber});
		},
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * Update the intial set of movies that are on-screen to the backend
 */
function postFinalMovies() {
	var movieIds = movies.map(function(movie) {
		return movie._id;
	});
	return $.ajax({
		type: 'POST',
		url: '/api/update/finalmovies',
		data: {
			userid: userid,
			movies: JSON.stringify(movieIds)
		},
		dataType: 'json',
		success: function() {
			postEvent("LOAD_FINAL_MOVIES", {ids: movieIds, choiceNumber: choiceNumber});
		},
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * POST id of movie that was hovered/clicked on (Movie Info)
 */
function updateHoveredInfo(mID) {
	return $.ajax({
		type: 'POST',
		url: '/api/update/hoveredinfo',
		data: {
			userid: userid,
			movie: mID,
			choiceSetNumber: choiceSetNumber
		},
		dataType: 'json',
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * POST id of movie that was hovered/clicked on (Movie Poster)
 */
function updateHoveredPoster(mID) {
	return $.ajax({
		type: 'POST',
		url: '/api/update/hoveredposter',
		data: {
			userid: userid,
			movie: mID,
			choiceSetNumber: choiceSetNumber
		},
		dataType: 'json',
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * POST id of movie that was hovered/clicked on.
 */
function updateHoveredMovies(mID) {
	return $.ajax({
		type: 'POST',
		url: '/api/update/hoveredmovies',
		data: {
			userid: userid,
			movie: mID,
			choiceSetNumber: choiceSetNumber
		},
		dataType: 'json',
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * Log any events on the backend.
 */
function postEvent(event, eventdesc) {
	return $.ajax({
		type: 'POST',
		url: '/api/update/event',
		data: {
			userid: userid,
			event: event,
			eventdesc: JSON.stringify(eventdesc)
		},
		dataType: 'json',
		error: function(err) {
			console.log(err.responseText);
		}
	});
}