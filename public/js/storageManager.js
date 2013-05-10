function StorageManager(localStorage){

	this.setCoordinates = function(location){
		localStorage.setItem("lastCoordinates", JSON.stringify({
			latitude: location.latitude,
			longitude: location.longitude,
		}));
	}

	this.getCoordinates = function(){
		return JSON.parse(localStorage.getItem("lastCoordinates"));
	}

}