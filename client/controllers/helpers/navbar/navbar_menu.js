Template.navbar_menu.helpers({
	username: function () {
		return Meteor.user().username;
	}
});

Template.navbar_menu.events({
	'click #d_logout': function(e, t) {
		Meteor.logout();
	}
});
