Router = Backbone.Router.extend({
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