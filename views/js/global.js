$(document).ready(function(){ 

	var clicked=0,choose=0;  // change all vars
	var listitem,listitem_choose;  
	var item,item_choose;
	
$('[data-toggle="tooltip"]').tooltip(); 
	
$( "#confirmYes" ).click(function() { 
	$(location).attr('href', 'loading.html')
});
	
  $( ".wrapper-block" ).mouseover(function(event) {
  if($(this).parent().find(".choose button").text()=="I like this best") // when choose button is selected
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
	if($(this).parent().find(".choose button").text()=="I like this best") // when choose button is selected
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
//testing 
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
			$(".highlight:nth-of-type("+parseInt(item+1)+")").css("background-color","#ffffff");
			console.log("Here");
		}
		
		if($(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".choose button").text()=="I like this best") // If the previously clicked movie was selected
		{
			$(".highlight:nth-of-type("+parseInt(item+1)+")").css("background-color","#5cb85c");
		}
	}  	
	$(".intro").hide();
	$("#movieposter").attr('src', '');
	$(".movie_img").show();
	$(".movie-title").find("span").text("XYZ");
	$(".movie-cast").find("span:nth-child(2)").text(" ");
	$(".movie-plot").find("span:nth-child(2)").text("");
	$(".movie_info").show();
	
	listitem=$(this).parents(".movie-block");
	item=listitem.index(".movie-block"); 
	$(this).text("Now showing info");
	clicked=1; 
	$("#movie_display_block").css("outline","5px solid #8c8c8c"); 
	
	
	var current_highlight=$(".highlight:nth-of-type("+parseInt(item+1)+")").css("background-color"); // new changes if-else block
	if (current_highlight=="rgb(92, 184, 92)")
	{
		$("#movie_display_block").css("outline","5px solid #5cb85c");
		$(".highlight:nth-of-type("+parseInt(item+1)+")").css("background-color","#5cb85c");
	}
	else
	$(".highlight:nth-of-type("+parseInt(item+1)+")").css("background-color","#8c8c8c"); 
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
		$(".highlight:nth-of-type("+parseInt(item+1)+")").css("background-color","#ffffff");
		if($(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".hover-block").text()=="Now showing info")
		{
			$(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".hover-block").text("Click to read info"); //new change
			$(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".hover-block").hide(); //
		}
	}
	
	if(choose==1)  // change
	{
		$(".movie-block:nth-of-type("+parseInt(item_choose+11)+")").find("button").css("background-color", "#8c8c8c"); 
		$(".movie-block:nth-of-type("+parseInt(item_choose+11)+")").find("button").text("Choose");
		$(".movie-block:nth-of-type("+parseInt(item_choose+11)+")").find(".wrapper-block").css("outline","none");
		$(".highlight:nth-of-type("+parseInt(item_choose+1)+")").css("background-color","#ffffff");
		if($(".movie-block:nth-of-type("+parseInt(item_choose+11)+")").find(".hover-block").text()=="Now showing info")
		{
			$(".movie-block:nth-of-type("+parseInt(item_choose+11)+")").find(".hover-block").text("Click to read info"); //new change
			$(".movie-block:nth-of-type("+parseInt(item_choose+11)+")").find(".hover-block").hide(); //
		}
	}
	
	listitem=$(this).parent();
	item=listitem.index(".movie-block");
	
	listitem_choose=$(this).parent();  // change
	item_choose=listitem_choose.index(".movie-block"); // change
	
	$(this).children("button").css("background-color", "#5cb85c");
	$(this).children("button").text("I like this best");
	$(".next-button").children("button").css({"cursor":"pointer","opacity":"1","background-color":"#5cb85c"});
	$(".next-button").children("button").removeAttr('disabled');
	$(this).parent().find(".wrapper-block").css("outline","2px solid #5cb85c");
	$(this).parent().find(".hover-block").text("Now showing info");  // change
	$(this).parent().find(".hover-block").hide();	 
    clicked=1; 
    choose=1;	//change
	$("#movie_display_block").css("outline","5px solid #5cb85c");
	$(".highlight:nth-of-type("+parseInt(item+1)+")").css("background-color","#5cb85c");
	
	var final_title=$(".movie-title").find("span").text();
	document.getElementById("mt").innerHTML=final_title;
});
});