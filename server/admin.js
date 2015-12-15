Accounts.urls.enrollAccount = function (token) {
	return Meteor.absoluteUrl('enroll-account/' + token);
};


Meteor.startup(function(){
	if (Meteor.users.find().count() == 0) {
		var users = {
			username: "test",
			password: "test"
		};

		var uid = Accounts.createUser(users);
		Roles.addUsersToRoles(uid, ['r','w','rm'], 'Agents');
		Roles.addUsersToRoles(uid, ['r','w','rm'], 'Customers');
		Roles.addUsersToRoles(uid, ['r','w','rm'], 'Meetings');
		Roles.addUsersToRoles(uid, ['r','w','rm'], 'Properties');
		Roles.addUsersToRoles(uid, ['r','w','rm'], 'Estimations');
		Roles.addUsersToRoles(uid, ['r','w','rm'], 'Editor');
	}
});
