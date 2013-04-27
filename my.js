
// Cordova is ready
//


$(function(){


	var onSuccess = function(position) {
		console.log(position);
		lat = position.coords.latitude;
		lng = position.coords.longitude;

	    userLocation.set("value", lat + "," + lng);
	};

	// onError Callback receives a PositionError object
	//
	function onError(error) {
	    userLocation.set('value', "301%20Bowie%20Austin");
	}

	navigator.geolocation.getCurrentPosition(onSuccess);

	// Prevents all anchor click handling
	$.mobile.linkBindingEnabled = false;
	// Disabling this will prevent jQuery Mobile from handling hash changes
	$.mobile.hashListeningEnabled = false;

	window.title = new Backbone.Model({});
	window.userLocation = new Backbone.Model({});

	var TitleView = Backbone.View.extend({
		template: _.template($("#headerTemplate").html()),
		initialize: function() {
			var that = this;
			this.model.on("change:value", function() { that.render() });
		},
		render: function() {			
			$(".header").html(this.template(this.model.attributes));
		}
	});	

	titleView = new TitleView({
		model: window.title
	})

	title.set("value", "Yoga Now");
	api_host = "http://yoganow-api.herokuapp.com"

	$.mobile.loading( 'show');

	function getStudios(location){
		$.getJSON(api_host + "/yoga_studios.json?location=" + location,function(data){
			window.studios = data.yoga_studios
			setTimeout(function(){
				updateList(window.studios);
				$.mobile.loading( 'hide');
			},0);		
		});	
	}

	function getCity(location){
		$.getJSON(api_host + "/location.json?location=" + location,function(data){
			title.set("value", "Yoga Now in " + data.city);
		});
	}

	userLocation.on('change:value', function(){
		getStudios(userLocation.get('value'));
		getCity(userLocation.get('value'));
	})

	getStudios(userLocation.get('value'));
	getCity(userLocation.get('value'));



	function updateList(studios){
		var listItemTemplate = _.template($("#listItemTemplate").html());		
		var listTemplate = _.template($("#listTemplate").html());	

		$ul = $(listTemplate({}));	
				
		$.each(studios, function(i, studio){ 
			studio.distance = parseFloat(studio.distance).toFixed(2);
			$ul.append(listItemTemplate(studio));
		});

		$("[data-role=content]").html($ul);
		$ul.listview();
	}

	function filterStudios(search, studios){		
		updateList(_.filter(studios,function(studio){			
			return studio.name.toLowerCase().match(new RegExp(search.toLowerCase()));
		}));
	}

	$("input").live("keyup", function(e){
		var value = $(".ui-input-text").val();	
		filterStudios(value, window.studios);
		$(".ui-input-text").val(value).focus();
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
