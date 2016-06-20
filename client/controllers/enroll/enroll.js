Tracker.autorun(function (c) {
	if (Session.equals("mergingUserOk", false))
		Router.go('/');
	if (Session.equals("mergingUserOk", true))
		Router.go('/admin');
});

Template.Enroll.onCreated(function() {
	var agent = this.data.enrolledUser;
	var state = this.data.enrollState;
	console.log(this.data);
	if (state === 'start') {
		if (agent) {
			Meteor.call('verifEmail', agent);
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
	} else {
		Router.go('/admin');
	}
});
