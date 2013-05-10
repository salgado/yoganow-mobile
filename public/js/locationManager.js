LocationManager = function(){
	this.apiHost = "http://yoganow-api.herokuapp.com";

	var manager = this;

	var UserLocation = Backbone.Model.extend({
		coordinates: function(){
			return this.get("latitude") + "," + this.get("longitude");
		}
	});

	this.userLocation = new UserLocation;

	function onSuccess(position) {
	    manager.userLocation.set({
	    	latitude: position.coords.latitude,
	    	longitude: position.coords.longitude
	    });

	    manager.userLocation.trigger("changeCoordinates");
	}

	this.updateCity = function() {
		$.getJSON(manager.apiHost + "/location.json?location=" + manager.userLocation.coordinates(),function(data){
			manager.userLocation.set("city", data.city);
		});
	};

	this.geolocate = function(){
		navigator.geolocation.getCurrentPosition(onSuccess);
	};

	this.userLocation.on("changeCoordinates", function(){
		manager.updateCity();
	})
}