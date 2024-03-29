Template.editProperty.onCreated(function() {
	if (!this.data)
		return;
	var self = this;
	this.marker = new ReactiveVar(0);
	this.images = [];
	_.each(this.data.images, function(img) {
		self.images.push(img);
	});
});

Template.editProperty.onRendered(function(){
	GoogleMaps.load({key: 'AIzaSyD4RgVp6VVGARHMw7snoozMIvUIaC198Ts'});
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .properties-link').addClass('active');
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
	$('.ownerInfo input').val(this.data.ownerInfo);
	$('.ownerPhone input').val(this.data.ownerPhone);
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
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
			var t = Template.instance();
			Meteor.call('geocode', Template.instance().data.geocode, function(e,r) {
				var d;
				if (r && r.length) {
					GoogleMaps.maps.adressMap.instance.setCenter(new google.maps.LatLng(r[0].latitude, r[0].longitude));
					var marker = t.marker.get();
					if (marker != 0)
						marker.setMap(null);
					marker = new google.maps.Marker({
						position: new google.maps.LatLng(r[0].latitude, r[0].longitude)
					});
					marker.setMap(GoogleMaps.maps.adressMap.instance);
					t.marker.set(marker);
				}
			});
			return {
				center: new google.maps.LatLng(0, 0),
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
	img: function() {
		var img = Images.find({_id: {$in: Template.instance().data.images}}).fetch();
		var arr = [];
		_.each(img, function(i) {
			arr.push(i.url());
		});
		return arr;
	},
	lstVal: function(cl) {
		return _.find(HomePage.findOne().lstVal, function(v) {
			return cl == v.cl;
		}).values;
	}
});

Template.editProperty.events({
	'click .remove-image': function(e,t) {
		Modal.show('confirmation', {
			type: 'danger',
			title: 'Êtes-vous sûr?',
			body: 'Attention, cette action est irreversible!',
			action: 'Supprimer',
			callback: function() {
				var imgID = t.data.images[Session.get('currentSlide')];
				Images.remove({_id: imgID}, function(e,r) {
					if (e)
						console.log(e);
					else {
						Properties.update({_id: t.data._id}, {$pull: {images: imgID}}, function(e,r) {
							if (e)
								console.log(e);
							else
								document.location.reload(true);
						});
					}
				});
			}
		});
	},
	'click .upload': function(e,t) {
		Modal.show('uploadImage', {id: t.data._id});
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
						GoogleMaps.maps.adressMap.instance.setCenter(new google.maps.LatLng(r[0].latitude, r[0].longitude));
						var marker = t.marker.get();
						if (marker != 0)
							marker.setMap(null);
						marker = new google.maps.Marker({
							position: new google.maps.LatLng(r[0].latitude, r[0].longitude)
						});
						marker.setMap(GoogleMaps.maps.adressMap.instance);
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
				if (geocode == '')
					geocode = address[k];
				else
					geocode += ' ' + address[k];
			}
		});
		var data = {
			ownerInfo: $('.ownerInfo input').val(),
			ownerPhone: $('.ownerPhone input').val(),
			reference: 0,
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
		data = _.mapValues(data, function(v,k) {
			var tmp = {};
			tmp[k] = v;
			if (!_.isNaN(v) && v !== '' && v !== 'Non renseigné')
				return v;
		});
		console.log(data);
		var ctx = PropertySchema.newContext();
		if (ctx.validate(data)) {
			_.unset(data, 'reference');
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
			_.each(ctx.invalidKeys(), function(key) {
				var dom = $('.add-estimation-form input[data-input="'+key.name+'"]');
				if (dom.length) {
					dom.parent().addClass('has-error');
				}
			});
			console.log(ctx.invalidKeys());
		}
	}
});

function getMaxSize(img, aspect) {
	var scale = 1;
	var iw = parseInt($(img).attr('width'));
	var ih = parseInt($(img).attr('height'))
	if (iw > $('#crop').width())
		scale = iw / $('#crop').width();
	console.log(scale);
	var w = iw / scale;
	var h = ih / scale;
	console.log(w,h);
	if (w > h) {
		if (w/h < aspect) {
			return {
				square: [0,0,h*aspect,h],
				scale: scale
			}
		}
	}
	// on prend x au max dans tous les cas
	return {
		square: [0,0,w,h/aspect],
		scale: scale
	}
};

Template.uploadImage.onCreated(function() {
	this.jcrop = undefined;
	this.img = undefined;
});

Template.uploadImage.events({
	'change input': function(e,t) {
		loadImage(e.currentTarget.files[0],
			function(img) {
				t.img = img;
				var jcrop = t.jcrop;
				if (jcrop) {
					jcrop.destroy();
					$('#crop')[0].appendChild(document.createElement('div'));
				}
				$('#crop div')[0].appendChild(img);
				$('#crop div').Jcrop({ 
					boxWidth: $('#crop').width(),
					setSelect: getMaxSize(img, 4/3).square,
					aspectRatio: 4/3,
					allowSelect: false
				}, function() {
					jcrop = this;
				});
				t.jcrop = jcrop;
			}, {});
	},
	'click .btn-primary': function(e,t,c) {
		var img = new FS.File(t.find('input').files[0]);
		var scale = getMaxSize(t.img, 4/3).scale;
		var square = t.jcrop.tellScaled();
		var x1 = _.ceil(square.x * scale),
				x2 = _.ceil(square.x2 * scale),
				y1 = _.ceil(square.y * scale),
				y2 = _.ceil(square.y2 * scale);
				
		img.croppingSquare = {
			width: x2 - x1,
			height: y2 - y1,
			x: x1, y: y1
		};
		console.log(img.croppingSquare);
		Images.insert(img, function(e,r) {
			if (e)
				console.log(e);
			if (r) {
				console.log(r);
				Properties.update({_id: t.data.id}, {
					$push: {images: r._id}
				});
				Modal.hide();
			}
		});
	}
});
