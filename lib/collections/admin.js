Agency = new Mongo.Collection('agency');

Agency.attachSchema(new SimpleSchema({
		name: {
			type: String,
			min: 2,
			max: 32		
		},
		fname: {
			type: String,
			min: 2,
			max: 32
		},
		email: {
			type: String,
			regEx: SimpleSchema.RegEx.Email
		},
		roles: {
			type: String,
			optional: true		
		}
	})
);

if (Meteor.isServer) {
	Meteor.publish('agency', function(){
		return Agency.find();
	});

	Meteor.startup(function(){
		if (Agency.find().count === 0) {
			var admin = {
				name: "test",
				fname: "test",
				email: "test@test.fr",
				roles: "admin"
			};
						
			Agency.insert(admin);
		}
	});
}

Agency.allow({
	insert: function(doc) { return true; },
	update: function(doc, id) { return false; },
	remove: function(id) { return false; }
});

Agency.deny({
	insert: function() { return false; },
	update: function() { return true; },
	remove: function() { return true; }
});