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
	gapiGetEventList: function(uid, options) {
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
	updateRoles: function(data) {
		console.log(data);
		if (data && data.uid && data.collection && data.method) {
			var methods = ['get','list','insert','update','remove'];
			var collections = ['Agents','Customers','Meetings','Properties','Estimations','Editor'];
			if (methods.indexOf(data.method) >= 0 && collections.indexOf(data.collection) >= 0) {
				console.log('good query');
				if (Roles.userIsInRole(this.userId, ['update'], 'Agents')) {
					console.log('access granted');
					var usr = Meteor.users.findOne({_id: data.uid});
					if (usr && usr.username != 'test') {
						console.log('user found:' + usr.username);
						if (Roles.userIsInRole(data.uid, [data.method], data.collection))
							Roles.removeUsersFromRoles(data.uid, [data.method], data.collection);
						else
							Roles.addUsersToRoles(data.uid, [data.method], data.collection);
						return true;
					}
				}
			}
		}
		return false;
	},
	geocode: function(addr) {
		if (this.userId) {
			var geo = new GeoCoder({
				geocoderProvider: 'google',
				httpAdapter: 'https',
				apiKey: 'AIzaSyDtIrx8xVrESPzpgwvR0j7qhIF9Go-SgCM'
			});
			return geo.geocode(addr);
		}
	}
});
