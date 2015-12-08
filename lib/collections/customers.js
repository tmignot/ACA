CustomerSchema = new SimpleSchema({
	name: {
		type: String
	},
	phones: {
		type: [PhoneSchema]
	},
	isOwner: {
		type: Boolean
	},
	contribution: {
		type: Number,
		optional: true,
		min: 0
	},
	earnings: {
		type: Number,
		optional: true,
		min: 0
	},
	wish: {
		type: PropertySchema,
		optional: true
	}
});

Customers = new Mongo.Collection("Customers");
Customers.attachSchema(CustomerSchema);
