Template.addEstimation.onCreated(function() {
	this.marker = new ReactiveVar(0);
});

Template.addEstimation.onRendered(function() {
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .estimations-link').addClass('active');
	GoogleMaps.load();
	Session.set('geocode', 0);

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

	this.dpeges = new DpeGes();
	this.dpeges.dpe({
		domId: 'dpe',
		value: 1,
		shadow: true
	});
	this.dpeges.ges({
		domId: 'ges',
		value: 1,
		shadow: true
	});
});

Template.addEstimation.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
				center: new google.maps.LatLng(48.9152408, 2.579193),
				zoom: 14,
				zoomControl: true,
				mapTypeControl: true,
				scaleControl: true,
				streetViewControl: true,
				rotateControl: true,
				fullscreenControl: true
      };
    }
  },
	lstVal: function(cl) {
		return _.find(HomePage.findOne().lstVal, function(v) {
			return cl == v.cl;
		}).values;
	}
});

Template.addEstimation.events({
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
						console.log(r[0]);
						_.each([
							'streetNumber',
							'streetName',
							'zipcode',
							'country',
							'city'
						],function(attr) {
							$('.'+attr+' input').val(r[0][attr]);
						});
						GoogleMaps.maps.addressMap.instance.setCenter(new google.maps.LatLng(r[0].latitude, r[0].longitude));
						var marker = t.marker.get();
						if (marker != 0)
							marker.setMap(null);
						marker = new google.maps.Marker({
							position: new google.maps.LatLng(r[0].latitude, r[0].longitude)
						});
						marker.setMap(GoogleMaps.maps.addressMap.instance);
						t.marker.set(marker);
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
				console.log(k, address[k])
				if (geocode == '')
					geocode = address[k];
				else
					geocode += ' ' + address[k];
			}
		});
		var data = {
			reference: ShortId.generate(),
			transactionType: $('.transaction-type input[value="Vente"]').is(':checked') ? 'Vente' : 'Location',
			propertyType: $('.property-type option[selected]').val(),
			geocode: geocode,
			address: address,
			year: parseInt($('.property-year-container span.year.active').html()) || 1970,
			price: parseFloat($('.price input').val()) || 0,
			floorNumber: $('.property-floors select').val(),
			roomNumber: $('.property-rooms select').val(),
			bedroomNumber: $('.property-bedrooms select').val(),
			bathroomNumber: $('.property-bathrooms select').val(),
			closetNumber: $('.property-closet select').val(),
			dependencyNumber: $('.property-dependency select').val(),
			livingRoomSurface: parseInt($('.living-surface input').val()) || 0,
			totalSurface: parseInt($('.total-surface input').val()) || 0,
			terrainSurface: parseInt($('.terrain-surface input').val()) || 0,
			state: $('.state select').val(),
			heating: $('.heating select').val(),
			garage: $('.garage input[value="true"]').is(':checked'),
			dpe: parseInt($('.dpe input').val()),
			ges: parseInt($('.ges input').val()),
			taxes: parseFloat($('.taxes input').val()) || 0,
			charges: parseFloat($('.charges input').val()) || 0,
			commission: parseFloat($('.commission input').val()) || 0,
			exclusive: true,
			visible: false,
			estimation: true
		}
		var ctx = PropertySchema.newContext();
		if (ctx.validate(data)) {
			Properties.insert(data, function(e, r) {
				if (e) 
					console.log(e);
				else
					Router.go('/admin/estimations/'+r);
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

