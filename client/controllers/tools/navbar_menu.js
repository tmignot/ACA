Template.navbar_menu.helpers({
	current: function(){
		return Meteor.user().username;
	}
});