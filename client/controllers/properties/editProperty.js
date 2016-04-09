Template.editProperty.onCreated(function() {
	var maps = {
		path: 'https://maps.googleapis.com/maps/api/staticmap?',
		params: {
			center: this.data.geocode,
			zoom: '17',
			size: '600x250',
			maptype: 'roadmap',
			markers: 'color:red%7C'+this.data.address.latitude+','+this.data.address.longitude,
			key: 'AIzaSyD4RgVp6VVGARHMw7snoozMIvUIaC198Ts'
		}
	};
	var url = maps.path;
	_.each(_.toPairs(maps.params), function(pair) {
		url = url + '&' + pair[0] + '=' + pair[1];
	});
	this.map = new ReactiveVar(url);
});

Template.editPropertie.onRendered(function(){
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .properties-link').addClass('active');
});

Template.editProperty.onRendered(function(){
	Session.set('geocode', 0);
	var date = $('.property-year-container').datepicker({
		format: "yyyy",
		startDate: "1900y",
		endDate: "+0y",
		startView: 2,
		minViewMode: 2,
		clearBtn: true,
		language: "fr",
		defaultViewDate: { year: 1970 }
	});
	this.dpeges = new DpeGes();
	this.dpeges.dpe({
		domId: 'dpe',
		value: this.data.dpe,
		shadow: true
	});
	this.dpeges.ges({
		domId: 'ges',
		value: this.data.ges,
		shadow: true
	});
	$('input[name="transactionType"][value="'+this.data.transactionType+'"]').prop('checked', true);
	$('input[name="garage"][value="'+this.data.garage+'"]').prop('checked', true);
	$('#propertyType option[value="'+this.data.propertyType+'"]').prop('selected', true);
	$('.address input').val(this.data.geocode);
	$('.full-address .streetNumber input').val(this.data.address.streetNumber);
	$('.full-address .num-compl option[value="'+this.data.address.numCompl+'"]').prop('selected', true);
	$('.full-address .streetName input').val(this.data.address.streetName);
	$('.full-address .complement input').val(this.data.address.complement);
	$('.full-address .zipcode input').val(this.data.address.zipcode);
	$('.full-address .city input').val(this.data.address.city);
	$('.full-address .country input').val(this.data.address.country);
	$('.living-surface input').val(this.data.livingRoomSurface);
	$('.total-surface input').val(this.data.totalSurface);
	$('.terrain-surface input').val(this.data.terrainSurface);
	$('.property-configuration input').val(this.data.configuration);
	$('.property-floors option[value="'+this.data.floorNumber+'"]').prop('selected', true);
	$('.property-rooms option[value="'+this.data.roomNumber+'"]').prop('selected', true);
	$('.property-bedrooms option[value="'+this.data.bedroomNumber+'"]').prop('selected', true);
	$('.property-bathrooms option[value="'+this.data.bathroomNumber+'"]').prop('selected', true);
	$('.property-closet option[value="'+this.data.closetNumber+'"]').prop('selected', true);
	$('.property-dependency option[value="'+this.data.dependencyNumber+'"]').prop('selected', true);
	$('.state option[value="'+this.data.state+'"]').prop('selected', true);
	$('.heating option[value="'+this.data.heating+'"]').prop('selected', true);
	$('.dpe input').val(this.data.dpe);
	$('.ges input').val(this.data.ges);
	$('.taxes input').val(this.data.taxes);
	$('.charges input').val(this.data.charges);
	$('.commission input').val(this.data.commission);
	$('.price input').val(this.data.price);
	$('.property-year-container').datepicker('update', new Date(this.data.year));
	$('.title input').val(this.data.title);
	$('.description textarea').val(this.data.description);
	$('.localInformations textarea').val(this.data.localInformations);
	$('input[name="visible"][value="'+this.data.visible+'"]').prop('checked', true);
	$('input[name="exclusive"][value="'+this.data.exclusive+'"]').prop('checked', true);
});

Template.editProperty.helpers({
	map: function() {
		return Template.instance().map.get();
	},
	img: function() {
		return Images.find({_id: {$in: Template.instance().data.images||[]}})
	},
	lstVal: function(cl) {
		return _.find(HomePage.findOne().lstVal, function(v) {
			return cl == v.cl;
		}).values;
	}
});

