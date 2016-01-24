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
	_.each(_.pairs(maps.params), function(pair) {
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
	console.log(this.data);
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
	$('.property-floors input').val(this.data.floorNumber);
	$('.property-rooms input').val(this.data.roomNumber);
	$('.property-bedrooms input').val(this.data.bedroomNumber);
	$('.property-bathrooms input').val(this.data.bathroomNumber);
	$('.property-closet input').val(this.data.closetNumber);
	$('.property-dependency input').val(this.data.dependencyNumber);
	$('.state input').val(this.data.state);
	$('.heating input').val(this.data.heating);
	$('.dpe input').val(this.data.dpe);
	$('.ges input').val(this.data.ges);
	$('.taxes input').val(this.data.taxes);
	$('.charges input').val(this.data.charges);
	$('.commission input').val(this.data.commission);
	$('.price input').val(this.data.price);
	$('.property-year-container').datepicker('update', new Date(this.data.year));
});

Template.editProperty.helpers({
	map: function() {
		return Template.instance().map.get();
	},
	img: function() {
		return Images.find({_id: {$in: Template.instance().data.images}})
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
				Properties.update({_id: Properties.findOne()._id}, {
					$push: {images: r._id}
				});
			}
		});
	},	
	'change input': function(e,t) {
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
						_.each(_.pairs(maps.params), function(pair) {
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
				console.log(k, address[k])
				if (geocode == '')
					geocode = address[k];
				else
					geocode += ' ' + address[k];
			}
		});
		console.log(address, geocode);
		var data = {
			reference: t.data.reference,
			transactionType: $('.transaction-type input[value="Vente"]').is(':checked') ? 'Vente' : 'Location',
			propertyType: $('.property-type option[selected]').val(),
			geocode: geocode,
			address: address,
			year: parseInt($('.property-year-container span.year.active').html()),
			price: parseFloat($('.price input').val()),
			roomNumber: parseInt($('.property-rooms input').val()),
			bedroomNumber: parseInt($('.property-bedrooms input').val()),
			bathroomNumber: parseInt($('.property-bathrooms input').val()),
			closetNumber: parseInt($('.property-closet input').val()),
			floorNumber: parseInt($('.property-floors input').val()),
			livingRoomSurface: parseInt($('.living-surface input').val()),
			totalSurface: parseInt($('.total-surface input').val()),
			terrainSurface: parseInt($('.terrain-surface input').val()),
			state: $('.state input').val(),
			heating: $('.heating input').val(),
			garage: $('.garage input[value="true"]').is(':checked'),
			dependencyNumber: parseInt($('.property-dependency input').val()),
			dpe: parseInt($('.dpe input').val()),
			ges: parseInt($('.ges input').val()),
			taxes: parseFloat($('.taxes input').val()),
			charges: parseFloat($('.charges input').val()),
			commission: parseFloat($('.commission input').val()),
			exclusive: true,
			visible: false,
			estimation: true
		}
		var ctx = PropertySchema.newContext();
		if (ctx.validate(data)) {
			Properties.update({_id: t.data._id}, {$set: data}, function(e, r) {
				if (e) 
					console.log(e);
				else
					Router.go('/admin/estimations/'+t.data._id);
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
