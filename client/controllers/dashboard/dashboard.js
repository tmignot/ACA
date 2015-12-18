Template.Dashboard.onRendered(function() {
	data = {
		timeMin: moment().subtract(1, 'month').toISOString()
	}
	console.log(data);
	Meteor.call('gapiGetEventList', Meteor.user()._id, data, function(e,r) {
		console.log(r);
		$('#calendar').fullCalendar({
			header: {
				left: 'title',
				center: 'month,agendaWeek,agendaDay',
				right: 'prev,today,next'
			},
			lang: 'fr',
			events: _.map(r.result.items, function(item) {
				return({
					id: item.id,
					title: item.summary,
					start: item.start.date? item.start.date : item.start.dateTime,
					end: item.end.dateTime
				});
			})
		});
		$("button.fc-button").removeClass('fc-button')
												 .removeClass('fc-state-default')
												 .addClass('btn');
	});
});
