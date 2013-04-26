$(function(){
	url = "http://yoganow-api.herokuapp.com/yoga_studios.json?location=301%20Bowie%20Austin"
	$.getJSON(url,function(data){
		window.studios = data.yoga_studios
		updateList(window.studios);		
	});

	function updateList(studios){
		var template = _.template($("#listItemTemplate").html());
		var $ul = $("<ul/>");
		
		$.each(studios, function(i, studio){ 
			studio.distance = parseFloat(studio.distance).toFixed(2);
			$ul.append(template(studio));
		});
		$(".ui-listview").html($ul.html());
		$(".ui-listview").listview();
	}

	function filterStudios(search, studios){
		var studs = _.filter(studios,function(studio){			
			return studio.name.toLowerCase().match(new RegExp(search.toLowerCase()));
		});
		updateList(studs);	
	}

	$(".ui-input-text").on("keyup", function(){
		var value = $(".ui-input-text").val();
		filterStudios(value, window.studios);
	});

	$(".ui-icon-delete").on('click', function(){
		filterStudios('', window.studios);
	});

	$('[data-position=fixed]').fixedtoolbar({ tapToggle:false});
});
