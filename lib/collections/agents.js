Agents = Meteor.users;

if (Meteor.isServer) {
    Meteor.publish('agents', function(){
			if (this.userId && Roles.userIsInRole(this.userId, ['list'], 'Agents')) { 
        return Agents.find();
			} else {
				return [];
			}
    });
	Meteor.publish('enrolledUser', function(token) {
		return Agents.find({'services.password.reset.token': token});
	});
}
