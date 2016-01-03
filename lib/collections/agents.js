Agents = Meteor.users;
Meteor.Collections['agents'] = Agents;

if (Meteor.isServer) {
	Meteor.publish('agents', function(){
		if (this.userId && Roles.userIsInRole(this.userId, ['list'], 'Agents')) { 
			return Agents.find();
		} else {
			return [];
		}
	});
	Meteor.publish('fullUser', function() {
		return Agents.find({_id: this.userId});
	});
	Meteor.publish('enrolledUser', function(token) {
		return Agents.find({
			'services.password.reset.token': token,
			'emails.0.verified': false
		});
	});
}
