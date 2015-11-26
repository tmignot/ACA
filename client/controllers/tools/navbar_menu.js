Template.navbar_menu.helpers({
	current_user: function(){
		return Meteor.user().username;
	}
});