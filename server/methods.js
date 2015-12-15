Meteor.methods({
	addUser: function(username) {
		var new_user = Accounts.createUser({
			username: username,
			email: username+'@gmail.com'
		});
		Accounts.sendEnrollmentEmail(new_user);
	}
});
			
