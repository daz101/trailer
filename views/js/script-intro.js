"use strict";
//var userid = Math.floor((Math.random() * 1000000) + 1);

console.log(window.location.pathname);
var userFromUrl = window.location.pathname;
var userid = userFromUrl.replace('/', '');
var consent_check=0; 
var nrOfQns = $('.question .rad_row').length;

$(document).ready(function() {
	//welcome
  $('#consentBody, #consentbutton, #resizeBody, #resizebutton').hide();
   $('#welcomebutton').click(function() {
    postEvent('Clicked "Start Welcome"', null);
	$('#welcomeBody, #welcomebutton').fadeOut("slow", function() {
      $('#welcomeBody, #welcomebutton').hide();
      $('#consentBody, #consentbutton').show().fadeIn("slow");
	   });
	});

	$('#consentbutton').click(function() {
		if(consent_check==1){
    postEvent('Clicked "Start Consent"', null);
	$('#consentBody, #consentbutton').fadeOut("slow", function() {
      $('#consentBody, #consentbutton').hide();
	$('#resizeBody, #resizebutton').show().fadeIn("slow");
    }); 
	}
	else{
		$("#consent_Q").css("border-left","3px solid #aa3b3b");
	}
	});
	
	$('input[type=checkbox][name=consent_test]').change(function(){
	$(".consent-next").children("button").css({"cursor":"pointer","opacity":"1","background-color":"#5cb85c"});
	consent_check=1;
});

$( "#consent_Q tr td" ).click(function() {
	$('#consentCheckbox').trigger('click');
	$(this).find('input[type="checkbox"]').each(function() {
	$(this).prop('checked',true);
	});
	$("#consent_Q").css("border-left","3px solid #00cc00");
});
	
	$('#resizebutton').click(function() {	
    postEvent('Clicked "Start Resize"', null);
	start();
    }); 
	//end of welcome 
	
	//first survey 
	$( "#Q1 .rad_row td" ).click(function() { 
	$(this).find('input[type="radio"]').each(function() {
	$(this).prop('checked',true);
	});
	$("#Q1").css("border-left","3px solid #00cc00");
});

$( "#Q2 .rad_row td" ).click(function() { 
	$(this).find('input[type="radio"]').each(function() {
	$(this).prop('checked',true);
	});
	$("#Q2").css("border-left","3px solid #00cc00");
});

$( "#Q3 .rad_row td" ).click(function() { 
	$(this).find('input[type="radio"]').each(function() {
	$(this).prop('checked',true);
	});
	$("#Q3").css("border-left","3px solid #00cc00");
});
	$('#verbalpage2, #verbalpage2button, #verbalpage3, #verbalpage3button, #verbalpage4, #resize_nextOverview').hide();
	
	$('#verbalpage1button').click(function() {
		if(isSurveyComplete()){
    postEvent('Clicked "Started Verbal Visual Survey"', null);
	//page 2
	$('#verbalpage1, #verbalpage1button').fadeOut("slow", function() {
      $('#verbalpage1, #verbalpage1button').hide();
      $('#verbalpage2, #verbalpage2button').show().fadeIn("slow");
	   });
	}
	else{
		$(".question").css("border-left","3px solid #ff3300");
	}
	});
	
	//page 3
	$('#verbalpage2button').click(function() {
	$('#verbalpage2, #verbalpage2button').fadeOut("slow", function() {
      $('#verbalpage2, #verbalpage2button').hide();
      $('#verbalpage3, #verbalpage3button').show().fadeIn("slow");
	   });
	});
	
	//page 4
	$('#verbalpage3button').click(function() {
	$('#verbalpage3, #verbalpage3button').fadeOut("slow", function() {
      $('#verbalpage3, #verbalpage3button').hide();
      $('#verbalpage4, #resize_nextOverview').show().fadeIn("slow");
	   });
	});
	
	

	
	//end of first survey 
	
	// Make sure client wants leave
  $(window).on('beforeunload', function() {
    if(confirmUnload)
      return 'We would really appreciate it if you could complete this survey for our course project.'
            + ' You can also come back to complete it later on from where you left.';
  });

  $(window).on('unload', function() {
    postEvent('Closed connection', null);
  });

});

/**
 * Check if all questions have been answered.
 */
function isSurveyComplete() {
	/*for(var i=1; i<=nrOfQns; i++) {
		if (!$('input[name=rad_row'+i+']:checked').length) {
			return false;
		}
		return true;
	}*/
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
			return true;
		    }
			else{
				return false; 
			}
	    });
	   
});
}

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
      eventdesc: eventdesc
    },
    dataType: 'json',
    error: function(err) {
      console.log(err.responseText);
    }
  });
}