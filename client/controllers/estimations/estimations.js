Template.Estimations.onRendered(function() {
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .estimations-link').addClass('active');
});

Template.Estimations.helpers({
	estimations: function() {
		return Properties.find();
	}
});

Template.Estimations.events({
	'click button.addEstimation': function(e,t) {
		Router.go('/admin/estimations/add');
	},
	'keyup .search-estimation input': function(e,t) {
		var query = e.currentTarget.value;
		if (!isNaN(parseInt(query)))
			query = parseInt(query);
		EstimationsPages.set('filters', {estimation: true, $or: [{ownerInfo: {$regex: '.*'+query+'.*', $options: 'i'}},{price: query}]});
	}
});
