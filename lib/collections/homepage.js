HomePage = new Mongo.Collection('home_page');


if (Meteor.isServer) {
	Meteor.publish('home_page', function(){
		return HomePage.find();
	});

	Meteor.startup(function(){
		if (HomePage.find().count() === 0) {
			var home = {
				color: "#000000",
				url: "/logoagence.png"
			};
			
			console.log('insert home_page');
			HomePage.insert(home);
		}
	});
}

HomePage.allow({
	insert: function(doc) { return true; },
	update: function(doc, id) { return false; },
	remove: function(id) { return false; }
});

HomePage.deny({
	insert: function() { return false; },
	update: function() { return true; },
	remove: function() { return true; }
});
