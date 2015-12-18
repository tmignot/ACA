Meteor.startup(function(){
	if (Meetings.find().count() == 0) {

		console.log("## No Meetings found,\n\t- generate meetings");
		console.log("Error Message:");
	
		_.each(_.range(10), function(){

			var opt = {
				date: faker.date.future(),
				description: faker.lorem.paragraph(),
				agentId: faker.internet.password(),
				propertyId: faker.internet.password(),
				buyderId: faker.internet.password(),
				geocode: faker.address.streetAddress()
			};

			Meetings.insert(opt, function(err){
				if (err) {
					console.log(err.message);
				}
			});	
		});
	}
});