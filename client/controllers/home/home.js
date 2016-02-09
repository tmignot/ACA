Template.Home.helpers({
	map: function() {
		var maps = {
			path: 'https://maps.googleapis.com/maps/api/staticmap?',
			params: {
				center: 'ACA immobilier coubron 77',
				zoom: '15',
				size: '600x400',
				maptype: 'roadmap',
				markers: 'color:red%7C48.9152408,2.5789193',
				key: 'AIzaSyD4RgVp6VVGARHMw7snoozMIvUIaC198Ts'
			}
		};
		var url = maps.path;
		_.each(_.toPairs(maps.params), function(pair) {
			url = url + '&' + pair[0] + '=' + pair[1];
		});
		return url;
	},
	darken: function(color) {
		return LightenDarkenColor(color, -20);
	},
	prop: function(id) {
		return Properties.findOne({_id: id});
	},
	currentProperty: function() {
		return Session.get('currentProperty');
	}
});

Template.Home.events({
	'click .navbar-collapse ul li a': function() {
		$('.navbar-toggle:visible').click();
	},
	'click .logo': function() {
		Router.go('Home', {}, {});
	}
});
