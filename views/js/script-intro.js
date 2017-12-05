"use strict";
//var userid = Math.floor((Math.random() * 1000000) + 1);

console.log(window.location.pathname);
var userFromUrl = window.location.pathname;
var userid = userFromUrl.replace('/', '');
var consent_check=0; 
//var nrOfQns = $('.question .rad_row').length;
var firstanswers = [];

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
	
// ------------------------FIRST SURVEY PAGES START-------------------------------------------------------
	//INTERACTIONS ON RADIO BUTTON CLICK
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
	
	
//INTERACTIONS ON NEXT BUTTON CLICK
	//Survey page 1
	$('#verbalpage1button').click(function() {
		var hookpage = $("#verbalpage1");
		if(isSurveyComplete(hookpage))
		{
			postEvent('Clicked "Started Verbal Visual Survey"', null);
			//Loading page 2
			$('#verbalpage1, #verbalpage1button').fadeOut("slow", function() {
			  $('#verbalpage1, #verbalpage1button').hide();
			  $('#verbalpage2, #verbalpage2button').show().fadeIn("slow");
			   });
	   }
	});
	
	//Survey page 2
	$('#verbalpage2button').click(function() {
		var hookpage = $("#verbalpage2");
		if(isSurveyComplete(hookpage))
		{
		  $('#verbalpage2, #verbalpage2button').fadeOut("slow", function() {
		  $('#verbalpage2, #verbalpage2button').hide();
		  $('#verbalpage3, #verbalpage3button').show().fadeIn("slow");
		   });
		}
	});
	
	// Survey page 3
	$('#verbalpage3button').click(function() {
		var hookpage = $("#verbalpage3");
		if(isSurveyComplete(hookpage))
		{
		  $('#verbalpage3, #verbalpage3button').fadeOut("slow", function() {
		  $('#verbalpage3, #verbalpage3button').hide();
		  $('#verbalpage4, #resize_nextOverview').show().fadeIn("slow");
		   });
		}
	});
	
	//Survey page 4
	$('#resize_nextOverview').click(function() {
		var hookpage = $("#verbalpage4");
		if(isSurveyComplete(hookpage))
		{
		   finish();
		   start();
		}
	});
	
/*
 FUNCTION TO CHECK IF ALL QUESTIONS HAVE BEEN ANSWERED.
 */
 
function isSurveyComplete(hookpage) {
	var counter=0;
		for(var i=1; i<=hookpage.find('.question .rad_row').length; i++) 
		{
			if (!hookpage.find('input[name=radOpt_'+i+']:checked').length) 
			{
				hookpage.find('input[name=radOpt_'+i+']').parent().parent().parent().css("border-left","3px solid #ff3300");
				counter=1;
			}
        };
		if(counter==1)return false;
		else{

		for(var i=1; i<=hookpage.find('.question .rad_row').length; i++) 
		{
			firstanswers.push(hookpage.find('input[name=radOpt_'+i+']:checked').val());
        };	
		return true;
		
	   }
}
// ------------------------FIRST SURVEY PAGES END-------------------------------------------------------
	
	//----------------OVERVIEW PAGE----------------
	$('#begin, #beginbutton, #instructions1, #instructions1button, #instructions2, #instructions2button, #instructions3, #instructions3button').hide();
	
	$('#overviewbutton').click(function() {
    postEvent('Clicked "Start Overview"', null);
	$('#overviewbutton, #overview').fadeOut("slow", function() {
      $('#overviewbutton, #overview').hide();
      $('#instructions1, #instructions1button').show().fadeIn("slow");
	  introJs().start(); 
	   });
	});
	
	
	$('#instructions1button').click(function() {
	$('#instructions1, #instructions1button').fadeOut("slow", function() {
      $('#instructions1, #instructions1button').hide();
      $('#instructions2, #instructions2button').show().fadeIn("slow");
	   introJs().start(); 
	   });
	});
	
	$('#instructions2button').click(function() {
	$('#instructions2, #instructions2button').fadeOut("slow", function() {
      $('#instructions2, #instructions2button').hide();
      $('#instructions3, #instructions3button').show().fadeIn("slow");
	   introJs().start(); 
	   });
	});
	
	$('#instructions3button').click(function() {
	$('#instructions3, #instructions3button').fadeOut("slow", function() {
      $('#instructions3, #instructions3button').hide();
      $('#begin, #beginbutton').show().fadeIn("slow");
	   
	   });
	});
	
	$('#beginbutton').click(function() {
	postEvent('Clicked "Start Begin"', null);
	start(); 
	});
	
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

function finish() {

	$.ajax({
    type: 'POST',
    url: '/api/update/firstanswers',
    data: {
      userid: userid,
      firstanswers: JSON.stringify(firstanswers)
    },
    dataType: 'json',
    success: function() {
     //  confirmUnload = false;
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
