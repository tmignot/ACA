Template.Admin.onRendered(function(){
	if (!Meteor.user()) {
		console.log("not logged in");
		$("#wrapper").css("padding-left", "0px");
		$('div.checkbox input').css("visibility", "visible");
	}
	else {
		console.log("logged in");
		$("#wrapper").css("padding-left", "");
	}
});

Template.Admin.events({
	'submit': function(e,t) {
		e.preventDefault();
		Meteor.loginWithPassword(e.target.inputEmail.value, e.target.inputPassword.value);
	},
	'click .logout-button': function(e,t) {
		Meteor.logout();
	}
});
