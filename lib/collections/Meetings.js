MeetingSchema = new SimpleSchema({
	date: {
		type: Date
	},
	description: {
		type: String,
		optional: true
	},
	agentId: {
		type: String
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

Meetings = new Mongo.Collection("meetings");
Meetings.attachSchema(MeetingSchema);

if (Meteor.isServer) {
	Meteor.publish('meetings', function() {
		return Meetings.find();
	});
}
