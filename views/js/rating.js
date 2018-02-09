$(document).ready(function(){ 
	var clicked=0,clicked_hoverBox=0,checked=0;
	var listitem,listitem_hoverBox;
	var item,item_hoverBox;
	
$('[data-toggle="tooltip"]').tooltip(); 
	
$( "#nextPage11" ).click(function() { 
	$(location).attr('href', 'Survey_page1.html')
});
	
  $( ".wrapper-block" ).mouseover(function(event) {
  
	$(this).find(".img-block").css("outline","2px solid #463856"); 
	$(this).find(".hover-block").show();
});

$( ".wrapper-block" ).mouseout(function(event) {
	if(($(this).find(".hover-block").text()=="Now showing info")) // when img is clicked
		$(this).find(".hover-block").show();
	else
	{
		$(this).find(".hover-block").hide();        // when img is not clicked
	    $(this).find(".img-block").css("outline","none");
	}
});

	
    
$( ".hover-block" ).click(function() {
  if(clicked_hoverBox==1)
	{		
		$(".movie-block:nth-of-type("+parseInt(item_hoverBox+11)+")").find(".hover-block").text("Click to read info");
		$(".movie-block:nth-of-type("+parseInt(item_hoverBox+11)+")").find(".img-block").css("outline","none");
		$(".movie-block:nth-of-type("+parseInt(item_hoverBox+11)+")").find(".hover-block").hide();
		$(".highlight:nth-of-type("+parseInt(item_hoverBox+1)+")").css("background-color","#957ad6");					
	}  
	listitem_hoverBox=$(this).parents(".movie-block");
	item_hoverBox=listitem_hoverBox.index(".movie-block");	
	$(".movie_img").show();
	$(this).text("Now showing info");
	clicked_hoverBox=1;
	$("#movie_display_block").css("outline","5px solid #463856"); //change
	$(".highlight:nth-of-type("+parseInt(item_hoverBox+1)+")").css("background-color","#463856"); //change
});


$('input[type=radio][name^=rating_],input[type=radio][name^=known]').change(function() {
	if(($('input[type=radio][name^=rating_]:checked').length === 10)&&($('input[type=radio][name^=known]:checked').length === 10))
	{
		$(".next-button").children("button").css({"cursor":"pointer","opacity":"1","background-color":"#b4d98c"});
		$(".next-button").children("button").removeAttr('disabled');
	}
});

});