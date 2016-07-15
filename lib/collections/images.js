var cropAndResize = function(fileObj, readStream, writeStream) {
	console.log(fileObj.croppingSquare);
	gm(readStream, fileObj.name())
		.crop(
			fileObj.croppingSquare.width,
			fileObj.croppingSquare.height,
			fileObj.croppingSquare.x,
			fileObj.croppingSquare.y)
		.resize(1024)
		.stream().pipe(writeStream);
};

Images = new FS.Collection("images", {
	stores: [new FS.Store.FileSystem("images", {
		path: "~/Agency/ACA/.tmp",
		transformWrite: cropAndResize
	})]
});

Documents = new FS.Collection("documents", {
	stores: [new FS.Store.FileSystem("documents", {path: "~/Agency/ACA/.tmp-doc"})]
});

if (Meteor.isServer) {
	Images.allow({
		insert: function(uid) { return uid },
		update: function(uid) { return uid },
		remove: function(uid) { return uid },
		download: function() { return true }
	});

	Documents.allow({
		insert: function(uid) { return uid },
		update: function(uid) { return uid },
		remove: function(uid) { return uid },
		download: function(uid) { return uid }
	});

	Meteor.publish('adminImages', function(path) {
		switch (path) {
			case 'propertie':	return Images.find();
			case 'estimation':	return Images.find();
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
