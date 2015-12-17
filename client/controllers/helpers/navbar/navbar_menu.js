Template.navbar_menu.helpers({
	isAdmin: function(){
		return Roles.userIsInRole(Meteor.user(), ['get','list','insert', 'update', 'remove'], 'Agents');
	}
});

Template.navbar_menu.events({
	'click #d_logout': function(e, t) {
		Meteor.logout();
	}
})