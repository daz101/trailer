"use strict";
//var userid = Math.floor((Math.random() * 1000000) + 1);

console.log(window.location.pathname);
var userFromUrl = window.location.pathname;
var userid = userFromUrl.replace('/', '');
var consent_check = 0;
//var nrOfQns = $('.question .rad_row').length;
var firstanswers = [];

$(document).ready(function() {
	/*
	//GET user's IP Address and POST to the database
	$.getJSON('https://api.ipify.org?format=json', function(data) {
		postIp(data.ip); 
		
    });
		*/ 
		
		
	//welcome
	$('#consentBody, #consentbutton, #resizeBody, #resizebutton').hide();
	$('#welcomebutton').click(function() {
		postEvent('CLICK_WELCOME', {
			message: 'Clicked "Start Welcome"'
		});
		$('#welcomeBody, #welcomebutton').fadeOut("slow", function() {
			$('#welcomeBody, #welcomebutton').hide();
			$('#consentBody, #consentbutton').show().fadeIn("slow");
		});
	});

	$('#consentbutton').click(function() {
		if (consent_check == 1) {
			postEvent('CLICK_CONSENT', {
				message: 'Clicked "Start Consent"'
			});
			$('#consentBody, #consentbutton').fadeOut("slow", function() {
				$('#consentBody, #consentbutton').hide();
				$('#resizeBody, #resizebutton').show().fadeIn("slow");
			});
		} else {
			$("#consent_Q").css("border-left", "3px solid #aa3b3b");
		}
	});

	$('input[type=checkbox][name=consent_test]').change(function() {
		$(".consent-next").children("button").css({
			"cursor": "pointer",
			"opacity": "1",
			"background-color": "#5cb85c"
		});
		consent_check = 1;
	});

	$("#consent_Q tr td").click(function() {
		$('#consentCheckbox').trigger('click');
		$(this).find('input[type="checkbox"]').each(function() {
			$(this).prop('checked', true);
		});
		$("#consent_Q").css("border-left", "3px solid #00cc00");
	});

	$('#resizebutton').click(function() {
		postEvent('CLICK_RESIZE', {
			message: 'Clicked "Start Resize"'
		});
		start();
	});
	//end of welcome 

	// ------------------------FIRST SURVEY PAGES START-------------------------------------------------------
	//INTERACTIONS ON RADIO BUTTON CLICK
	$(".question .rad_row td").click(function() {
		$(this).find('input[type="radio"]').each(function() {
			$(this).prop('checked', true);
		});
		$(this).parent().parent().css("border-left", "3px solid #00cc00");
	});

	$('#verbalpage1button, #verbalpage1, #verbalpage2, #verbalpage2button, #verbalpage3, #verbalpage3button, #verbalpage4, #resize_nextOverview').hide();

	//INTERACTIONS ON NEXT BUTTON CLICK
	
	//Demographics
	$('#verbaldemopagebutton').click(function() {
		var isUnderProcess = $(this).attr('data-under-process');
		if(typeof isUnderProcess !== typeof undefined && isUnderProcess == "true") {
			console.warn("#verbaldemopagebutton :: Prevented multiple clicks.");
			return;
		}
		$(this).attr("data-under-process", "true");
		var hookpage = $("#demo_section");
		if (isSurveyComplete(hookpage)) {
			postEvent('CLICK_VERBAL_VISUAL_SURVEY', {
				message: 'Clicked "Verbal Visual Survey Demo Page "'
			});
			//Loading page 1
			$('#demo_section, #verbaldemopagebutton').fadeOut("slow", function() {
				$('#demo_section, #verbaldemopagebutton').hide();
				$('#verbalpage1, #verbalpage1button').show().fadeIn("slow");
			});
		} else {
			$(this).attr("data-under-process", "false");
		}
	});
	
	
	
	//Survey page 1
	$('#verbalpage1button').click(function() {
		var isUnderProcess = $(this).attr('data-under-process');
		if(typeof isUnderProcess !== typeof undefined && isUnderProcess == "true") {
			console.warn("#verbalpage1button :: Prevented multiple clicks.");
			return;
		}
		$(this).attr("data-under-process", "true");
		var hookpage = $("#verbalpage1");
		if (isSurveyComplete(hookpage)) {
			postEvent('CLICK_VERBAL_VISUAL_SURVEY', {
				message: 'Clicked "Verbal Visual Survey Page 1"'
			});
			//Loading page 2
			$('#verbalpage1, #verbalpage1button').fadeOut("slow", function() {
				$('#verbalpage1, #verbalpage1button').hide();
				$('#verbalpage2, #verbalpage2button').show().fadeIn("slow");
			});
		} else {
			$(this).attr("data-under-process", "false");
		}
	});

	//Survey page 2
	$('#verbalpage2button').click(function() {
		var isUnderProcess = $(this).attr('data-under-process');
		if(typeof isUnderProcess !== typeof undefined && isUnderProcess == "true") {
			console.warn("#verbalpage2button :: Prevented multiple clicks.");
			return;
		}
		$(this).attr("data-under-process", "true");
		var hookpage = $("#verbalpage2");
		if (isSurveyComplete(hookpage)) {
			postEvent('CLICK_VERBAL_VISUAL_SURVEY', {
				message: 'Clicked "Started Verbal Visual Survey Page 2"'
			});
			$('#verbalpage2, #verbalpage2button').fadeOut("slow", function() {
				$('#verbalpage2, #verbalpage2button').hide();
				$('#verbalpage3, #verbalpage3button').show().fadeIn("slow");
			});
		} else {
			$(this).attr("data-under-process", "false");
		}
	});

	// Survey page 3
	$('#verbalpage3button').click(function() {
		var isUnderProcess = $(this).attr('data-under-process');
		if(typeof isUnderProcess !== typeof undefined && isUnderProcess == "true") {
			console.warn("#verbalpage3button :: Prevented multiple clicks.");
			return;
		}
		$(this).attr("data-under-process", "true");
		var hookpage = $("#verbalpage3");
		if (isSurveyComplete(hookpage)) {
			postEvent('CLICK_VERBAL_VISUAL_SURVEY', {
				message: 'Clicked "Started Verbal Visual Survey Page 3"'
			});
			$('#verbalpage3, #verbalpage3button').fadeOut("slow", function() {
				$('#verbalpage3, #verbalpage3button').hide();
				$('#verbalpage4, #resize_nextOverview').show().fadeIn("slow");
			});
		} else {
			$(this).attr("data-under-process", "false");
		}
	});

	//Survey page 4
	$('#resize_nextOverview').click(function() {
		var isUnderProcess = $(this).attr('data-under-process');
		if(typeof isUnderProcess !== typeof undefined && isUnderProcess == "true") {
			console.warn("#resize_nextOverview :: Prevented multiple clicks.");
			return;
		}
		$(this).attr("data-under-process", "true");
		var hookpage = $("#verbalpage4");
		if (isSurveyComplete(hookpage)) {
			postEvent('CLICK_VERBAL_VISUAL_SURVEY', {
				message: 'Clicked "Finished Verbal Visual Survey"'
			});
			finish(start);
		} else {
			$(this).attr("data-under-process", "false");
		}
	});

	/*
	 FUNCTION TO CHECK IF ALL QUESTIONS HAVE BEEN ANSWERED.
	 */

	function isSurveyComplete(hookpage) {
		var counter = 0;
		for (var i = 1; i <= hookpage.find('.question .rad_row').length; i++) {
			if (!hookpage.find('input[name=radOpt_' + i + ']:checked').length) {
				hookpage.find('input[name=radOpt_' + i + ']').parent().parent().parent().css("border-left", "3px solid #ff3300");
				counter = 1;
			}
		};
		if (counter == 1) return false;
		else {

			for (var i = 1; i <= hookpage.find('.question .rad_row').length; i++) {
				firstanswers.push(hookpage.find('input[name=radOpt_' + i + ']:checked').val());
			};
			return true;

		}
	}
	// ------------------------FIRST SURVEY PAGES END-------------------------------------------------------

	//-------------------------OVERVIEW PAGE STARTS---------------------------------------------------------
	$('#begin, #beginbutton, #instructions3button').hide();

	$('#overviewbutton').click(function() {
		var isUnderProcess = $(this).attr('data-under-process');
		if(typeof isUnderProcess !== typeof undefined && isUnderProcess == "true") {
			console.warn("#overviewbutton :: Prevented multiple clicks.");
			return;
		}
		$(this).attr("data-under-process", "true");
		postEvent('CLICK_OVERIVEW', {
			message: 'Clicked "Start Overview"'
		});
		$('#overviewbutton, #overview').fadeOut("slow", function() {
			$('#overviewbutton, #overview').hide();
			$('#begin, #beginbutton').show().fadeIn("slow");

		});
	});

	$('#beginbutton').click(function() {
		var isUnderProcess = $(this).attr('data-under-process');
		if(typeof isUnderProcess !== typeof undefined && isUnderProcess == "true") {
			console.warn("#beginbutton :: Prevented multiple clicks.");
			return;
		}
		$(this).attr("data-under-process", "true");
		postEvent('CLICK_BEGIN', {
			message: 'Clicked "Start Begin"'
		});
		start();
	});

	//-------------------------OVERVIEW PAGE ENDS---------------------------------------------------------

	// Make sure client wants leave
	$(window).on('beforeunload', function() {
		if (confirmUnload)
			return 'We would really appreciate it if you could complete this survey for our course project.' +
				' You can also come back to complete it later on from where you left.';
	});

	$(window).on('unload', function() {
		$('[data-under-process]').attr('data-under-process', "false");
		postEvent('DISCONNECT_USER', {
			message: 'Closed Connection'
		});
	});

});

/**
 * Update choice number and reload to start.
 */
function start() {
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

function launchnow() {
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

function finish(cb) {
	$.ajax({
		type: 'POST',
		url: '/api/update/firstanswers',
		data: {
			userid: userid,
			firstanswers: JSON.stringify(firstanswers)
		},
		dataType: 'json',
		success: function() {
			// confirmUnload = false;
			// location.reload(true);
			cb();
		},
		error: function(err) {
			console.log(err.responseText);
		}
	});
}


/**
 * POST users' IP Address.

function postIp(desc) {
	$.ajax({
		type: 'POST',
		url: '/api/update/ipaddress',
		data: {
			userid: userid,
			desc: JSON.stringify(desc)
		},
		success: function(desc) {
			console.log(desc);
		},
		dataType: 'json',
		error: function(err) {
			console.log(err.responseText);
		}
	});
}
 */
/**
 * Log any events on the backend.
 */
function postEvent(event, eventdesc) {
	$.ajax({
		type: 'POST',
		url: '/api/update/event',
		//url: 'http://localhost:3000/mrs/events',
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