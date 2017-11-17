"use strict";
//var userid = Math.floor((Math.random() * 1000000) + 1);

console.log(window.location.pathname);
var userFromUrl = window.location.pathname;
var userid = userFromUrl.replace('/', '');



$(document).ready(function() {
  $('#consentBody, #consentbutton, #resizeBody, #resizebutton').hide();
   $('#welcomebutton').click(function() {
    postEvent('Clicked "Start Welcome"', null);
	$('#welcomeBody, #welcomebutton').fadeOut("slow", function() {
      $('#welcomeBody, #welcomebutton').hide();
      $('#consentBody, #consentbutton').show().fadeIn("slow");
	   });
	});

	$('#consentbutton').click(function() {
    postEvent('Clicked "Start Consent"', null);
	$('#consentBody, #consentbutton').fadeOut("slow", function() {
      $('#consentBody, #consentbutton').hide();
      $('#resizeBody, #resizebutton').show().fadeIn("slow");
    }); });
	
	$('#resizebutton').click(function() {	
    postEvent('Clicked "Start Resize"', null);
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