HomePage = new Mongo.Collection('home_page');

if (Meteor.isServer) {
	Meteor.publish('editor', function(){
		return [
			HomePage.find(),
			htmlBlocks.find()
		];
	});

	Meteor.publish('home_page', function(){
		return [
			HomePage.find(),
			htmlBlocks.find(),
			Properties.find({visible: true})
		];
	});

	Meteor.startup(function(){
		if (HomePage.find().count() === 0) {
			var home = {
				id: 1,
				bgColor: "#000000",
				mainColor: "#622181",
				logoUrl: "/logoagence.png",
				blocks: []
			};
			
			console.log('insert home_page');
			HomePage.insert(home);
		}
	});
}

HomePage.allow({
	insert: function(doc) { return true; },
	update: function(doc, id) { return true; },
	remove: function(id) { return false; }
});

HomePage.deny({
	insert: function() { return false; },
	update: function() { return false; },
	remove: function() { return true; }
});
