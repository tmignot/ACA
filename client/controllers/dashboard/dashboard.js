Template.Dashboard.onRendered(function() {
	Meteor.call('gapiGetEventList', Meteor.user()._id, function(e,r) {
		console.log(r);
		$('#calendar').fullCalendar({
			events: _.map(r.result.items, function(item) {
				return({
					id: item.id,
					title: item.summary,
					start: item.start.date? item.start.date : item.start.dateTime,
					end: item.end.dateTime
				});
			})
		});
	});
});

Template.Dashboard.events({
	'click #dashboard_logout': function() {
		Meteor.logout();
	}
});
