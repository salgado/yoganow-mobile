api_host = "http://yoganow-api.herokuapp.com"

document.addEventListener("deviceready", function(){
	navigator.splashscreen.hide();
}, false);

$(function(){	

	$.mobile.linkBindingEnabled = false;
	$.mobile.hashListeningEnabled = false;
	$.mobile.loading('hide');

	function MapManager(containerId){
		var manager = this;
		var containerId = containerId;

		this.mapOptions = new Backbone.Model({
			zoom: 8,
			latitude: 30.2669,
			longitude: -97.7428,
		});

		function buildPosition(){
			return new google.maps.LatLng(manager.mapOptions.get("latitude"), manager.mapOptions.get("longitude"));
		}

		function buildMapOptions(){
			return {
				zoom: manager.mapOptions.get("zoom"),
				center: buildPosition(),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
		}

		function calculateMapHeight(){
			var pageHeight, headerHeight, footerHeight;
			pageHeight = parseInt($("body").css('height'));
			headerHeight = parseInt($(".header").css('height'));
			footerHeight = parseInt($("[data-role='footer']").css('height'));

			return pageHeight - headerHeight - footerHeight + 55 + "px";
		}

		this.showMap = function(){
			manager.map = new google.maps.Map(document.getElementById(containerId), buildMapOptions());
			$('#content').css('height', calculateMapHeight());
			google.maps.event.trigger(manager.map,'resize');
		}
	
		this.destroyMap = function(){
			delete manager.map;
			$("#" + containerId).css('background-color', '');
			$("#" + containerId).html('');
		}

		manager.mapOptions.bind("changeCoordinates", function(){
			console.log( manager.mapOptions.get("latitude") );
			console.log( manager.mapOptions.get("longitude") );
			console.log( buildMapOptions() );
			manager.map.setOptions( buildMapOptions() );			
		});
	}

	window.mapManager = new MapManager("content");

	function getStudios(location){
		$.getJSON(api_host + "/yoga_studios.json?location=" + location,function(data){
			window.studios = data.yoga_studios
			setTimeout(function(){
				updateList(window.studios);
				$.mobile.loading( 'hide');
			},0);		
		});	
	}

	var LocationManager = function(){
		var manager = this;
		var UserLocation = Backbone.Model.extend({
			coordinates: function(){
				return this.get("latitude") + "," + this.get("longitude");
			}
		});

		this.userLocation = new UserLocation;

		function onSuccess(position) {
			console.log(position.coords.latitude);		
		    manager.userLocation.set({
		    	latitude: position.coords.latitude,
		    	longitude: position.coords.longitude
		    });

		    manager.userLocation.trigger("changeCoordinates");
		}

		function onError(error) {
		    manager.userLocation.set('coordinates', "301%20Bowie%20Austin");
		}

		this.updateCity = function() {
			$.getJSON(api_host + "/location.json?location=" + manager.currentLocation().coordinates,function(data){
				manager.userLocation.set("city", data.city);
			});
		};

		this.geolocate = function(){
			navigator.geolocation.getCurrentPosition(onSuccess);
		};

		this.currentLocation = function(){
			return {
				coordinates: manager.userLocation.coordinates(),
				latitude: manager.userLocation.get('latitude'),
				longitude: manager.userLocation.get('longitude')
			}
		};
	}

	window.locationManager = new LocationManager;


	StudiosManager = function(){
		var manager = this;

		this.Studio = Backbone.Model.extend({});
		this.Studios = Backbone.Collection.extend({
			model: manager.Studio,
			parse: function(response){
				_.each(response.yoga_studios, function(studio){
					studio.distance = parseFloat(studio.distance).toFixed(2);
				});
				return response.yoga_studios;
			}
		});
		this.studios = new manager.Studios();
		this.studios.url = api_host + "/yoga_studios.json"

		var StudioView = Backbone.View.extend({		
			events: {
				"click" : function(){
					console.log('clicked: ' + this.model.get('name'));
				}
			},
			template: _.template($("#listItemTemplate").html()),
			render: function(){
				this.model.attributes
				return this.template(this.model.attributes);
			}
		});

		var StudiosView = Backbone.View.extend({
			template: _.template($("#listTemplate").html()),
			render: function(){

				$ul = $(this.template({}));
				_.each(this.collection.models, function(studio){
					$li = $( (new StudioView({ model: studio })).render());
					$ul.append($li);
				});

				return $ul;
			}
		})

		manager.studios.fetch({
			success: function(){
				manager.showStudios();
			}
		})

		this.views = [];

		this.showStudios = function(){
			studiosView = new StudiosView({
				collection: manager.studios
			});
			manager.views.push(studiosView);
			
			$("#content").html( studiosView.render() );
		}

		this.removeStudios = function(){
			_.each(manager.views,function(view) { delete view }) ;
			$("#content").html("");
		}
	}

	window.studiosManager = new StudiosManager();


	var onPositionChange = function(){		
		getStudios(locationManager.userLocation.get('coordinates'));
		//locationManager.updateCity();
	}

	locationManager.userLocation.on('change', onPositionChange);

	
	locationManager.userLocation.on('change:city', function(){		
		title.set("value", "Yoga Now in " + locationManager.userLocation.get('city'));
	});

	window.title = new Backbone.Model({});

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


	function updateList(studios){
		console.log(studios);
		var listTemplate = _.template($("#listTemplate").html());	

		$ul = $(_.template($("#listItemTemplate").html(), {}));	
				
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


	var Router = Backbone.Router.extend({
		routes: {
		  "map": "map",   
		  "list": "list",  
		},

		map: function() {
			mapManager.showMap();
		},

		list: function() {		
		    mapManager.destroyMap();
		    studiosManager.showStudios();		 
		}
	});

	var app = new Router();

	$("#map").on('click',function(){
		app.navigate("/map", true);
	});

	$("#list").on('click',function(){
		app.navigate("/list", true);
	});


	Backbone.history.start();

});



