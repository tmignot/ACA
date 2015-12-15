Agents = Meteor.users;

if (Meteor.isServer) {
    Meteor.publish('agents', function(){
			console.log(this.userId);
			console.log(Roles.getAllRoles());
			if (this.userId && Roles.userIsInRole(this.userId, 'r', 'Agents')) { 
        return Agents.find();
			} else {
				return [];
			}
    });
		Meteor.publish('enrolledUser', function(token) {
			return Agents.find({'service.password.reset.token': token});
		});

    Meteor.startup(function(){
    /*
        Randomize creation of Agents
    */
    });
}
