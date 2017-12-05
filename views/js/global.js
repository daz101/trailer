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
	  $(this).find(".img-block").css("outline","2px solid #5cb85c");
  }
	else
	{
	  $(this).find(".img-block").css("outline","2px solid #8c8c8c"); // when choose button is not selected //change
	}
	$(this).find(".hover-block").show();
});

$( ".wrapper-block" ).mouseout(function(event) {
	if(($(this).find(".hover-block").text()=="Now showing info")&&($(this).parent().find(".choose button").text()=="Choose")) // when choose button is not selected and img is clicked
		$(this).find(".hover-block").show();
	else
	if($(this).parent().find(".choose button").text()=="I like this best") // when choose button is selected
	{
		$(this).find(".img-block").css("outline","2px solid #5cb85c");
		$(this).find(".hover-block").hide();
	}
	else
	{
		$(this).find(".hover-block").hide();        // when choose button is not selected and img is not clicked
	    $(this).find(".img-block").css("outline","none");
	}
});
//testing 
// Look for trailer when hovering over movie
  $('.block_holder li .movie-block').click(function() {
    // on mouse click, clear timeout
    clearTimeout(timer);
    // Find which movie was clicked
    var moviePos = $(this).parent().index();
    loadSelectedMovie(moviePos);
  });





