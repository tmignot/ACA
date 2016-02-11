Template.propertyCard.helpers({
	img: function() {
		if (Template.instance().data.images) {
			var img_id = Template.instance().data.images[0];
			if (img_id) {
				var img = Images.findOne({_id: img_id});
				if (img)
					return img.url()
			}
		}
		return '/no_photo.png';
	}
});

Template.propertyCard.events({
	'click .property-card': function(e,t) {
		Router.go('/admin/properties/'+t.data._id);
	}
});
