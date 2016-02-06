Template.propertyCard.helpers({
	img: function() {
		if (Template.instance().data.images)
			return Images.findOne({_id: Template.instance().data.images[0]}).url()
		else
			return ['/no_photo.png'];
	}
});

Template.propertyCard.events({
	'click .property-card': function(e,t) {
		Router.go('/admin/properties/'+t.data._id);
	}
});
