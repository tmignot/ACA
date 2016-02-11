Images = new FS.Collection("images", {
	stores: [new FS.Store.FileSystem("images", {path: "~/Agency/ACA/.tmp"})]
});

Documents = new FS.Collection("documents", {
	stores: [new FS.Store.FileSystem("documents", {path: "~/Agency/ACA/.tmp-doc"})]
});

if (Meteor.isServer) {
	Images.allow({
		insert: function() { return Meteor.user() },
		update: function() { return Meteor.user() },
		remove: function() { return Meteor.user() },
		download: function() { return true }
	});

	Documents.allow({
		insert: function() { return true },
		update: function() { return Meteor.user() },
		remove: function() { return Meteor.user() },
		download: function() { return Meteor.user() }
	});

	Meteor.publish('adminImages', function(path) {
		switch (path) {
			case 'propertie':	return Images.find();
			default: return [];
		}
	});

	Meteor.publish('images', function() {
		return Images.find({
			_id: {
				$in: _.flatten(_.map(Properties.find({
					visible: true
				},
				{
					fields: {
						images: 1
					}
				}).fetch(), function(p) {
					return p.images;
				}))
			}
		});
	});
}
