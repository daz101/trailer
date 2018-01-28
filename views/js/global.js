$(document).ready(function(){ 

	var clicked=0,choose=0;  // change all vars
	var listitem,listitem_choose;  
	var item,item_choose;
	
$('[data-toggle="tooltip"]').tooltip(); 

/*
$( "#confirmYes" ).click(function() { 
	$(location).attr('href', 'loading.html')
});
*/
	
  $( ".wrapper-block" ).mouseover(function(event) {
	    if($(this).parent().find(".choose button").text()=="I like this best"||$(this).parent().find(".choose button").text()=="I would watch this movie now") // when choose button is selected
	    {
		  $(this).css("outline","2px solid #5cb85c");
	    }
	    else
	    {
		  $(this).css("outline","2px solid #8c8c8c"); // when choose button is not selected
	    }
	    $(this).find(".hover-block").show();
 });


$( ".wrapper-block" ).mouseout(function(event) {
		if(($(this).find(".hover-block").text()=="Now showing info")&&($(this).parent().find(".choose button").text()=="Choose")) // when choose button is not selected and img is clicked
			$(this).find(".hover-block").show();
		else
		if($(this).parent().find(".choose button").text()=="I like this best"||$(this).parent().find(".choose button").text()=="I would watch this movie now") // when choose button is selected
		{
			$(this).css("outline","2px solid #5cb85c");
			$(this).find(".hover-block").hide();
		}
		else
		{
			$(this).find(".hover-block").hide();        // when choose button is not selected and img is not clicked
			$(this).css("outline","none");
		}  
 });

// Look for trailer when hovering over movie
 /* $('.block_holder li .movie-block').click(function() {
    // on mouse click, clear timeout
    clearTimeout(timer);
    // Find which movie was clicked
    var moviePos = $(this).parent().index();
    loadSelectedMovie(moviePos);
  }); */

    
$( ".hover-block" ).click(function() {
  if(clicked==1)
	{	
		$(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".hover-block").text("Click to read info"); //Change the text of the previously clicked movie

		if($(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".choose button").text()=="Choose") // If the previously clicked movie was not selected
		{
			$(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".wrapper-block").css("outline","none");
			$(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".hover-block").hide();
			if(choiceNumber==9) /*For page no. 10*/
				$(".highlight:nth-of-type("+parseInt(item+1)+")").css({"background-color":"#69A9DA","opacity":"1"});
			else /*For page nos. 1 to 9*/
				$(".highlight:nth-of-type("+parseInt(item+1)+")").css({"background-color":"#ffffff","opacity":"1"});
		}
		
		if($(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".choose button").text()=="I like this best"||$(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".choose button").text()=="I would watch this movie now") // If the previously clicked movie was selected
		{
			$(".highlight:nth-of-type("+parseInt(item+1)+")").css({"background-color":"#5cb85c","opacity":"1"});
		}
	}  	
	$(".intro").hide();
	$(".movie_img").show();
	$(".movie_info").show();

	listitem=$(this).parents(".movie-block");
	item=listitem.index(".movie-block"); 
	$(this).text("Now showing info");
	clicked=1; 
	$("#movie_display_block").css("outline","5px solid #8c8c8c"); 
	
	var current_highlight=$(".highlight:nth-of-type("+parseInt(item+1)+")").css("background-color"); // Check current highlight
	if (current_highlight=="rgb(92, 184, 92)") //If highlight is green or the movie was choosen
	{
		$("#movie_display_block").css("outline","5px solid #5cb85c");
		$(".highlight:nth-of-type("+parseInt(item+1)+")").css({"background-color":"#5cb85c","opacity":"1"});
	}
	else
	$(".highlight:nth-of-type("+parseInt(item+1)+")").css({"background-color":"#8c8c8c","opacity":"1"}); 
});

 $( ".choose" ).mouseover(function() {
   var bgcolor=$(this).children("button").css("background-color");
   if(bgcolor=="rgb(140, 140, 140)") 
   {
		$(this).children("button").css("background-color", "#f49518"); 
   }
});

 $( ".choose" ).mouseout(function() {
	var bgcolor=$(this).children("button").css("background-color");
	if(bgcolor=="rgb(244, 149, 24)") 
	{
		$(this).children("button").css("background-color", "#8c8c8c");
	}
	else
	{
	$(this).children("button").css("background-color", "#5cb85c;");
	$("[data-toggle='tooltip']").tooltip('hide');
	}
});

 $( ".choose" ).click(function() { 
	$("[data-toggle='tooltip']").tooltip('hide');
	if(clicked==1)
	{		
		$(".movie-block:nth-of-type("+parseInt(item+11)+")").find("button").css("background-color", "#8c8c8c"); 
		$(".movie-block:nth-of-type("+parseInt(item+11)+")").find("button").text("Choose");
		$(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".wrapper-block").css("outline","none");
		
		if(choiceNumber==9) /*For page no. 10*/
		$(".highlight:nth-of-type("+parseInt(item+1)+")").css({"background-color":"#69A9DA","opacity":"1"});
		else /*For page nos. 1 to 9*/
		$(".highlight:nth-of-type("+parseInt(item+1)+")").css({"background-color":"#ffffff","opacity":"1"});
		
		if($(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".hover-block").text()=="Now showing info")
		{
			$(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".hover-block").text("Click to read info"); 
			$(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".hover-block").hide(); //
		}
		$(".movie-block:nth-of-type("+parseInt(item+11)+")").attr("data-movieSelected",false);
	}
	
	if(choose==1) 
	{
		$(".movie-block:nth-of-type("+parseInt(item_choose+11)+")").find("button").css("background-color", "#8c8c8c"); 
		$(".movie-block:nth-of-type("+parseInt(item_choose+11)+")").find("button").text("Choose");
		$(".movie-block:nth-of-type("+parseInt(item_choose+11)+")").find(".wrapper-block").css("outline","none");
		
		if(choiceNumber==9) /*For page no. 10*/
		$(".highlight:nth-of-type("+parseInt(item_choose+1)+")").css({"background-color":"#69A9DA","opacity":"1"});
		else /*For page nos. 1 to 9*/
		$(".highlight:nth-of-type("+parseInt(item_choose+1)+")").css({"background-color":"#ffffff","opacity":"1"});
		
		if($(".movie-block:nth-of-type("+parseInt(item_choose+11)+")").find(".hover-block").text()=="Now showing info")
		{
			$(".movie-block:nth-of-type("+parseInt(item_choose+11)+")").find(".hover-block").text("Click to read info");
			$(".movie-block:nth-of-type("+parseInt(item_choose+11)+")").find(".hover-block").hide(); //
		}
		$(".movie-block:nth-of-type("+parseInt(item+11)+")").attr("data-movieSelected",false);
	}
	
	listitem=$(this).parent();
	item=listitem.index(".movie-block");
	listitem_choose=$(this).parent(); 
	item_choose=listitem_choose.index(".movie-block");
	
	$(".intro").hide();
	$(".movie_img").show();
	$(".movie_info").show();
	$(this).children("button").css("background-color", "#5cb85c");
	
	if(choiceNumber==9) /*For page no. 10*/
	$(this).children("button").text("I would watch this movie now");
	else /*For page nos. 1 to 9*/
	$(this).children("button").text("I like this best");

	$(".next-button").children("button").css({"cursor":"pointer","opacity":"1","background-color":"#5cb85c"});
	$(".next-button").children("button").removeAttr('disabled');
	$(this).parent().find(".wrapper-block").css("outline","2px solid #5cb85c");
	$(this).parent().find(".hover-block").text("Now showing info");  
	$(this).parent().find(".hover-block").hide();	 
    clicked=1; 
    choose=1;
	$("#movie_display_block").css("outline","5px solid #5cb85c");
	$(".highlight:nth-of-type("+parseInt(item+1)+")").css({"background-color":"#5cb85c","opacity":"1"});
	
	var final_title=$(".movie-title").find("span").text();
	document.getElementById("mt").innerHTML=final_title;
	$(this).parent().attr("data-movieSelected",true);
});
});