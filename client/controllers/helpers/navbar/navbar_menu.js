Template.navbar_menu.events({
	'click #d_logout': function(e, t) {
		Meteor.logout();
	}
})