Template.layoutDashboard.helpers({
	picture: function() {
		var currentUser = Meteor.users.findOne();
		if (currentUser
			&& currentUser.services 
			&& currentUser.services.google
			&& currentUser.services.google.picture)
			return currentUser.services.google.picture;
		else
			return '/user-default.png';
	}
});

Template.layoutDashboard.events({
'click .dashboard-link':	function(e,t) { 
	e.preventDefault();
	Router.go('/admin/dashboard');
},
'click .customers-link':	function(e,t) {
	e.preventDefault();
	Router.go('/admin/customers');
},
'click .estimations-link':	function(e,t) {
	e.preventDefault();
	Router.go('/admin/estimations');
},
'click .properties-link':	function(e,t) {
	e.preventDefault();
	Router.go('/admin/properties');
},
'click .agents-link':	function(e,t) {
	e.preventDefault();
	Router.go('/admin/agents');
},
'click .editor-link':	function(e,t) {
	e.preventDefault();
	Router.go('/admin/editor');
}
});
