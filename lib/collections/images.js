Images = new FS.Collection("images", {
	stores: [new FS.Store.FileSystem("images", {path: "~/Agency/ACA/.tmp"})]
});

if (Meteor.isServer) {
	Images.allow({
		insert: function() { return true },
		update: function() { return true },
		remove: function() { return true },
		download: function() { return true }
	});

	Meteor.publish('images', function() {
		return Images.find({});
	});
}
