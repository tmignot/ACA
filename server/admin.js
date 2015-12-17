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
		Roles.addUsersToRoles(uid, ['get','list','insert', 'update', 'remove'], 'Agents');
		Roles.addUsersToRoles(uid, ['get','list','insert', 'update', 'remove'], 'Customers');
		Roles.addUsersToRoles(uid, ['get','list','insert', 'update', 'remove'], 'Meetings');
		Roles.addUsersToRoles(uid, ['get','list','insert', 'update', 'remove'], 'Properties');
		Roles.addUsersToRoles(uid, ['get','list','insert', 'update', 'remove'], 'Estimations');
		Roles.addUsersToRoles(uid, ['get','list','insert', 'update', 'remove'], 'Editor');
	}

	Accounts.validateNewUser(function(user) {
		var currentUser = Meteor.user();
		if (Meteor.users.find().count() == 0 ||
			Roles.userIsInRole(currentUser, ['insert'], 'Agents')){
			return true;
		}
		if (user && user.services && user.services.google && 
				user.services.google.email &&
				Accounts.findUserByEmail(user.services.google.email)) {
			return true;
		}
		throw new Meteor.Error(403, "Not authorized to create new users");
	});
});
