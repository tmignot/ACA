Template.AgentCard.helpers({
	picture: function() {
		if (Template.instance().data.services.google) {
			return Template.instance().data.services.google.picture;
		} else {
			return '/user-default.png';
		}
	},
	email: function() {
		if (Template.instance().data.emails) {
			return Template.instance().data.emails[0].address;
		}
		return "(no email)"
	},
	name: function() {
		if (Template.instance().data.services.google) {
			return Template.instance().data.services.google.name;
		}
		return "(no name)"
	}
});

Template.AgentCard.events({
	'click .card': function(e,t) {
		if (Roles.userIsInRole(Meteor.user()._id, 'get', 'Agents'))
			Router.go('/admin/agents/'+$(e.currentTarget).data('uid'));
	}
});
