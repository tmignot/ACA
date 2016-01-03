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
        Modal.show('addEstimation');
	}
});
