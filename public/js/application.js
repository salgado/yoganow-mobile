//= require js/vendor/jquery-1.7.2.min
//= require js/vendor/jquery.mobile-1.2.0.min
//= require js/vendor/underscore-min
//= require js/vendor/backbone-min
//= require js/vendor/google_maps_v3
//= require js/storageManager
//= require js/mapManager
//= require js/locationManager
//= require js/studiosManager
//= require js/views/listItemView
//= require js/views/listView
//= require js/views/titleView
//= require js/router
//= require_self

apiHost = "http://yoganow-api.herokuapp.com"

document.addEventListener("deviceready", function(){
	navigator.splashscreen.hide();
}, false);

$(function(){	

	$.mobile.linkBindingEnabled = false;
	$.mobile.hashListeningEnabled = false;
	$('[data-position=fixed]').fixedtoolbar({ tapToggle:false});
	$.mobile.loading('hide');

	window.mapManager 	    = new MapManager("content"); 
	window.locationManager  = new LocationManager;
	window.studiosManager   = new StudiosManager();
	window.app 				= new Router();

	$("#map").on('click',function(){ app.navigate("/map", true) });
	$("#list").on('click',function(){ app.navigate("/list", true) });
	
	titleView = new TitleView;

	locationManager.userLocation.on('change:city', function(){		
		titleView.setTitle("Yoga Now in " + locationManager.userLocation.get('city'));
	});

	locationManager.userLocation.on("changeCoordinates", function(){
		console.log('changeCoordinates');
		studiosManager.state.set("location", locationManager.userLocation.coordinates());
		mapManager.mapOptions.set({
			latitude: locationManager.userLocation.get("latitude"),
			longitude: locationManager.userLocation.get("longitude")
		});
	});

	locationManager.geolocate();
	$("#content").css('height', '100%');
	Backbone.history.start();
});



