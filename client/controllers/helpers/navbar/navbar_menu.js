Template.navbar_menu.onRendered(function() {
	$(".button-collapse").sideNav();
});

Template.navbar_menu.helpers({
	isAdmin: function(){
		return Roles.userIsInRole(Meteor.user(), ['get','list','insert', 'update', 'remove'], 'Agents');
	},
	hasPermission: function(p, c) {
		return Roles.userIsInRole(Meteor.user(), p, c);
	}
});

Template.navbar_menu.events({
	'click #d_logout': function(e, t) {
		Meteor.logout();
	}
})
