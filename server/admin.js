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
	

		/*** FAKER ***/

		console.log("## You have less than 10 agents,\n\t- generate agents");
		console.log("Error Message:");

		_.each(_.range(10), function(){
			var randomEmail = faker.internet.email();
			var randomName = faker.name.findName();
			var userName = faker.internet.userName();

			Accounts.createUser({
				username: userName,
				profile: {
					name: randomName,
				},
				email: randomEmail,
				password: 'password'
			});
		});

	}

	Accounts.validateNewUser(function(user) {
		var currentUser = Meteor.user();
		if (Meteor.users.find().count() == 0 ||
			Roles.userIsInRole(currentUser, ['insert'], 'Agents')){
			return true;
		}
		if (user && user.services && user.services.google && 
				user.services.google.email &&
				Accounts.users.findOne({
					'emails.0.address': user.services.google.email,
					'emails.0.verified': true
				}))
		{
			Meteor.call('mergeUser', Accounts.users.findOne({
				'emails.0.address': user.services.google.email
			}), user);
			return false;
		}
		throw new Meteor.Error(403, "Not authorized to create new users");
	});
});
