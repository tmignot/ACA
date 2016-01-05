Template.Property.onCreated(function(){
	this.gmap = new ReactiveVar('');
	var self = this;
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
});

Template.Property.helpers({
	map: function() {
		return Template.instance().gmap.get();
	}
});

Template.Property.events({
	'click .edit-btn': function(e,t) {
		Router.go('/admin/estimations/edit/'+t.data._id);
	}
});
