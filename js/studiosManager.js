StudiosManager = function(){
	var manager = this;
	this.apiHost = "http://yoganow-api.herokuapp.com";

	this.state = new Backbone.Model;

	this.Studio = Backbone.Model.extend({});
	this.Studios = Backbone.Collection.extend({
		model: manager.Studio,
		parse: function(response){
			window.studios = response.yoga_studios;
			_.each(response.yoga_studios, function(studio){
				studio.distance = parseFloat(studio.distance).toFixed(2);
			});
			return response.yoga_studios;
		}
	});

	this.studios = new manager.Studios;
	this.views = [];

	this.showStudios = function(){
		studiosView = new ListView({
			collection: manager.studios
		});
		manager.views.push(studiosView);
		
		$("#content").html( studiosView.render() );
		$("#content").css('height', '100%');
	}

	this.removeStudios = function(){
		_.each(manager.views,function(view) { delete view }) ;
		$("#content").html("");
	}

	manager.state.on("change:location", function(){
		url = apiHost + "/yoga_studios.json?location=" + manager.state.get('location');
		manager.studios.fetch({
			url: url,
			success: function(){ manager.showStudios() }
		});
	});

}