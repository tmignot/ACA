Fiber = Npm.require('fibers');

Meteor.methods({
	addUser: function(username) {
		var new_user = Accounts.createUser({
			username: username,
			email: username+'@gmail.com'
		});
		Accounts.sendEnrollmentEmail(new_user);
	},
	loginMethod: function(email) {
		return {google: email == 'test' ? false : true};
	},
	mergeUser: function(olduser, newuser) {
		if (!olduser) { return false; }
		var old = Meteor.users.findOne({_id: olduser._id});
		if (!old) { return false;	}
		Meteor.users.update({
			_id: old._id
		},
		{
			$set: {
				'services.google': newuser.services.google,
				'emails.0.verified': true
			}
		});
		return true;
	},
	verifEmail: function(user) {
		Accounts.users.update({_id: user._id},
		{
			$set: {
				'emails.0.verified': true
			}
		});
	},
	setEnrolledPassword: function(password) {
		Accounts.setPassword(this.userId, password);
	},
	'gapiGetEventList': function(uid, options) {
		var user = Agents.findOne({_id: uid});
		if (user && user.services && user.services.google) {
			var addr = user.emails[0].address;
			var path = 'calendar/v3/calendars/'+addr+'/events';
			var fiber = Fiber.current;
			GoogleApi.get(path, {user: user, params: options}, function(e,r) {
				fiber.run({error: e, result: r});
			});
			return Fiber.yield();
		}
	},
	'addMeetings': function(opt) {
		console.log("meetings methods call");
	},
	'addProperty': function(opt) {
		console.log("property methods call");
	},
	'addCustomers': function(opt) {
		console.log("customers methods call")
	}
});
