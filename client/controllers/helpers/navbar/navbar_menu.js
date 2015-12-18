Template.navbar_menu.onRendered(function() {
	$(".button-collapse").sideNav();
});

Template.navbar_menu.helpers({
	isAdmin: function(){
		return Roles.userIsInRole(Meteor.user(), ['get','list','insert', 'update', 'remove'], 'Agents');
	},
	hasListPermission: function(c) {
		return Roles.userIsInRole(Meteor.user(), ['list'], c);
	}
});

Template.navbar_menu.events({
	'click #d_logout': function(e, t) {
		Meteor.logout();
	},
	'click .side-nav li': function(e, t) {
		Router.go('/admin/' + $(e.currentTarget).data('link'));
	}
})
