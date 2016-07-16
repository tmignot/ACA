Accounts.urls.enrollAccount = function (token) {
	return Meteor.absoluteUrl('enroll-account/' + token);
};

Meteor.startup(function(){
	process.env.MAIL_URL = "smtp://postmaster%40sandboxc3e06880313e4f1bba56c5988ad6b5d1.mailgun.org:5303ad722964e2e943b41527f8830c32@smtp.mailgun.org:587";
	if (Meteor.users.find().count() == 0) {
		var users = {
			username: "Administrator",
			password: "thepassispassword"
		};

		var uid = Accounts.createUser(users);
		Roles.addUsersToRoles(uid, ['get','list','insert', 'update', 'remove'], 'Agents');
		Roles.addUsersToRoles(uid, ['get','list','insert', 'update', 'remove'], 'Customers');
		Roles.addUsersToRoles(uid, ['get','list','insert', 'update', 'remove'], 'Properties');
		Roles.addUsersToRoles(uid, ['get','list','insert', 'update', 'remove'], 'Estimations');
		Roles.addUsersToRoles(uid, ['get','list','insert', 'update', 'remove'], 'Editor');
		Roles.addUsersToRoles(uid, ['get','list','remove'], 'Meetings');
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
