CustomerSchema = new SimpleSchema({
	name: {
		type: String
	},
	phones: {
		type: String
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

Customers = new Mongo.Collection("customers");
Meteor.Collections['customers'] = Customers;
Customers.attachSchema(CustomerSchema);

if (Meteor.isServer) {
	Meteor.publish('customers', function() {
		return Customers.find();
	});
}
