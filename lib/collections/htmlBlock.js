htmlBlocks = new Mongo.Collection('html_blocks');

if (Meteor.isServer) {
	Meteor.publish('html_blocks', function(){
		return htmlBlocks.find();
	});
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