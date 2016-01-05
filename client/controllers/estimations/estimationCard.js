Template.estimationCard.events({
	'click .estimation-card': function(e,t) {
		if (Roles.userIsInRole(Meteor.user()._id, 'get', 'Estimations'))
			Router.go('/admin/estimations/'+ $(e.currentTarget).data('id'));
	}
});
