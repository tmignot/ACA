isLoggedIn = function() {
	return (Meteor.userId() ? true : false);
}
