Template.Properties.onRendered(function() {
	$('select').material_select();
});

Template.Properties.helpers({
	properties: function() {
		return Properties.find();
	}
});
