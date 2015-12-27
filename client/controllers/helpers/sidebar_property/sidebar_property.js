Template.sidebar_property.helpers({
	hasListPermission: function(c) {
		return Roles.userIsInRole(Meteor.user(), ['list'], c);
	}
});

Template.sidebar_property.events({
	'click .sidebar-nav li': function(e, t) {
        console.log("click on sidebar menu " + $(e.currentTarget).data('link'));
		Router.go('/admin/' + $(e.currentTarget).data('link'));
	}
});
