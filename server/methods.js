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
	mergeUser: function(oldv) {
		if (!oldv) { return false; }
		var old = Meteor.users.findOne({_id: oldv._id});
		if (!old) { return false;	}
		if (old._id !== this.userId && this.userId) {
			var username = old.username;
			var emails = old.emails;
			emails[0].verified = true;
			var password = old.services.password;
			Meteor.users.remove({_id: old._id});
			Meteor.users.update({
				_id: this.userId
			},
			{
				$set: {
					'services.password': password,
					'username': username,
					'emails': emails
				}
			});
		}
		return true;
	},
	setEnrolledPassword: function(password) {
		Accounts.setPassword(this.userId, password);
	},
	'gapiGetEventList': function(uid, options) {
		var user = Agents.findOne({_id: uid})
		if (user.services.google) {
			var addr = user.emails[0].address;
			var query = "";
			_.each(_.keys(options), function(key) {
				query += '&'+key+'='+options[key];
			});
			var path = 'calendar/v3/calendars/'+addr+'/events';
			var fiber = Fiber.current;
			GoogleApi.get(path, {user: user, params: options}, function(e,r) {
				fiber.run({error: e, result: r});
			});
			return Fiber.yield();
		}
	}
});
