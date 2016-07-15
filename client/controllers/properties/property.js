Template.Property.onCreated(function(){
	var self = this;
	this.type = this.data.estimation ? 'estimations' : 'properties';
	this.images = [];
	_.each(this.data.images, function(img) {
		self.images.push(img);
	});
	Meteor.call('geocode', self.data.geocode, function(e,r) {
		if (r && r.length) {
			if (GoogleMaps.loaded()) {
				GoogleMaps.maps.addressMap.instance.setCenter(new google.maps.LatLng(r[0].latitude, r[0].longitude));
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(r[0].latitude, r[0].longitude)
				});
				marker.setMap(GoogleMaps.maps.addressMap.instance);
			}
		}
	});
});

Template.Property.onRendered(function(){
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .properties-link').addClass('active');
	GoogleMaps.load({key: 'AIzaSyD4RgVp6VVGARHMw7snoozMIvUIaC198Ts'});
	this.dpeges = new DpeGes();
	this.dpeges.dpe({
		domId: 'dpe',
		value: this.data.dpe,
		shadow: true,
	});
	this.dpeges.ges({
		domId: 'ges',
		value: this.data.ges,
		shadow: true,
	});
	$('#carousel').slick({
		centerMode: true,
		dots: true,
		infinite: true,
		speed: 300,
		slidesToShow: 1,
		adaptiveHeight: true
	});
});

Template.Property.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
				center: new google.maps.LatLng(.9152408, 2.579193),
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
		var img = Images.find({_id: {$in: Template.instance().images}}).fetch();
		var arr = [];
		_.each(img, function(i) {
			arr.push(i.url());
		});
		return arr;
	}
});

Template.Property.events({
	'click .transfer-btn': function(e,t) {
		if (t.type == 'estimations' &&
				Roles.userIsInRole(Meteor.user()._id, 'insert', 'Properties'))
		{
			Modal.show('mandatModal', t.data);
		}
	},
	'click .edit-btn': function(e,t) {
		Router.go('/admin/'+t.type+'/edit/'+t.data._id);
	},
	'click .remove-btn': function(e,t) {
		if (t.data.estimation) {
			if (Roles.userIsInRole(Meteor.user()._id, 'remove', 'Estimations')) {
				Modal.show('confirmation', {
					type: 'danger',
					title: 'Êtes-vous sûr?',
					body: 'Attention, cette action est irreversible!',
					action: 'Supprimer',
					callback: function() {
						Properties.remove({_id: t.data._id});
						Router.go('/admin/estimations/');
					}
				});
			}
		} else {
			if (Roles.userIsInRole(Meteor.user()._id, 'remove', 'Properties')) {
				Modal.show('confirmation', {
					type: 'warning',
					title: 'Êtes-vous sûr?',
					body: "Le mandat sera supprimé, mais l'estimation originale persistera.",
					action: 'Supprimer',
					callback: function() {
						Properties.update({_id: t.data._id}, {$set: {estimation: true, reference: null}});
						Router.go('/admin/estimations/' + t.data._id);
					}
				});
			}
		}
	}
});

Template.mandatModal.events({
	'submit form': function(e,t) {
		e.preventDefault();
		e.stopPropagation();
		$('.modal button.valid').click();
	},
	'click button.valid': function(e,t) {
		$(t.find('form .reference')).removeClass('has-error');
		var data = t.data;
		data.estimation = false;
		data.reference = _.parseInt($('input.reference-input').val());
		console.log(data);
		var ctx = PropertySchema.newContext();
		if (ctx.validateOne(data, 'reference')) {
			Properties.update({_id: data._id}, {$set: {estimation: false, reference: data.reference}}, function(e,r) {
				console.log(e, r);
				if (e) {
					$(t.find('form .reference')).addClass('has-error');
				} else {
					Modal.hide();
					Router.go('/admin/properties/'+data._id);
				}
			});
		} else {
			console.log(ctx.invalidKeys());
			$(t.find('form .reference')).addClass('has-error');
		}
	}
});
