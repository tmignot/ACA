Tracker.autorun(function (c) {
	if (Session.equals("mergingUserOk", false))
		Router.go('/');
	if (Session.equals("mergingUserOk", true))
		Router.go('/admin/dashboard');
});

Template.Enroll.onCreated(function() {
	var agent = this.data.enrolledUser;
	var state = this.data.enrollState;
	console.log(this.data);
	if (state === 'start') {
		if (agent) {
			Meteor.loginWithGoogle({
				loginHint: agent.username,
				requestPermissions: ['email', 'https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly'],
				redirectUrl: Meteor.absoluteUrl() + 'enroll-callback/' + agent.services.password.reset.token
			}, function(e) {
				if (e) {console.log(e)}
			});
		} else {
			Router.go('/enroll-callback/error');
		}
	} else if (state !== 'finish') {
		console.log('error: '+ state);
	}
});

Template.Enroll.onRendered(function() {
});

Template.Enroll.events({
	'submit form': function(e,t) {
		e.preventDefault();
		if (e.currentTarget.accountPasswordInput.value === e.currentTarget.accountPasswordConfirmInput.value) {
			Meteor.call('setEnrolledPassword', e.currentTarget.accountPasswordInput.value, function(e,r) {
				if (e) {
					console.log(e);
				}
			});
		} else {
			console.log('error');
		}
	}
});
