MapManager = function(containerId){	
	var manager = this;
	var containerId = containerId;
	var mapMarkers = [];

	this.mapOptions = new Backbone.Model({
		zoom: 14,
		latitude: 37.7750,
		longitude: -122.4183,
	});

	function buildPosition(){
		return new google.maps.LatLng(manager.mapOptions.get("latitude"), manager.mapOptions.get("longitude"));
	}

	function buildMapOptions(){
		return {
			zoom: manager.mapOptions.get("zoom"),
			center: buildPosition(),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoomControl: false,
			panControl: false
		}
	}

	function calculateMapHeight(){
		var pageHeight, headerHeight, footerHeight;
		pageHeight = parseInt($("body").css('height'));
		headerHeight = parseInt($(".header").css('height'));
		footerHeight = parseInt($("[data-role='footer']").css('height'));

		return pageHeight - headerHeight - footerHeight + 50 + "px";
	}

	this.showMap = function(){
		manager.map = new google.maps.Map(document.getElementById(containerId), buildMapOptions());

		_.each(studiosManager.studios.models, function(studio){
			var marker = new google.maps.Marker({
			    position: new google.maps.LatLng(studio.get('latitude'), studio.get('longitude')),
			    map: manager.map,
			    icon: "images/yoga_icon_small.png"
			});

			mapMarkers.push(marker);								
			google.maps.event.addListener(marker, 'click', function() {
			    manager.map.panTo(marker.position);
			}); 
		});

		var marker = new google.maps.Marker({
		    position: new google.maps.LatLng(locationManager.userLocation.get('latitude'), 
		    	locationManager.userLocation.get('longitude')),
		    map: manager.map,
		});

		$('#content').css('height', calculateMapHeight());
		google.maps.event.trigger(manager.map,'resize');
	}

	this.destroyMap = function(){
		delete manager.map;
		_.each(mapMarkers,function(marker){ delete marker });
		$("#" + containerId).css('background-color', '');
		$("#" + containerId).html('');
	}

	manager.mapOptions.bind("changeCoordinates", function(){
		manager.map.setOptions( buildMapOptions() );			
	});
}