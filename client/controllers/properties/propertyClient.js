Template.PropertyClient.onCreated(function(){
	var self = this;
	this.type = this.data.estimation ? 'estimations' : 'properties';
	this.images = [];
	_.each(this.data.images, function(img) {
		self.images.push(img);
	});
	this.gmap = new ReactiveVar('');
});

Template.PropertyClient.onRendered(function(){
	this.dpeges = new DpeGes();
	this.dpeges.dpe({
		domId: 'dpe',
		value: this.data.dpe,
		shadow: true,
	});
	this.dpeges.ges({
		domId: 'ges',
		value: this.data.ges,
		shadow: true,
	});
	if (this.data.estimation != true) {
		$('#carousel').slick({
			centerMode: true,
			dots: true,
			infinite: true,
			speed: 300,
			slidesToShow: 1,
			adaptiveHeight: true
		});
	}
});

Template.PropertyClient.helpers({
	map: function() {
		return Template.instance().gmap.get();
	},
	img: function() {
		return Images.find({_id: {$in: Template.instance().data.images}});
	}
});
