PropertySchema = new SimpleSchema({
	reference: {
		type: Number,
		optional: true,
		autoValue: function() {
			return Properties.findOne({}, {
				fields: { reference: 1 },
				sort: { reference: "desc" }
			}).reference + 1;
		}
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
			var d = new Date();
			return d.getFullYear();
		}
	},
	price: {
		type: Number,
		min: 0
	},
	geocode: {
		type: Object,
		label: "Adresse",
		autoform: {
			type: "text"
		}
	},
	exclusive: {
		type: Boolean,
		label: 'Exclusivité',
		autoform: {
					 type: "boolean-radios",
					 trueLabel: "Oui",
					 falseLabel: "Non",
					 value: false
				}
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
		label: 'Garage',
		autoform: {
					 type: "boolean-radios",
					 trueLabel: "Oui",
					 falseLabel: "Non",
					 value: false
				}
	},
	dependencyNumber: {
		type: Number,
		min: 0
	},
	dpe: {
		type: Number
	},
	ges: {
		type: Number
	},
	taxes: {
		type: Number,
		decimal: true
	},
	charges: {
		type: Number,
		decimal: true,
		optional: true
	},
	title: {
		type: String,
		min: 5,
		max: 255
	},
	description: {
		type: String,
		min: 25
	},
	visible: {
		type: Boolean,
		label: 'Visible',
		autoform: {
					 type: "boolean-radios",
					 trueLabel: "Oui",
					 falseLabel: "Non",
					 value: false
				}
	},
	localInformations: {
		type: String,
		optional: true
	},
	commision: {
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
//Properties.attachSchema(PropertySchema);

Properties.allow({
	insert: function(doc) { return true;},
	update: function(doc) { return true;},
	remove: function(doc) { return true;}
});

if (Meteor.isServer) {
	Meteor.publish('properties', function() {
		if (this.userId) {
			return Properties.find({estimation: false});
		} else {
			return [];
		}
	});
	Meteor.publish('estimations', function() {
		if (this.userId) {
			return Properties.find({estimation: true});
		} else {
			return [];
		}
	});
}
