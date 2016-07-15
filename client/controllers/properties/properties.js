Template.Properties.onRendered(function() {
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .properties-link').addClass('active');
});

Template.Properties.helpers({
	properties: function() {
		return Properties.find();
	}
});

Template.Properties.events({
	'keyup .search-property input': function(e,t) {
		var query = e.currentTarget.value;
		if (!isNaN(parseInt(query)))
			query = parseInt(query);
		PropertyPages.set('filters', {estimation: false, $or: [
			{ownerInfo: {$regex: '.*'+query+'.*', $options: 'i'}},
			{reference: query},
			{price: query}
		]});
	}
});
