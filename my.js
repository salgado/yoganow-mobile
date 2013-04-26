$(function(){
	// Prevents all anchor click handling
	$.mobile.linkBindingEnabled = false;
	// Disabling this will prevent jQuery Mobile from handling hash changes
	$.mobile.hashListeningEnabled = false;


	url = "http://yoganow-api.herokuapp.com/yoga_studios.json?location=301%20Bowie%20Austin"
	$.mobile.loading( 'show');
	$.getJSON(url,function(data){
		window.studios = data.yoga_studios
		setTimeout(function(){
			updateList(window.studios);
			$.mobile.loading( 'hide');
		},0);		
	});

	function updateList(studios){
		var listItemTemplate = _.template($("#listItemTemplate").html());		
		var listTemplate = _.template($("#listTemplate").html());	

		$ul = $(listTemplate({}));	
			
		console.log($ul);
		
		$.each(studios, function(i, studio){ 
			studio.distance = parseFloat(studio.distance).toFixed(2);
			$ul.append(listItemTemplate(studio));
		});
		$("[data-role=content]").html($ul);
		$ul.listview();
	}

	function filterStudios(search, studios){
		var studs = _.filter(studios,function(studio){			
			return studio.name.toLowerCase().match(new RegExp(search.toLowerCase()));
		});
		updateList(studs);	
	}

	$(".ui-input-text").on("keyup", function(){
		var value = $(".ui-input-text").val();
		console.log(value);
		filterStudios(value, window.studios);
	});

	$(".ui-icon-delete").on('click', function(){
		filterStudios('', window.studios);
	});

	$('[data-position=fixed]').fixedtoolbar({ tapToggle:false});

	function showMap() {
		$(".ui-listview").hide();
		$("#content").html($("<div id='map-canvas'/>"));

		var mapOptions = {
		    zoom: 8,
		    center: new google.maps.LatLng(-34.397, 150.644),
		    mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(document.getElementById('map-canvas'),
		      mapOptions);

		google.maps.event.trigger(map,'resize');		
	}

	var App = Backbone.Router.extend({

		routes: {
		  "map": "map",   
		  "list": "list",  
		},

		map: function() {
		  showMap();
		},

		list: function() {		
		  updateList(window.studios);
		  $(".ui-listview").show();
		}

	});

	window.app = new App();

	Backbone.history.start()

	$("#map").on('click',function(){
		app.navigate("/map", true);
	});

	$("#list").on('click',function(){
		app.navigate("/list", true);
	});
});
