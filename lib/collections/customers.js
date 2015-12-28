CustomerSchema = new SimpleSchema({
	name: {
		type: String
	},
	gender: {
		type: String,
		allowedValues: ['male', 'female']
	},
	phones: {
		type: [Object],
		optional: true
	},
	'phones.$': {
		type: Object,
		optional: true
	},
	'phones.$.label': {
		type: String,
		min: 2
	},
	'phones.$.number': {
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
Customers.attachSchema(CustomerSchema);

if (Meteor.isServer) {
	Customers.allow({
		insert: function(uid) {	return Roles.userIsInRole(uid, ['insert'], 'Customers');},
		update: function(uid) { return Roles.userIsInRole(uid, ['update'], 'Customers');},
		remove: function(uid) { return Roles.userIsInRole(uid, ['remove'], 'Customers');}
	});

	Meteor.publish('customers', function() {
		return Customers.find();
	});
}