//done
/*
    $("#movie_1,#cb1").click(function() {
	$(".intro").hide();
	$("#fillMovie").attr('src', 'img/m_1.jpg');
	$(".movie_img").show();
	$(".movie-title").find("span").text("Schindlers list");
	$(".movie-cast").find("span:nth-child(2)").text("Liam Neeson, Ralph Fiennes, Ben Kingsley ");
	$(".movie-plot").find("span:nth-child(2)").text("In German-occupied Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazi Germans.");
	$(".movie_info").show();
	});
	
    $("#movie_2,#cb2").click(function() {
	$(".intro").hide();
	$("#fillMovie").attr('src', 'img/m_2.jpg');
	$(".movie_img").show();
	$(".movie-title").find("span").text("Harry potter(Goblet of Fire)");
	$(".movie-cast").find("span:nth-child(2)").text("Daniel Radcliffe, Emma Watson, Rupert Grint");
	$(".movie-plot").find("span:nth-child(2)").text("Harry finds himself mysteriously selected as an under-aged competitor in a dangerous tournament between three schools of magic.");
	$(".movie_info").show();
	});
	
    $("#movie_3,#cb3").click(function() {
	$(".intro").hide();
	$("#fillMovie").attr('src', 'img/m_3.jpg');
	$(".movie_img").show();
	$(".movie-title").find("span").text("Usual Suspects");
	$(".movie-cast").find("span:nth-child(2)").text(" Kevin Spacey, Gabriel Byrne, Chazz Palminteri");
	$(".movie-plot").find("span:nth-child(2)").text("A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat, which begin when five criminals meet at a seemingly random police lineup.");
	$(".movie_info").show();
	});
	
    $("#movie_4,#cb4").click(function() {
	$(".intro").hide();
	$("#fillMovie").attr('src', 'img/m_4.jpg');
	$(".movie_img").show();
	$(".movie-title").find("span").text("Lord of The Rings");
	$(".movie-cast").find("span:nth-child(2)").text("Elijah Wood, Ian McKellen, Orlando Bloom ");
	$(".movie-plot").find("span:nth-child(2)").text("A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle Earth from the Dark Lord Sauron.");
	$(".movie_info").show();
	});
	
    $("#movie_5,#cb5").click(function() {
	$(".intro").hide();
	$("#fillMovie").attr('src', 'img/m_5.jpg');
	$(".movie_img").show();
	$(".movie-title").find("span").text("Liar Liar");
	$(".movie-cast").find("span:nth-child(2)").text("Jim Carrey, Maura Tierney, Justin Cooper");
	$(".movie-plot").find("span:nth-child(2)").text("A fast-track lawyer can't lie for 24 hours due to his son's birthday wish after he turns his son down for the last time.");
	$(".movie_info").show();
	});
	
    $("#movie_6,#cb6").click(function() {
	$(".intro").hide();
	$("#fillMovie").attr('src', 'img/m_6.jpg');
	$(".movie_img").show();
	$(".movie-title").find("span").text("La La Land");
	$(".movie-cast").find("span:nth-child(2)").text("Ryan Gosling, Emma Stone, Rosemarie DeWitt ");
	$(".movie-plot").find("span:nth-child(2)").text("A jazz pianist falls for an aspiring actress in Los Angeles.");
	$(".movie_info").show();
	});
	
    $("#movie_7,#cb7").click(function() {
	$(".intro").hide();
	$("#fillMovie").attr('src', 'img/m_7.jpg');
	$(".movie_img").show();
	$(".movie-title").find("span").text("Titanic");
	$(".movie-cast").find("span:nth-child(2)").text("Leonardo DiCaprio, Kate Winslet, Billy Zane ");
	$(".movie-plot").find("span:nth-child(2)").text("A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.");
	$(".movie_info").show();
	});
	
    $("#movie_8,#cb8").click(function() {
	$(".intro").hide();
	$("#fillMovie").attr('src', 'img/m_8.jpg');
	$(".movie_img").show();
	$(".movie-title").find("span").text("Conjuring");
	$(".movie-cast").find("span:nth-child(2)").text("Patrick Wilson, Vera Farmiga, Ron Livingston");
	$(".movie-plot").find("span:nth-child(2)").text("Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.");
	$(".movie_info").show();
	});
	
    $("#movie_9,#cb9").click(function() {
	$(".intro").hide();
	$("#fillMovie").attr('src', 'img/m_9.jpg');
	$(".movie_img").show();
	$(".movie-title").find("span").text("Polar Express");
	$(".movie-cast").find("span:nth-child(2)").text("Tom Hanks, Chris Coppola, Michael Jeter ");
	$(".movie-plot").find("span:nth-child(2)").text("A young boy embarks on a magical adventure to the North Pole on the Polar Express. During his adventure he learns about friendship, bravery, and the spirit of Christmas.");
	$(".movie_info").show();
	});
	
    $("#movie_10,#cb10").click(function() {
	$(".intro").hide();
	$("#fillMovie").attr('src', 'img/m_10.jpg');
	$(".movie_img").show();
	$(".movie-title").find("span").text("Hangover");
	$(".movie-cast").find("span:nth-child(2)").text("Zach Galifianakis, Bradley Cooper, Justin Bartha");
	$(".movie-plot").find("span:nth-child(2)").text("Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing. They make their way around the city in order to find their friend before his wedding.");
	$(".movie_info").show();
	});
	*/
    
$( ".hover-block" ).click(function() {
  if(clicked==1)
	{		
		$(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".hover-block").text("Click to read info");  // change all items
		
		if($(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".choose button").text()=="Choose")
		{
			$(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".img-block").css("outline","none");
			$(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".hover-block").hide();
			$(".highlight:nth-of-type("+parseInt(item+1)+")").css("background-color","#ffffff");
		}
		
		if($(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".choose button").text()=="I like this best")
		{
			$(".highlight:nth-of-type("+parseInt(item+1)+")").css("background-color","#5cb85c");
		}
	}  	
	listitem=$(this).parents(".movie-block"); // change
	item=listitem.index(".movie-block"); // change
	$(".movie_img").show();
	$(this).text("Now showing info");
	clicked=1; //
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
		$(".movie-block:nth-of-type("+parseInt(item+11)+")").find(".img-block").css("outline","none");
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
		$(".movie-block:nth-of-type("+parseInt(item_choose+11)+")").find(".img-block").css("outline","none");
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
	$(this).parent().find(".img-block").css("outline","2px solid #5cb85c");
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