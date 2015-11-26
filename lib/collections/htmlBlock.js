htmlBlocks = new Mongo.Collection('html_blocks');

if (Meteor.isServer) {
	Meteor.publish('html_blocks', function(){
		return htmlBlocks.find();
	});

	// Meteor.startup(function(){
	// 	var bloc = {
	// 		number: 1,
	// 		blocks: {
	// 			title: "first blocks",
	// 			content: "<div class='first-block'><h2>Hello from the first block</h2></div>"
	// 		}
	// 	};

	// 	htmlBlocks.insert(bloc);
	// });
}

htmlBlocks.allow({
	insert: function(doc) { return true; },
	update: function(doc, id) { return false; },
	remove: function(id) { return false; }
});

htmlBlocks.deny({
	insert: function() { return false; },
	update: function() { return true; },
	remove: function() { return true; }
});