$(document).ready(function() {
	var clicked = 0,
		clicked_hoverBox = 0,
		checked = 0;
	var listitem, listitem_hoverBox;
	var item, item_hoverBox;

	$('[data-toggle="tooltip"]').tooltip();

	$(".wrapper-block").mouseover(function(event) {

		$(this).css("outline", "2px solid #463856");
		$(this).find(".hover-block").show();
	});

	$(".wrapper-block").mouseout(function(event) {
		if (($(this).find(".hover-block").text() == "Now showing info")) // when img is clicked
			$(this).find(".hover-block").show();
		else {
			$(this).find(".hover-block").hide(); // when img is not clicked
			$(this).css("outline", "none");
		}
	});
	
	$("#mouseCap_video").mouseover(function(event) {
		if (conditionNum == 2 || conditionNum == 3 || conditionNum == 4) {
			$(this).find(".video_goes_here").css("filter", "blur(0)");
			player.playVideo();
			if (typeof postEvent === "function") {
				for(let i in movies) {
					if(movies[i].trailer == player.getVideoData()['video_id']) {
						postEvent('PLAY_TRAILER', {id: movies[i]._id, video_id: movies[i].trailer, current_video_pos: player.getCurrentTime()});
					}
				}
			}
		}
	});

	$("#mouseCap_video").mouseout(function(event) {
		if (conditionNum == 2 || conditionNum == 3 || conditionNum == 4) {
			$(this).find(".video_goes_here").css("filter", "blur(5px)");
			player.pauseVideo();
			if (typeof postEvent === "function") {
				for(let i in movies) {
					if(movies[i].trailer == player.getVideoData()['video_id']) {
						postEvent('PAUSE_TRAILER', {id: movies[i]._id, video_id: movies[i].trailer, current_video_pos: player.getCurrentTime()});
					}
				}
			}
		}
	});

	$("#blurred_content").mouseover(function(event) {
		if (conditionNum == 2 || conditionNum == 3 || conditionNum == 4) {
			$(this).css("filter", "blur(0)");
		}
	});

	$("#blurred_content").mouseout(function(event) {
		if (conditionNum == 2 || conditionNum == 3 || conditionNum == 4) {
			$(this).css("filter", "blur(10px)");
		}
	});

	$(".hover-block").click(function() {
		if (clicked_hoverBox == 1) {
			$(".movie-block:nth-of-type(" + parseInt(item_hoverBox + 11) + ")").find(".hover-block").text("Click to read info");
			$(".movie-block:nth-of-type(" + parseInt(item_hoverBox + 11) + ")").find(".wrapper-block").css("outline", "none");
			$(".movie-block:nth-of-type(" + parseInt(item_hoverBox + 11) + ")").find(".hover-block").hide();
			$(".highlight:nth-of-type(" + parseInt(item_hoverBox + 1) + ")").css("background-color", "#957ad6");
		}

		$(".intro").hide();
		if (conditionNum != 2) $(".movie_info").show();

		if (conditionNum == 2 || conditionNum == 3 || conditionNum == 4) {
			$.getScript('https://www.youtube.com/iframe_api');
			$(".movie_img").hide();
			$("#mouseCap_video").show();
		} else {
			$("#mouseCap_video").hide();
			$(".movie_img").show();
		}

		listitem_hoverBox = $(this).parents(".movie-block");
		item_hoverBox = listitem_hoverBox.index(".movie-block");
		$(this).text("Now showing info");
		clicked_hoverBox = 1;
		$("#movie_display_block").css("outline", "5px solid #463856"); //change
		$(".highlight:nth-of-type(" + parseInt(item_hoverBox + 1) + ")").css("background-color", "#463856"); //change
	});

	$('input[type=radio][name^=rating_],input[type=radio][name^=known]').change(function() {
		console.log($('input[type=radio][name^=rating_]:checked').length);
		console.log($('input[type=radio][name^=known]:checked').length);
		if (($('input[type=radio][name^=rating_]:checked').length === 10) && ($('input[type=radio][name^=known]:checked').length === 10)) {
			$(".next-button").children("button").css({
				"cursor": "pointer",
				"opacity": "1",
				"background-color": "#b4d98c"
			});
			$(".next-button").children("button").removeAttr('disabled');
		}
	});
	
});