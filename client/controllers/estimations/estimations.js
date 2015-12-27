Template.Estimations.onRendered(function() {
	$('.sidebar-nav li').removeClass('active');
	$('.sidebar-nav li.estimations').addClass('active');
	$(".autoform-form").removeClass('form-horizontal');
});

Template.Estimations.helpers({
	estimations: function() {
		return Properties.find();
	}
});