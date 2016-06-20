MeetingSchema = new SimpleSchema({
	from: {
		type: Date
	},
	to: {
		type: Date,
		optional: true
	},
	description: {
		type: String,
		optional: true
	},
	agent: {
		type: String
	},
	property: {
		type: String,
		optional: true
	},
	customer: {
		type: String,
		optional: true
	},
	geocode: {
		type: String,
		optional: true
	},
	gid: {
		type: String,
		optional: true
	}
});

Meetings = new Mongo.Collection("meetings");
Meteor.Collections['meetings'] = Meetings;
Meetings.attachSchema(MeetingSchema);

Meetings.allow({
	insert: function(doc) {
		var uid = Meteor.user()._id;
		if (uid && Roles.userIsInRole(uid, 'insert', 'Meetings'))
			return true;
		return false;
	},
	update: function(doc) {
		var uid = Meteor.user()._id;
		if (uid && Roles.userIsInRole(uid, 'update', 'Meetings'))
			return true;
		return false;
	},
	remove: function(doc) {
		var uid = Meteor.user()._id;
		if (uid && Roles.userIsInRole(uid, 'remove', 'Meetings'))
			return true;
		return false;
	}
});

if (Meteor.isServer) {
	Meteor.publish('meetings', function(id) {
		if (Agents.find({_id:id}).count())
			return Meetings.find({agent: id});
		if (Customers.find({_id:id}).count())
			return Meetings.find({customer: id});
		if (Properties.find({_id:id}).count())
			return Meetings.find({property: id});
		return [];
	});
}
