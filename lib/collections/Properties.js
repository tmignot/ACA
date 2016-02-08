PropertySchema = new SimpleSchema({
	old_id: {
		type: Number,
		optional: true
	},
	old_ref: {
		type: Number,
		optional: true
	},
	reference: {
		type: String
	},
	transactionType: {
		type: String,
		allowedValues: [
			'Vente',
			'Location'
		]
	},
	propertyType: {
		type: String,
		allowedValues: [
			'Maison',
			'Appartement',
			'Terrain',
			'Fond de commerce',
			'Viager',
			'Loft',
			'Immeuble',
			'Local commercial',
			'Box et Parking'
		]
	},
	year: {
		type: Number,
		min: 1900,
		max: function() {
			return moment().year();
		},
		optional: true
	},
	price: {
		type: Number,
		min: 0
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
		optional: true
	},
	roomNumber: {
		type: Number,
		min: 0
	},
	bedroomNumber: {
		type: Number,
		min: 0
	},
	bathroomNumber: {
		type: Number,
		min: 0
	},
	closetNumber: {
		type: Number,
		min: 0
	},
	livingRoomSurface: {
		type: Number,
		min: 0
	},
	totalSurface: {
		type: Number,
		min: 0
	},
	state: {
		type: String,
		optional: true
	},
	configuration: {
		type: String,
		optional: true
	},
	floorNumber: {
		type: Number,
		min: 0
	},
	heating: {
		type: String,
		optional: true
	},
	terrainSurface: {
		type: Number,
		min: 0
	},
	garage: {
		type: Boolean,
	},
	dependencyNumber: {
		type: Number,
		min: 0
	},
	dpe: {
		type: Number,
		min: 1
	},
	ges: {
		type: Number,
		min: 1
	},
	taxes: {
		type: Number,
		min: 0,
		decimal: true,
		optional: true
	},
	charges: {
		type: Number,
		min: 0,
		decimal: true,
		optional: true
	},
	commission: {
		type: Number,
		min: 0
	},
	title: {
		type: String,
		max: 255,
		optional: true
	},
	description: {
		type: String,
		optional: true
	},
	localInformations: {
		type: String,
		optional: true
	},
	exclusive: {
		type: Boolean,
		optional: true
	},
	visible: {
		type: Boolean
	},
	images: {
		type: [String],
		optional: true
	},
	history: {
		type: [MeetingSchema],
		optional: true
	},
	estimation: {
		type: Boolean
	},
	ownerInfo: {
		type: String,
		optional: true
	}
});

Properties = new Mongo.Collection("properties");
Meteor.Collections['properties'] = Properties;
Meteor.Collections['estimations'] = Properties;
Properties.attachSchema(PropertySchema);

Properties.allow({
	insert: function(doc) {
		var uid = Meteor.user()._id;
		if (doc.estimation) {
			if (uid && Roles.userIsInRole(uid, 'insert', 'Estimations'))
				return true;
		} else {
			if (uid && Roles.userIsInRole(uid, 'insert', 'Properties'))
				return true;
		}
		return false;
	},
	update: function(doc) {
		var uid = Meteor.user()._id;
		if (doc.estimation) {
			if (uid && Roles.userIsInRole(uid, 'update', 'Estimations'))
				return true;
		} else {
			if (uid && Roles.userIsInRole(uid, 'update', 'Properties'))
				return true;
		}
		return false;
	},
	remove: function(doc) {
		var uid = Meteor.user()._id;
		if (doc.estimation) {
			if (uid && Roles.userIsInRole(uid, 'remove', 'Estimations'))
				return true;
		} else {
			if (uid && Roles.userIsInRole(uid, 'remove', 'Properties'))
				return true;
		}
		return false;
	}
});

if (Meteor.isServer) {
	Meteor.publish('properties', function() {
		if (this.userId && Roles.userIsInRole(this.userId, 'list', 'Properties')) {
			return Properties.find({estimation: false});
		} else {
			return [];
		}
	});
	Meteor.publish('propertyClient', function(id) {
		if (id && Properties.find({_id: id}).count()) {
			return Properties.find({_id: id}, {
				fields: { 
					localInformations: 0					
				}
			});
		} else
			return [];
	});
	Meteor.publish('propertie', function(id) {
		if (this.userId && Roles.userIsInRole(this.userId, 'get', 'Properties')) {
			return Properties.find({_id: id, estimation: false});
		} else {
			return [];
		}
	});
	Meteor.publish('estimations', function() {
		if (this.userId && Roles.userIsInRole(this.userId, 'list', 'Estimations')) {
			return Properties.find({estimation: true});
		} else {
			return [];
		}
	});
	Meteor.publish('estimation', function(id) {
		if (this.userId && Roles.userIsInRole(this.userId, 'get', 'Estimations')) {
			return Properties.find({_id: id, estimation: true});
		} else {
			return [];
		}
	});
}
