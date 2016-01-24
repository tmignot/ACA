isLoggedIn = function() {
	if (Meteor.isServer)
		var u = this.userId;
	else
		var u = Meteor.user();
	return u ? true : false;
}