Template.editProperty.events({
	'click .search': function(e,t) {
		$('.images input').click();
	},
	'click .upload': function(e,t) {
		var file = $('#file').get(0).files[0];
		Images.insert(file, function(e,r) {
			if (r) {
				Properties.update({_id: t.data._id}, {
					$push: {images: r._id}
				});
			}
		});
	},	
	'change .images input': function(e,t) {
		$('.filename').html(_.last(e.currentTarget.value.split('\\')));
	},
	'change .dpe input': function(e,t) {
		t.dpeges.dpe({
			domId: 'dpe',
			value: parseInt(e.currentTarget.value),
			shadow: true
		});
	},
	'change .ges input': function(e,t) {
		t.dpeges.ges({
			domId: 'ges',
			value: parseInt(e.currentTarget.value),
			shadow: true
		});
	},
	'keyup .address input': function(e,t) {
		var addr = e.currentTarget.value;
		Session.set('geocode', Session.get('geocode') + 1);
		Meteor.setTimeout(function() {
			Session.set('geocode', Session.get('geocode') - 1);
			if (Session.get('geocode') == 0) {
				Meteor.call('geocode', addr, function(e,r) {
					if (r && r.length) {
						_.each([
							'streetNumber',
							'streetName',
							'zipcode',
							'country',
							'city'
						],function(attr) {
							$('.'+attr+' input').val(r[0][attr]);
						});
						var maps = {
							path: 'https://maps.googleapis.com/maps/api/staticmap?',
							params: {
								center: addr,
								zoom: '17',
								size: '600x250',
								maptype: 'roadmap',
								markers: 'color:red%7C'+r[0].latitude+','+r[0].longitude,
								key: 'AIzaSyD4RgVp6VVGARHMw7snoozMIvUIaC198Ts'
							}
						};
						var url = maps.path;
						_.each(_.toPairs(maps.params), function(pair) {
							url = url + '&' + pair[0] + '=' + pair[1];
						});
						t.map.set(url);
					}
				});
			}
		}, 1000);
	},
	'focusout input.to-check': function(e,t) {
		var attr = {};
		if ($(e.currentTarget).data('input')) {
			attr[$(e.currentTarget).data('input')] = parseInt(e.currentTarget.value);
			var ctx = PropertySchema.newContext();
			if (ctx.validateOne(attr, $(e.currentTarget).data('input'))) {
				$(e.currentTarget).parent().removeClass('has-error');
				$(e.currentTarget).parent().addClass('has-success');
			}	else {
				$(e.currentTarget).parent().removeClass('has-success');
				$(e.currentTarget).parent().addClass('has-error');
			}
		}
	},
	'submit form': function(e,t) {
		e.preventDefault();
		var address = {
			streetNumber: $('.full-address .streetNumber input').val(),
			numCompl: $('.full-address .num-compl').find('option:selected').val(),
			streetName: $('.full-address .streetName input').val(),
			complement: $('.full-address .complement input').val(),
			zipcode: $('.full-address .zipcode input').val(),
			city: $('.full-address .city input').val(),
			country: $('.full-address .country input').val()
		};
		var geocode = '';
		_.each(_.keys(address), function(k) {
			if (address[k] != '' && k != 'complement') {
				if (geocode == '')
					geocode = address[k];
				else
					geocode += ' ' + address[k];
			}
		});
		var data = {
			reference: t.data.reference,
			transactionType: $('.transaction-type input[value="Vente"]').is(':checked') ? 'Vente' : 'Location',
			propertyType: $('.property-type select').val(),
			geocode: geocode,
			address: address,
			year: parseInt($('.property-year-container span.year.active').html()),
			price: parseFloat($('.price input').val()),
			configuration: $('.property-configuration input').val(),
			floorNumber: $('.property-floors select').val(),
			roomNumber: $('.property-rooms select').val(),
			bedroomNumber: $('.property-bedrooms select').val(),
			bathroomNumber: $('.property-bathrooms select').val(),
			closetNumber: $('.property-closet select').val(),
			dependencyNumber: $('.property-dependency select').val(),
			livingRoomSurface: parseInt($('.living-surface input').val()),
			totalSurface: parseInt($('.total-surface input').val()),
			terrainSurface: parseInt($('.terrain-surface input').val()),
			state: $('.state select').val(),
			heating: $('.heating select').val(),
			garage: $('.garage input[value="true"]').is(':checked'),
			dpe: parseInt($('.dpe input').val()),
			ges: parseInt($('.ges input').val()),
			taxes: parseFloat($('.taxes input').val()),
			charges: parseFloat($('.charges input').val()),
			commission: parseFloat($('.commission input').val()),
			estimation: t.data.estimation,
			title: $('.title input').val(),
			description: $('.description textarea').val(),
			localInformations: $('.localInformations textarea').val(),
			visible: $('input[name="visible"][value="true"]').is(':checked'),
			exclusive: $('input[name="exclusive"][value="true"]').is(':checked')
		}
		console.log(data);
		var ctx = PropertySchema.newContext();
		if (ctx.validate(data)) {
			Properties.update({_id: t.data._id}, {$set: data}, function(e, r) {
				if (e) 
					console.log(e);
				else if (t.data.estimation)
					Router.go('/admin/estimations/'+t.data._id);
				else
					Router.go('/admin/properties/'+t.data._id);
			});
		}	else {
			$('.add-estimation-form input.to-check').parent().removeClass('has-error');
			$('.add-estimation-form input.to-check').parent().addClass('has-success');
			_.each(ctx.invalidKeys(), function(key) {
				var dom = $('.add-estimation-form input[data-input="'+key.name+'"]');
				if (dom.length) {
					dom.parent().removeClass('has-success');
					dom.parent().addClass('has-error');
				}
			});
			console.log(ctx.invalidKeys());
		}
	}
});
