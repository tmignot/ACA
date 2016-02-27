Template.Editor.onRendered(function() {
	$('.nav-side-menu li').removeClass('active');
	$('.nav-side-menu .editor-link').addClass('active');
});

Template.Editor.helpers({
	blockKeys: function() {
		return _.map(_.toPairs(HomePage.findOne().blocks), function(p) {
			return { key: p[0], label: p[1].label, value: p[1].value }
		});
	}
});

Template.Editor.events({
	'submit form': function(e,t) {
		e.preventDefault();
		var blocks = {};
		$('.block-input').each(function(i, b) {
			blocks[$(b).data('key')] = {
				label: $(b).data('label'),
				value: $(b).val()
			};
		});
		blocks.agency_timetable = {};
		$('.agency_timetable input').each(function(i, t) {
			if (!blocks.agency_timetable[$(t).data('day')])
				blocks.agency_timetable[$(t).data('day')] = {};
			blocks.agency_timetable[$(t).data('day')][$(t).data('time')] = $(t).val();
		});
		HomePage.update({_id: t.data._id}, {$set: {blocks: blocks}});
	}
});
