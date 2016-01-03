Template.Agents.onRendered(function(){
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .agents-link').addClass('active');
});

Template.Agents.helpers({
	agents: function() {
		return Agents.find({});
	}
});

Template.Agents.events({
	'click button.addAgent': function(e,t) {
        Modal.show('addAgent');
	}
});
