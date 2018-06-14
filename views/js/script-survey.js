"use strict";
var nrOfQns = 0;
console.log(window.location.pathname);
var userFromUrl = window.location.pathname;
var userid = userFromUrl.replace('/', '');
var feedback = [];
var secondanswers = [];

$(document).ready(function() {
	nrOfQns = $('.question').length;
	
	$('#surveypage1, #surveypage1button,#surveypage2, #surveypage2button, #surveypage3, #surveypage3button, #surveypage4, #surveypage4button').hide();
	$('#surveypage5, #surveypage5button,#surveypage6, #surveypage6button, #surveypage7, #surveypage7button,#surveypage8, #surveypage8button').hide();
	$('#surveypage9, #surveypage9button, #surveypage10, #surveypage10button, #surveypage11, #surveypage11button, #surveypage12, #surveypage12button, #surveypage13, #surveypage13button, #surveypage14, #surveypage14button, #surveypage15, #surveypage15button, #surveypage16, #surveypage16button').hide();

	$(".question .rad_row td").click(function() {
		$(this).find('input[type="radio"]').each(function() {
			$(this).prop('checked', true);
		});
		$(this).parent().parent().css("border-left", "3px solid #00cc00");
	});

	//disable begin button if comment field is not submitted 
	$('#beginbutton').attr('disabled', true);
	//$('.survey-next-button').children('button').css({"cursor":"pointer","opacity":"1","background-color":"#5cb85c"});

	$('#textbox').keyup(function() {
		if ($(this).val().length != 0) {
			$('#beginbutton').attr('disabled', false);
			$('.next-button button').css({
				"cursor": "pointer",
				"opacity": "1",
				"background-color": "#5cb85c"
			});
		} else {
			$('#beginbutton').attr('disabled', true);
		}

	});

	//go to page 1
	$('#beginbutton').click(function() {
		var isUnderProcess = $(this).attr('data-under-process');
		if(typeof isUnderProcess !== typeof undefined && isUnderProcess == "true") {
			console.warn("#beginbutton :: Prevented multiple clicks.");
			return;
		}
		$(this).attr("data-under-process", "true");
		//send comment from comment box
		var text = $('#textbox').val();
		postFeedback(text, function() {
			postEvent('DONE_FEEDBACK', {message: 'Feedback sent'});
			$('#surveyintro, #beginbutton').fadeOut("slow", function() {
				$('#surveyintro, #beginbutton').hide();
				$('#surveypage1, #surveypage1button').show().fadeIn("slow");
			});
		});
	});

	$('#surveypage1button').click(function() {
		var isUnderProcess = $(this).attr('data-under-process');
		if(typeof isUnderProcess !== typeof undefined && isUnderProcess == "true") {
			console.warn("#surveypage1button :: Prevented multiple clicks.");
			return;
		}
		$(this).attr("data-under-process", "true");
		var hookpage = $('#surveypage1');
		if (isSurveyComplete(hookpage)) {
			postEvent('START_FINAL_SURVEY', {message: 'Started Final Survey'});
			//go to page 2
			secondanswers = saveSurveyResults(hookpage, secondanswers);
			$('#surveypage1, #surveypage1button').fadeOut("slow", function() {
				$('#surveypage1, #surveypage1button').hide();
				$('#surveypage2, #surveypage2button').show().fadeIn("slow");
			});
		} else {
			$(this).attr("data-under-process", "false");
		}
	});
	
	for(let pageNo = 2; pageNo <= 15; pageNo++) {
		(function(pageNo) {
			$('#surveypage' + pageNo + 'button').click(function() {
				var isUnderProcess = $(this).attr('data-under-process');
				if(typeof isUnderProcess !== typeof undefined && isUnderProcess == "true") {
					console.warn('#surveypage' + pageNo + 'button :: Prevented multiple clicks.');
					return;
				}
				$(this).attr("data-under-process", "true");
				let hookpage = $("#surveypage" + pageNo);
				if (isSurveyComplete(hookpage)) {
					secondanswers = saveSurveyResults(hookpage, secondanswers);
					$('#surveypage' + pageNo + ', #surveypage' + pageNo + 'button').fadeOut("slow", function() {
						let nextPageNo = pageNo + 1;
						$('#surveypage' + pageNo + ', #surveypage' + pageNo + 'button').hide();
						$('#surveypage' + nextPageNo + ', #surveypage' + nextPageNo + 'button').show().fadeIn("slow");
					});
				} else {
					$(this).attr("data-under-process", "false");
				}
			});
		})(pageNo);
	}

	//last survey page
	$('#surveypage16button').click(function() {
		var isUnderProcess = $(this).attr('data-under-process');
		if(typeof isUnderProcess !== typeof undefined && isUnderProcess == "true") {
			console.warn("#surveypage15button :: Prevented multiple clicks.");
			return;
		}
		$(this).attr("data-under-process", "true");
		var hookpage = $('#surveypage16');
		if (isSurveyComplete(hookpage)) {
			secondanswers = saveSurveyResults(hookpage, secondanswers);
			finish();
		} else {
			$(this).attr("data-under-process", "false");
		}
	});
	// Make sure client wants leave
	$(window).on('beforeunload', function() {
		if (confirmUnload)
			return 'We would really appreciate it if you could complete this survey for our course project.' +
				' You can also come back to complete it later on from where you left.';
	});

	$(window).on('unload', function(e) {
		$('[data-under-process]').attr('data-under-process', "false");
		postEvent('DISCONNECT_USER', {message: 'Closed connection'});
	});
});

function isSurveyComplete(hookpage) {
	var counter = 0;
	for (var i = 1; i <= hookpage.find('.question .rad_row').length; i++) {
		if (!hookpage.find('input[name=radOpt_' + i + ']:checked').length) {
			hookpage.find('input[name=radOpt_' + i + ']').parent().parent().parent().css("border-left", "3px solid #ff3300");
			counter = 1;
		}
	};
	if (counter == 1) return false;
	return true;
}

function saveSurveyResults(hookpage, results) {
	hookpage.find(".question").each(function() {
		$(this).find('input[type="radio"]:checked').each(function() {
			results.push($(this).val());
        });
	});
	return results;
}

/**
 * Save feedback on whether or not something went wrong
 */
function postFeedback(text, cb) {
	//var feedback = [];

	$.ajax({
		type: 'POST',
		url: '/api/update/feedback',
		data: {
			userid: userid,
			feedback: text
		},
		dataType: 'json',
		success: function() {
			cb();
		},
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * Save survey answers online and finish.
 */
function finish() {
	$.ajax({
		type: 'POST',
		url: '/api/update/secondanswers',
		data: {
			userid: userid,
			secondanswers: JSON.stringify(secondanswers)
		},
		dataType: 'json',
		success: function() {
			postEvent('DONE_FINAL_SURVEY', {message: 'Final Survey Completed'});
			confirmUnload = false;
			location.reload(true);
		},
		error: function(err) {
			console.log(err.responseText);
		}
	});
}

/**
 * Check if all questions have been answered.
 
function isSurveyComplete() {
	for(var i=1; i<=nrOfQns; i++) {
		if (!$('input[name=qn'+i+']:checked').length) {
			return false;
		}
	}
	return true;
}
*/
/**
 * Log any events on the backend.
 */
function postEvent(event, eventdesc) {
	$.ajax({
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