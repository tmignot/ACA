PropertySchema = new SimpleSchema({
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
		}
	},
	price: {
		type: Number,
		min: 0
	},
	geocode: {
		type: String,
		optional: true
	},
	exclusive: {
		type: Boolean,
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
	title: {
		type: String,
		min: 5,
		max: 255,
		optional: true
	},
	description: {
		type: String,
		min: 25,
		optional: true
	},
	visible: {
		type: Boolean
	},
	localInformations: {
		type: String,
		optional: true
	},
	commission: {
		type: Number,
		min: 0
	},
	history: {
		type: [MeetingSchema],
		optional: true
	},
	estimation: {
		type: Boolean
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
			if (this.userId && Roles.userIsInRole(uid, 'insert', 'Estimations'))
				return true;
		} else {
			if (this.userId && Roles.userIsInRole(uid, 'insert', 'Properties'))
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
	Meteor.publish('propertie', function(id) {
		if (this.userId && Roles.userIsInRole(this.userId, 'get', 'Properties')) {
			return Properties.find({estimation: false});
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
