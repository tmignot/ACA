Images = new FS.Collection("images", {
	stores: [new FS.Store.FileSystem("images", {path: "~/Agency/ACA/.tmp"})]
});

if (Meteor.isServer) {
	Images.allow({
		insert: function() { return isLoggedIn() },
		update: function() { return isLoggedIn() },
		remove: function() { return isLoggedIn() }
	});

	Images.deny({
		insert: function() { return !isLoggedIn() },
		update: function() { return !isLoggedIn() },
		remove: function() { return !isLoggedIn() }
	});
}
