Template.Properties.onRendered(function() {
	$(".autoform-form").removeClass('form-horizontal');
});

Template.Properties.helpers({
	properties: function() {
		return Properties.find();
	}
});
