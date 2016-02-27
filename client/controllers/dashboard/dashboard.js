getEventList = function() {
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
					height: 'auto',
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
};

Template.Dashboard.onCreated(function() {
	moment.locale('fr');
});

Template.Dashboard.onRendered(function() {
	$('.nav-side-menu li').removeClass('active');
	$('.nav-side-menu .dashboard-link').addClass('active');
	$('#calendar').fullCalendar({
		header: {
			left: 'title',
			center: 'month,agendaWeek,agendaDay',
			right: 'prev,today,next'
		},
		defaultView: 'agendaWeek',
		height: 'auto',
		lang: 'fr',
		eventSources: [
			{
				events: function(start, end, timezone, callback) {
					callback(Meetings.find({
						from: {
							$gte: new Date(start),
							$lte: new Date(end)
						}
					}).fetch());
				},
				eventDataTransform: function(meeting) {
					data = {
						start: meeting.from,
						end: meeting.to,
						title: Customers.findOne({_id: meeting.customer}).name,
						meeting_id: meeting._id
					};
					if (!meeting.to)
						data.allDay = false;
					return data;
				}
			}
		],
		defaultTimedEventDuration: '00:30:00',
		firstDay: 1,
		minTime: '06:00:00',
		maxTime: '22:00:00',
	});
	Tracker.autorun(function() {
		var meetings = Meetings.find();
		$('#calendar').fullCalendar('refetchEvents');
	});
	$('#calendar button').addClass('btn btn-primary');
	$('#calendar .fc-button-group').addClass('btn-group');
});

Template.Dashboard.helpers({
	meetings: function() {
		moment.locale('en');
		var today = new Date(moment(new Date()).format('dddd DD MMMM YYYY'));
		var tomorow = new Date(moment(new Date()).add(1,'day').format('dddd DD MMMM YYYY'));
		moment.locale('fr');
		var m = Meetings.find({from: {$gte: today, $lte: tomorow}}, {sort: {from: 1}});
		if (m.count())
			return m;
	},
	relativeTime: function(from) {
		return moment(from).fromNow();
	},
	relativeRTime: function(from, to) {
		if (to)
			return ', ' + moment(from).to(to, true);
	},
	customerGender: function(c) {
		var customer = Customers.findOne({_id: c});
		if (customer && customer.gender) {
			if (customer.gender == 'female')
				return 'Mme'
		}
		return 'Mr';
	},
	customerName: function(c) {
		var customer = Customers.findOne({_id: c});
		if (customer && customer.name)
			return customer.name;
		return '(pas de nom?)';
	},
	type: function(c) {
		var customer = Customers.findOne({_id: c});
		if (customer && customer.type)
			return customer.type;
	}
});
