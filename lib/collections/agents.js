Agents = Meteor.users;
Meteor.Collections['agents'] = Agents;

if (Meteor.isServer) {
	Meteor.publish('agents', function(){
		if (this.userId && Roles.userIsInRole(this.userId, ['list'], 'Agents')) { 
			console.log('ok agents');
			return Agents.find();
		} else {
			console.log('bad agents');
			return [];
		}
	});
	Meteor.publish('agent', function(uid){
		if (this.userId && Roles.userIsInRole(this.userId, ['get'], 'Agents')) { 
			return Agents.find({_id: uid});
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
