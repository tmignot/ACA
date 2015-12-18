Template.Estimations.onRendered(function() {
	$('.side-nav li').removeClass('active');
	$('.side-nav li.estimations').addClass('active');
	$(".autoform-form").removeClass('form-horizontal');
});

Template.Estimations.helpers({
	estimations: function() {
		return Properties.find();
	}
});
