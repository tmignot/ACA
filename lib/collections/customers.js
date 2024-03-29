CustomerSchema = new SimpleSchema({
	type: {
		type: String,
		allowedValues: ['rent', 'sell', 'search']
	},
	gender: {
		type: String,
		allowedValues: ['male','female']
	},
	name: {
		type: String
	},
	email: {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		optional: true
	},
	phones: {
		type: [Object],
		optional: true
	},
	'phones.$.label': {
		type: String
	},
	'phones.$.number': {
		type: String
	},
	geocode: {
		type: String,
		optional: true
	},
	address: {
		type: Object,
		optional: true
	},
	'address.streetNumber': {
		type: String,
		optional: true
	},
	'address.numCompl': {
		type: String,
		optional: true
	},
	'address.streetName': {
		type: String,
		optional: true
	},
	'address.complement': {
		type: String,
		optional: true
	},
	'address.zipcode': {
		type: String,
		optional: true
	},
	'address.city': {
		type: String,
		optional: true
	},
	'address.country': {
		type: String,
		optional: true,
		defaultValue: 'France'
	},
	budget: {
		type: Number,
		optional: true,
		min: 0,
		defaultValue: 0
	},
	contribution: {
		type: Number,
		optional: true,
		min: 0,
		defaultValue: 0
	},
	earnings: {
		type: Number,
		optional: true,
		min: 0,
		defaultValue: 0
	},
	wish: {
		type: Object,
		defaultValue: [],
		optional: true
	},
	'wish.propertyType': {
		type: String,
		optional: true
	},
	'wish.bedroomNumber': {
		type: String,
		optional: true
	},
	'wish.totalSurface': {
		type: Number,
		optional: true
	},
	'wish.city': {
		type: [String],
		optional: true
	},
	properties: {
		type: [String],
		optional: true
	},
	documents: {
		type: [String],
		optional: true
	}
});

Customers = new Mongo.Collection("customers");
Meteor.Collections['customers'] = Customers;
Customers.attachSchema(CustomerSchema);

Customers.allow({
	insert: function(doc) {
		var uid = Meteor.user()._id;
		if (uid && Roles.userIsInRole(uid, 'insert', 'Customers'))
			return true;
		return false;
	},
	update: function(doc) {
		var uid = Meteor.user()._id;
		if (uid && Roles.userIsInRole(uid, 'update', 'Customers'))
			return true;
		return false;
	},
	remove: function(doc) {
		var uid = Meteor.user()._id;
		if (uid && Roles.userIsInRole(uid, 'remove', 'Customers'))
			return true;
		return false;
	}
});

if (Meteor.isServer) {
	Meteor.publish('customers', function() {
		if (this.userId && Roles.userIsInRole(this.userId, 'list', 'Customers')) {
			return Customers.find();
		} else {
			return []
		}
	});

	Meteor.publish('customerMatch', function(id) {
		var c = Customers.findOne({_id: id});
		if (c.budget) {
			return Properties.find({
				estimation: false,
				price: {
					$gt: c.budget - 20000,
					$lt: c.budget + 20000
				},
				'address.city': {
					$in: c.wish.city
				}
			});
		} else
			return []
	});

	Meteor.smartPublish('customer', function(id) {
		if (this.userId && Roles.userIsInRole(this.userId, 'get', 'Customers')) {
			var customer = Customers.findOne({_id: id}, {fields: {properties: 1, documents: 1}})
			if (customer) {
				var properties = [];
				var documents = [];
				if (customer.properties)
					properties = customer.properties;
				if (customer.documents)
					documents = customer.documents;
				this.addDependency('customers', 'documents', function(c) {
					if (c.documents)
						return Documents.find({_id: {$in: c.documents}});
					return [];
				});
				return [
					Customers.find({_id: id}),
					Properties.find({}, {fields: {reference: 1}}),
					Properties.find({reference: {$in: properties}}, {fields: {
						reference: 1,
						'address.city': 1,
						'address.zipcode': 1,
						price: 1,
						commission: 1,
						estimation: 1
					}}),
					Documents.find({_id: {$in: documents}}),
					Meetings.find({customer: id}),
					Accounts.users.find({_id: this.userId},{fields: {services: 1}})
				];
			}
		}
		return []
	});
}
