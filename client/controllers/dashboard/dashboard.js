Template.Dashboard.onRendered(function() {
	$('.side-nav li').removeClass('active');
	$('.side-nav li.dashboard').addClass('active');
	data = {
		timeMin: moment().subtract(1, 'month').toISOString()
	}
	Meteor.call('gapiGetEventList', Meteor.user()._id, data, function(e,r) {
		if (r) {
			if (r.error) {
				console.log(r.error);
				var hint = Meteor.user().emails[0].address;
				Meteor.loginWithGoogle({
					loginHint: hint,
					requestPermissions: ['email', 'https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly'],
				});
			} else {
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
			}
		}
	});
});
