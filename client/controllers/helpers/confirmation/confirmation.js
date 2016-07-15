Template.confirmation.events({
	'click .valid': function(e,t) {
		t.data.callback();
		Modal.hide('confirmation');
	}
});
