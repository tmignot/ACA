Template.addAgent.onRendered(function(){
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .agents-link').addClass('active');
});

Template.addAgent.events({
	'submit form': function(e,t) {
		e.preventDefault();
		Meteor.call('addUser', e.currentTarget.inputUsername.value, function(err){
			if (err)
				console.log(err);
			else
				Router.go('/admin/agents');
		});
	},
	'click .cancel': function(e,t) {
		Router.go('/admin/agents');
	}
});
