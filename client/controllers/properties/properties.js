Template.Properties.onRendered(function() {
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .properties-link').addClass('active');
});

Template.Properties.helpers({
	properties: function() {
		return Properties.find();
	}
});

Template.Properties.events({
});
