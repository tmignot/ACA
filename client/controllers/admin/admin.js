Template.Admin.onCreated(function() {
	this.email = new ReactiveVar(false);
});

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
	$("#inputEmail").focus();
});

Template.Admin.helpers({
	email: function() {
		return Template.instance().email.get()
	}
});

Template.Admin.events({
	'submit form': function(e,t) {
		e.preventDefault();
		if (!t.email.get()) {
			Meteor.call('loginMethod', e.currentTarget.inputEmail.value, function(err,res) {
				if (res.google) {
					var hint;
					if (e.currentTarget.inputEmail.value.match(/@gmail.com$/)) {
						hint = e.currentTarget.inputEmail.value;
					} else {
						hint = e.currentTarget.inputEmail.value + '@gmail.com';
					}
					Meteor.loginWithGoogle({
						loginHint: hint,
						requestPermissions: [
							'email',
							'https://www.googleapis.com/auth/calendar',
							'https://www.googleapis.com/auth/calendar.readonly'
						]
					});
				} else {
					t.email.set(true);
				}
			});
		} else {
			Meteor.loginWithPassword(
				e.currentTarget.inputEmail.value,
				e.currentTarget.inputPassword.value
			);
		}
	},
	'click .logout-button': function(e,t) {
		Meteor.logout();
	}
});
