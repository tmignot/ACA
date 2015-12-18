function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Meteor.startup(function() {
	if (Properties.find().count() == 0) {

		console.log("## No properties found,\n\t- generate properties");
		console.log("Error Message:");
		_.each(_.range(25), function(){
			var transaction = ['Vente', 'Location'];
			
			var property = [
				'Maison',
				'Appartement',
				'Terrain',
				'Fond de commerce',
				'Viager',
				'Loft',
				'Immeuble',
				'Local commercial',
				'Box et Parking'
			];

			var opt = {
				reference: faker.finance.account(),
				transactionType: transaction[ getRandomInt(0, 1) ],
				propertyType: property[ getRandomInt(0, 8) ],
				year: faker.random.number(),
				price: faker.random.number(),
				geocode: faker.address.streetAddress(),
				exclusive: faker.random.boolean(),
				roomNumber: faker.random.number(),
				bedroomNumber: faker.random.number(),
				bathroomNumber: faker.random.number(),
				closetNumber: faker.random.number(),
				livingRoomSurface: faker.random.number(),
				totalSurface: faker.random.number(),
				state: faker.hacker.phrase(),
				configuration: faker.hacker.phrase(),
				floorNumber: faker.random.number(),
				heating: faker.hacker.phrase(),
				terrainSurface: faker.random.number(),
				garage: faker.random.boolean(),
				dependencyNumber: faker.random.number(),
				dpe: faker.random.number(),
				ges: faker.random.number(),
				taxes: faker.finance.amount(),
				charges: faker.finance.amount(),
				title: faker.name.title(),
				description: faker.lorem.paragraph(),
				visible: faker.random.boolean(),
				localInformation: faker.lorem.sentences(),
				commision: faker.random.number(),
				history: [],
				estimation: faker.random.boolean()
			};

			Properties.insert(opt, function(err){
				if (err) {
					console.log(err.message);
				}
			});
		});

	}
});