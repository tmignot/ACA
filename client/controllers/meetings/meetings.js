Template.Meetings.onRendered(function(){
	$('.side-nav li').removeClass('active');
	$('.side-nav li.meetings').addClass('active');
	$('.datepicker').datetimepicker({step: 15, inline: true});
});
