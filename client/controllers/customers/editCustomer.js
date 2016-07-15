Template.editCustomer.onRendered(function(){
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .customers-link').addClass('active');
	$('.propertyType option[value="'+this.data.wish.propertyType+'"]').prop('selected', true);
	$('.bedroomNumber option[value="'+this.data.wish.bedroomNumber+'"]').prop('selected', true);
	_.each(this.data.wish.city, function(c, i) {
		$('.city-container[data-which-city='+i+'] option[value="'+c+'"]').prop('selected', true);
	});
});

Template.editCustomer.onCreated(function(){
	var phones = [], cities = [];
	_.each(this.data.phones, function(p, i) {
		phones.push({n: i, label: p.label, number: p.number});
	});
	if (phones.length < 1)
		phones.push({n:0, label: '', number: ''});
	this.phonesInputs = new ReactiveVar(phones);

	_.each(this.data.wish.city, function(c, i) {
		cities.push({n: i, name: c.name});
	});
	if (cities.length < 1)
		cities.push({n:0, name: ''});
	this.citiesInputs = new ReactiveVar(cities);
});

Template.editCustomer.helpers({
	phonesInputs: function() {
		return Template.instance().phonesInputs.get();
	},
	citiesInputs: function() {
		return Template.instance().citiesInputs.get();
	},
	isSelected: function(t, v) {
		var d = Template.instance().data;
		if (d[t] == v)
			return 'selected'
	},
	lstVal: function(cl) {
		return _.find(HomePage.findOne().lstVal, function(v) {
			return cl == v.cl;
		}).values;
	}
});

Template.editCustomer.events({
	'click .add-remove-phone .add.btn': function(e,t) {
		var phones = t.phonesInputs.get();
		phones.push({m: phones.length, label: '', number: ''});
		t.phonesInputs.set(phones);
	},
	'click .add-remove-phone .remove.btn': function(e,t) {
		var phones = t.phonesInputs.get();
		if (phones.length > 1) {
			phones.splice(phones.length - 1, 1);
			t.phonesInputs.set(phones);
		}
	},
	'click .add-remove-city .add.btn': function(e,t) {
		var cities = t.citiesInputs.get();
		cities.push({m: cities.length, label: '', number: ''});
		t.citiesInputs.set(cities);
	},
	'click .add-remove-city .remove.btn': function(e,t) {
		var cities = t.citiesInputs.get();
		if (cities.length > 1) {
			cities.splice(cities.length - 1, 1);
			t.citiesInputs.set(cities);
		}
	},
	'submit form': function(e,t) {
		e.preventDefault();
	},
	'click .submit button': function(e,t) {
		var phones = [], cities = [];
		$('.phone-container').each(function(i, p) {
			var label = $(p).find('input[type="text"]').val();
			var number = $(p).find('input[type="phone"]').val();
			if (label != '' && number != '')
				phones.push({label: label, number: number});
		});
		$('.city-container').each(function(i, p) {
			var name = $(p).find('select').val();
			if (name != '')
				cities.push(name);
		});
		data = {
			type: _.find($('#customer-type option'), function(c) {
				return $(c).is(':selected');
			}).value,
			name: t.find('.customer-name input').value,
			gender: _.find($('.gender option'), function(g) {
				return $(g).is(':selected');
			}).value,
			email: t.find('.customer-email input').value|| undefined,
			phones: phones,
			wish: {
				propertyType: $('.propertyType select').val(),
				bedroomNumber: $('.bedroomNumber select').val(),
				totalSurface: parseInt($('.totalSurface input').val()) || 0,
				city: cities
			},
			earnings: parseInt(t.find('.customer-earnings input').value),
			contribution: parseInt(t.find('.customer-contribution input').value),
			budget: parseInt(t.find('.customer-budget input').value)
		};
		var new_customer = {};
		_.each(_.toPairs(data), function(p) {
			console.log(p);
			if (p[1] && p[1] != '')
				new_customer[p[0]] = p[1];
		});
		console.log(data);
		var ctx = CustomerSchema.newContext();
		$('.add-customer-container div').removeClass('has-error');
		if (!ctx.validate(data)) {
			console.log(ctx.invalidKeys());
			_.each(ctx.invalidKeys(), function(k) {
				$('.customer-'+k.name).addClass('has-error');
			});
		} else {
			Customers.update({_id: t.data._id}, {$set: data});
			Router.go('/admin/customers/'+t.data._id);
		}
	}
});
