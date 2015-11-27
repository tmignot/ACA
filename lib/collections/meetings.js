MeetingSchema = new SimpleSchema({
	date: {
		type: Date
	},
	agentId: {
		type: String
	},
	description: {
		type: String,
		optional: true
	},
	propertyId: {
		type: String,
		optional: true
	},
	buyerId: {
		type: String,
		optional: true
	},
	geocode: {
		type: Object,
		optional: true
	}
});

Meetings = new Mongo.Collection("Meetings");
Meetings.attachSchema(MeetingSchema);
