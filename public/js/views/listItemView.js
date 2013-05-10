ListItemView = Backbone.View.extend({		
	template: _.template($("#listItemTemplate").html()),
	render: function(){
		this.model.attributes
		return this.template(this.model.attributes);
	}
});