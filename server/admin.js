var verif = true;

if (verif == false) {
	Meteor.startup(function(){
		var users = {
			username: "test",
			password: "test"
		};

		Accounts.createUser(users);
	});
}