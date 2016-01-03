Template.addEstimation.onRendered(function() {
	$('.property-year-container').datepicker({
		format: "yyyy",
		startDate: "1900y",
		endDate: "+0y",
		startView: 2,
		minViewMode: 2,
		clearBtn: true,
		language: "fr",
		defaultViewDate: { year: 1970 }
	});

	var dpeges = new DpeGes();
	dpeges.dpe({
		domId: 'dpe',
		value: 1,
		shadow: true
	});
	dpeges.ges({
		domId: 'ges',
		value: 1,
		shadow: true
	});
});
