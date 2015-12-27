Template.Meetings.onRendered(function(){
	$('.sidebar-nav li').removeClass('active');
	$('.sidebar-nav li.meetings').addClass('active');
	$('.datepicker').datetimepicker({step: 15});
});

Template.Meetings.events({
	'submit form': function(e, t){
		e.preventDefault();

		var opt = {
			uid: Meteor.user()._id,
			date: $('#inputDate_cal').val(),
			property: $('#inputProperty_cal').val(),
			agent: $('#inputAgent_cal').val(),
			description: $('#inputDesc_cal').val(),
			adresse: $('#inputAdress_cal').val(),
			buyer: $('#inputBuyer_cal').val()
		};

		console.log(opt.uid);
		console.log(opt.date);
		console.log(opt.property);
		console.log(opt.agent);
		console.log(opt.description);
		console.log(opt.adresse);
		console.log(opt.buyer);

		var res = Meteor.call('addMeetings', opt);

		console.log(res);
	}
});