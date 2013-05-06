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
		mapManager.mapOptions.set({
			latitude: locationManager.userLocation.get("latitude"),
			longitude: locationManager.userLocation.get("longitude")
		});
		studiosManager.state.set("location", locationManager.userLocation.coordinates());
	});

	locationManager.geolocate();
	Backbone.history.start();
});



