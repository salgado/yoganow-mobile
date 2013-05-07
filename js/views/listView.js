ListView = Backbone.View.extend({
	initialize: function(){
		this.collection.bind("reset", function(){
			this.render();
		}, this);
	},
	template: _.template($("#listTemplate").html()),
	render: function(){

		$ul = $(this.template({}));
		_.each(this.collection.models, function(studio){
			$li = $( (new ListItemView({ model: studio })).render());
			$ul.append($li);
		});

		return $ul;
	}
});