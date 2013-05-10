TitleView = Backbone.View.extend({
	template: _.template($("#headerTemplate").html()),
	initialize: function() {
		var view = this;
		this.model = new Backbone.Model();
		this.model.on("change:value", function() { view.render() });
		this.setTitle("Yoga Now");
	},
	setTitle: function(title){
		this.model.set("value", title);
	},
	render: function() {			
		$(".header").html(this.template(this.model.attributes));
	}
});