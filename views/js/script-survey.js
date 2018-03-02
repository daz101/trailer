"use strict";
var nrOfQns = $('.qn').length;
console.log(window.location.pathname);
var userFromUrl = window.location.pathname;
var userid = userFromUrl.replace('/', '');

$(document).ready(function() {
	$('#surveypage1, #surveypage1button,#surveypage2, #surveypage2button, #surveypage3, #surveypage3button, #surveypage4, #surveypage4button').hide(); 
	$('#surveypage5, #surveypage5button,#surveypage6, #surveypage6button, #surveypage7, #surveypage7button,#surveypage8, #surveypage8button').hide();
	$('#surveypage9, #surveypage9button, #surveypage10, #surveypage10button, #surveypage11, #surveypage11button, #surveypage12, #surveypage12button, #surveypage13, #surveypage13button, #surveypage14, #surveypage14button, #surveypage15, #surveypage15button').hide();
	
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

//disable begin button if comment field is not submitted 
//$('#beginbutton').attr('disabled', true);
$('#textbox').on('keyup',function() {
    if($(this).val() != '') {
    $('#beginbutton').attr('disabled' , false);
    }else{
    $('.survey-next-button').children('button').css({"cursor":"pointer","opacity":"1","background-color":"#5cb85c"});
	$('#beginbutton').attr('disabled', true);
    }
});

	//go to page 1
	$('#beginbutton').click(function() {
	 //send comment from comment box
	 var text = $('#textbox').val();
	 var feedback = []; 
	 feedback.push(postFeedback(text));
     feedback.push(postEvent('Feedback sent'));
	 
	$('#surveyintro, #beginbutton').fadeOut("slow", function() {
      $('#surveyintro, #beginbutton').hide();
      $('#surveypage1, #surveypage1button').show().fadeIn("slow");
	   });
		
	});
	
	$('#surveypage1button').click(function() {
		var hookpage = $('#surveypage1');
		if(isSurveyComplete(hookpage)){
    postEvent('Started Final Survey', null);
	//go to page 2
	$('#surveypage1, #surveypage1button').fadeOut("slow", function() {
      $('#surveypage1, #surveypage1button').hide();
      $('#surveypage2, #surveypage2button').show().fadeIn("slow");
	   });
		}
	});
	
	//go to page 3
	$('#surveypage2button').click(function() {
		var hookpage = $("#surveypage2");
		if(isSurveyComplete(hookpage)){
	$('#surveypage2, #surveypage2button').fadeOut("slow", function() {
      $('#surveypage2, #surveypage2button').hide();
      $('#surveypage3, #surveypage3button').show().fadeIn("slow");
	   });
		}
	});
	
	//go to page 4
	$('#surveypage3button').click(function() {
		var hookpage = $("#surveypage3");
		if(isSurveyComplete(hookpage)){
	$('#surveypage3, #surveypage3button').fadeOut("slow", function() {
      $('#surveypage3, #surveypage3button').hide();
      $('#surveypage4, #surveypage4button').show().fadeIn("slow");
	   });
		}
	});
	
	//go to page 5
	$('#surveypage4button').click(function() {
		var hookpage = $('#surveypage4');
		if(isSurveyComplete(hookpage)){
	$('#surveypage4, #surveypage4button').fadeOut("slow", function() {
      $('#surveypage4, #surveypage4button').hide();
      $('#surveypage5, #surveypage5button').show().fadeIn("slow");
	   });
		}
	});
	
	//go to page 6
	$('#surveypage5button').click(function() {
		var hookpage = $('#surveypage5');
		if(isSurveyComplete(hookpage)){
	$('#surveypage5, #surveypage5button').fadeOut("slow", function() {
      $('#surveypage5, #surveypage5button').hide();
      $('#surveypage6, #surveypage6button').show().fadeIn("slow");
	   });
		}
	});
	
	//go to page 7
	$('#surveypage6button').click(function() {
		var hookpage = $('#surveypage6');
		if(isSurveyComplete(hookpage)){
	$('#surveypage6, #surveypage6button').fadeOut("slow", function() {
      $('#surveypage6, #surveypage6button').hide();
      $('#surveypage7, #surveypage7button').show().fadeIn("slow");
	   });
		}
	});
	
	//go to page 8
	$('#surveypage7button').click(function() {
		var hookpage = $('#surveypage7');
		if(isSurveyComplete(hookpage)){
	$('#surveypage7, #surveypage7button').fadeOut("slow", function() {
      $('#surveypage7, #surveypage7button').hide();
      $('#surveypage8, #surveypage8button').show().fadeIn("slow");
	   });
		}
	});
	
	//go to page 9
	$('#surveypage8button').click(function() {
		var hookpage = $('#surveypage4');
		if(isSurveyComplete(hookpage)){
	$('#surveypage8, #surveypage8button').fadeOut("slow", function() {
      $('#surveypage8, #surveypage8button').hide();
      $('#surveypage9, #surveypage9button').show().fadeIn("slow");
	   });
		}
	});
	
	//go to page 10
	$('#surveypage9button').click(function() {
		var hookpage = $('#surveypage4');
		if(isSurveyComplete(hookpage)){
	$('#surveypage9, #surveypage9button').fadeOut("slow", function() {
      $('#surveypage9, #surveypage9button').hide();
      $('#surveypage10, #surveypage10button').show().fadeIn("slow");
	   });
		}
	});
	
	//go to page 11
	$('#surveypage10button').click(function() {
		var hookpage = $('#surveypage4');
		if(isSurveyComplete(hookpage)){
	$('#surveypage10, #surveypage10button').fadeOut("slow", function() {
      $('#surveypage10, #surveypage10button').hide();
      $('#surveypage11, #surveypage11button').show().fadeIn("slow");
	   });
		}
	});
	
	//go to page 12
	$('#surveypage11button').click(function() {
		var hookpage = $('#surveypage4');
		if(isSurveyComplete(hookpage)){
	$('#surveypage11, #surveypage11button').fadeOut("slow", function() {
      $('#surveypage11, #surveypage11button').hide();
      $('#surveypage12, #surveypage12button').show().fadeIn("slow");
	   });
		}
	});
	
	//go to page 13
	$('#surveypage12button').click(function() {
		var hookpage = $('#surveypage4');
		if(isSurveyComplete(hookpage)){
	$('#surveypage12, #surveypage12button').fadeOut("slow", function() {
      $('#surveypage12, #surveypage12button').hide();
      $('#surveypage13, #surveypage13button').show().fadeIn("slow");
	   });
		}
	});
	
	//go to page 14
	$('#surveypage13button').click(function() {
		var hookpage = $('#surveypage4');
		if(isSurveyComplete(hookpage)){
	$('#surveypage13, #surveypage13button').fadeOut("slow", function() {
      $('#surveypage13, #surveypage13button').hide();
      $('#surveypage14, #surveypage14button').show().fadeIn("slow");
	   });
		}
	});
	
	//go to page 15
	$('#surveypage14button').click(function() {
		var hookpage = $('#surveypage4');
		if(isSurveyComplete(hookpage)){
	$('#surveypage14, #surveypage14button').fadeOut("slow", function() {
      $('#surveypage14, #surveypage14button').hide();
      $('#surveypage15, #surveypage15button').show().fadeIn("slow");
	   });
		}
	});
	
	//last survey page
	$('#surveypage15button').click(function() {
		finish(); 
	});
	// Make sure client wants leave
  $(window).on('beforeunload', function() {
    if(confirmUnload)
      return 'We would really appreciate it if you could complete this survey for our course project.'
            + ' You can also come back to complete it later on from where you left.';
  });

  $(window).unload(function() {
    postEvent('Closed connection', null);
  });
});


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
		return true;
}
	

	
	

/**
 * Save feedback on whether or not something went wrong
 */
function postFeedback() {
	//var feedback = [];
	
	$.ajax({
    type: 'POST',
    url: '/api/update/feedback',
    data: {
      userid: userid,
      feedback: JSON.stringify(feedback)
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
 * Save survey answers online and finish.
 */
function finish() {
	var secondanswers = [];
	
	for(var i=1; i<=nrOfQns; i++) {
		secondanswers.push($('input[name=radOpt_'+i+']:checked').val());
	}

	
	$.ajax({
    type: 'POST',
    url: '/api/update/secondanswers',
    data: {
      userid: userid,
      secondanswers: JSON.stringify(secondanswers)
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
      eventdesc: eventdesc
    },
    dataType: 'json',
    error: function(err) {
      console.log(err.responseText);
    }
  });
}
