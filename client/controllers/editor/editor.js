Template.Editor.onCreated(function() {
	var hp = HomePage.findOne();
	this.lstVal
	this.lstVal = new ReactiveVar({
		nPieces: hp.lstVal[0].values.length,
		nState: hp.lstVal[1].values.length,
		nHeating: hp.lstVal[2].values.length,
		nCustomerType: hp.lstVal[3].values.length,
		nCities: hp.lstVal[4].values.length
	});
});

Template.Editor.onRendered(function() {
	$('.nav-side-menu li').removeClass('active');
	$('.nav-side-menu .editor-link').addClass('active');
});

Template.Editor.helpers({
	blockKeys: function() {
		return _.map(_.toPairs(HomePage.findOne().blocks), function(p) {
			return { key: p[0], label: p[1].label, value: p[1].value }
		});
	},
	lstVal: function() {
		return HomePage.findOne().lstVal;
	},
	nValues: function(lstVal) {
		var n = lstVal.values.length;
		var lv = Template.instance().lstVal.get();
		if (lv[lstVal.cl] > lstVal.values.length)
			lstVal.values.push('');
		else if (lv[lstVal.cl] < lstVal.values.length)
			lstVal.values.splice(lstVal.values.length -1, 1);
		else
			return lstVal.values;
		lv[lstVal.cl] = lstVal.values.length;
		Template.instance().lstVal.set(lv);
		console.log(lv);
		return lstVal.values;
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
		lstVal = t.data.lstVal;
		_.each(lstVal, function(val, i) {
			val.values = _.compact(
				_.map($('.' + val.cl + ' input'), function(v) {
					return v.value;
				})
			);
		});
		console.log(lstVal);
		HomePage.update({_id: t.data._id}, {$set: {blocks: blocks, lstVal: lstVal}});
	},
	'click button.remove': function(e,t) {
		var lv = t.lstVal.get();
		if ($(e.currentTarget).hasClass('nPieces'))
			lv.nPieces -= 1;
		if ($(e.currentTarget).hasClass('nState'))
			lv.nState -= 1;
		if ($(e.currentTarget).hasClass('nHeating'))
			lv.nHeating -= 1;
		if ($(e.currentTarget).hasClass('nCustomerType'))
			lv.nCustomerType -= 1;
		if ($(e.currentTarget).hasClass('nCities'))
			lv.nCities -= 1;
		t.lstVal.set(lv);
	},
	'click button.add': function(e,t) {
		var lv = t.lstVal.get();
		if ($(e.currentTarget).hasClass('nPieces'))
			lv.nPieces += 1;
		if ($(e.currentTarget).hasClass('nState'))
			lv.nState += 1;
		if ($(e.currentTarget).hasClass('nHeating'))
			lv.nHeating += 1;
		if ($(e.currentTarget).hasClass('nCustomerType'))
			lv.nCustomerType += 1;
		if ($(e.currentTarget).hasClass('nCities'))
			lv.nCities += 1;
		t.lstVal.set(lv);
	},
});
