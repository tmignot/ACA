Template.Property.onRendered(function() {
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .properties-link').addClass('active');
});

Template.Property.onCreated(function(){
	var self = this;
	this.type = this.data.estimation ? 'estimations' : 'properties';
	this.images = [];
	_.each(this.data.images, function(img) {
		self.images.push(img);
	});
	this.gmap = new ReactiveVar('');
	Meteor.call('geocode', self.data.geocode, function(e,r) {
		if (r && r.length) {
			var maps = {
				path: 'https://maps.googleapis.com/maps/api/staticmap?',
				params: {
					center: self.data.geocode,
					zoom: '15',
					size: '600x300',
					maptype: 'roadmap',
					markers: 'color:red%7C'+r[0].latitude+','+r[0].longitude,
					key: 'AIzaSyD4RgVp6VVGARHMw7snoozMIvUIaC198Ts'
				}
			};
			var url = maps.path;
			_.each(_.pairs(maps.params), function(pair) {
				url = url + '&' + pair[0] + '=' + pair[1];
			});
			self.gmap.set(url);	
		}
	});
});

Template.Property.onRendered(function(){
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

Template.Property.helpers({
	map: function() {
		return Template.instance().gmap.get();
	},
	img: function() {
		var img = Images.find({_id: {$in: Template.instance().images}}).fetch();
		var arr = [];
		_.each(img, function(i) {
			arr.push(i.url());
		});
		return arr;
	}
});

Template.Property.events({
	'click .edit-btn': function(e,t) {
		Router.go('/admin/'+t.type+'/edit/'+t.data._id);
	},
	'click .transfer-btn': function(e,t) {
		if (t.type == 'estimations' &&
				Roles.userIsInRole(Meteor.user()._id, 'insert', 'Properties'))
		{
			Properties.update({_id: t.data._id}, {$set: {estimation: false}});
			Router.go('/admin/properties/'+t.data._id);
		}
	},
	'click .remove-btn': function(e,t) {
		if (Roles.userIsInRole(Meteor.user()._id, 'remove', 'Estimations')) {
			console.log("removing");
//			Router.go('/admin/estimations');
		}
	}
});
