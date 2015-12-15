Template.Estimations.onRendered(function() {
	$(".autoform-form").removeClass('form-horizontal');
});

Template.Estimations.helpers({
	estimations: function() {
		return Properties.find();
	}
});
