Router = Backbone.Router.extend({

	routes: {
	  "map": "map",   
	  "list": "list",  
	},

	map: function() {
		window.mapManager.showMap();
	},

	list: function() {		
	    window.mapManager.destroyMap();
	    window.studiosManager.showStudios();		 
	}
});