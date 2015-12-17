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
	'submit form': function(e,t) {
		e.preventDefault();
		Meteor.call('loginMethod', e.currentTarget.inputEmail.value, function(err,res) {
			if (res.google) {
				Meteor.loginWithGoogle({
						loginHint: e.currentTarget.inputEmail.value,
						requestPermissions: ['email','https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly'],
						forceApprovalPrompt: true,
						includeGrantedScopes: true
				});
			} else {
				console.log(e.currentTarget);
				Meteor.loginWithPassword(
					e.currentTarget.inputEmail.value,
					e.currentTarget.inputPassword.value
				);
			}
		});
	},
	'click .logout-button': function(e,t) {
		Meteor.logout();
	}
});
