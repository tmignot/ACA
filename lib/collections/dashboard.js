if (Meteor.isServer) {
	Meteor.publish('dashboard', function() {
		if (this.userId)
			return [
				Meetings.find(),
				Customers.find(),
				Agents.find()
			];
		return [];
	});
}
