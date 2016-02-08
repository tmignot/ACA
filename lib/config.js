_ = lodash;
this.Pages = new Meteor.Pagination(Properties, {
	itemTemplate: 'annonceCard',
	navTemplate: 'pageNavig',
	perPage: 3,
	filters: {
		visible: true,
		estimation: false
	},
	availableSettings: {
		filters: function(filters) {
			return filters.visible == true && 
				filters.estimation == false
		}
	}
});
