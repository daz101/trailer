$(document).ready(function(){ 
var Q1c=0, Q2c=0, Q3c=0, consent_check=0,isQuestionAnswered = false;

$('[data-toggle="tooltip"]').tooltip(); 

 $( "#survey_nextWelcome" ).click(function() { 
   $(location).attr('href', 'consent.html');
});

 $( "#consentbutton" ).click(function() { 
   if(consent_check==1)
	{
		$(location).attr('href', 'resize.html');
	}
});

$( "#resize_nextResize" ).click(function() { 
	$(location).attr('href', 'verbal_page1.html')
});

$( "#overview_nextInstructions" ).click(function() { 
	$(location).attr('href', 'begin.html')
});

$( "#begin-next" ).click(function() { 
	$(location).attr('href', 'Info.html')
});

$( "#survey_nextInstructions" ).click(function() { 
	$(location).attr('href', 'instructions2.html')
});
$( "#survey_nextInstructions2" ).click(function() { 
	$(location).attr('href', 'instructions3.html')
});
$( "#survey_nextInstructions3" ).click(function() { 
	$(location).attr('href', 'begin.html')
});
$( "#survey_next1" ).click(function() { 
	$(location).attr('href', 'Survey_page2.html')
});


$("input[name='radOpt_1']").change(function(){
});

$("input[name='radOpt_2']").change(function(){
});

$("input[name='radOpt_3']").change(function(){
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



$( "#verbal_nextPage2" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'verbal_page2.html');
	}
});

$( "#verbal_nextPage3" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'verbal_page3.html');
	}
});

$( "#verbal_nextPage4" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'verbal_page4.html');
	}
});

$( "#resize_nextOverview" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'overview.html');
	}
});

$( "#survey_next2" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'Survey_page3.html')
	}
});

$( "#survey_next3" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'Survey_page4.html')
	}
});

$( "#survey_next4" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'Survey_page5.html')
	}
});

$( "#survey_next5" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'Survey_page6.html')
	}
});

$( "#survey_next6" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'Survey_page7.html')
	}
});

$( "#survey_next7" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'Survey_page8.html')
	}
});

$( "#survey_next8" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'Survey_page9.html')
	}
});

$( "#survey_next9" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'Survey_page10.html')
	}
});

$( "#survey_next10" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'Survey_page11.html')
	}
});

$( "#survey_next11" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'Survey_page12.html')
	}
});

$( "#survey_next12" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'Survey_page13.html')
	}
});

$( "#survey_next13" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'Survey_page14.html')
	}
});

$( "#survey_next14" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'Survey_page15.html')
	}
});

$( "#survey_next15" ).click(function() { 
	var isAllQuestionAnswered = true;
	$( ".question .rad_row" ).each(function() {
		var isQuestionAnswered = false;
		$(this).find('input[type="radio"]').each(function() {
			if($(this).is(":checked")) 
			{
			isQuestionAnswered = true;
		    }
	    });
	    if(!isQuestionAnswered){
			$(this).parents(".question").css("border-left","3px solid #ff3300");
			isAllQuestionAnswered = false;
           }
});
	if(isAllQuestionAnswered) 
	{
	$(location).attr('href', 'thankyou.html')
	}
});

});

function infoFunction() {
    var popup = document.getElementById("infoPopup");
    info_holder.classlist.toggle("show");
}