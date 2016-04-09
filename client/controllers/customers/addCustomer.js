Template.addCustomer.onCreated(function() {
	this.phonesInputs = new ReactiveVar([{n:0, label: '', number: ''}]);
});

Template.addCustomer.onRendered(function(){
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .customers-link').addClass('active');
});

Template.addCustomer.helpers({
	phonesInputs: function() {
		return Template.instance().phonesInputs.get();
	},
	lstVal: function(v) {
		return _.find(HomePage.findOne().lstVal, function(l) {
			return l.cl == v;
		}).values;
	}
});

Template.addCustomer.events({
	'click .add.btn': function(e,t) {
		var phones = t.phonesInputs.get();
		phones.push({m: phones.length, label: '', number: ''});
		t.phonesInputs.set(phones);
	},
	'click .remove.btn': function(e,t) {
		var phones = t.phonesInputs.get();
		if (phones.length > 1) {
			phones.splice(phones.length - 1, 1);
			t.phonesInputs.set(phones);
		}
	},
	'submit form': function(e,t) {
		e.preventDefault();
		var phones = [];
		$('.phone-container').each(function(i, p) {
			var label = $(p).find('input[type="text"]').val();
			var number = $(p).find('input[type="phone"]').val();
			if (label != '' && number != '')
				phones.push({label: label, number: number});
		});
		data = {
			type: _.find($('#customer-type option'), function(c) {
				return $(c).is(':selected');
			}).value,
			name: t.find('.customer-name input').value,
			gender: _.find($('.gender option'), function(g) {
				return $(g).is(':selected');
			}).value,
			email: t.find('.customer-email input').value,
			phones: phones,
			earnings: parseInt(t.find('.customer-earnings input').value),
			contribution: parseInt(t.find('.customer-contribution input').value),
			budget: parseInt(t.find('.customer-budget input').value),
			wish: {
				propertyType: $('.propertyType select').val(),
				bedroomNumber: $('.bedroomNumber select').val(),
				totalSurface: parseInt($('.total-surface input').val()) || 0,
				city: $('.city input').val()
			}
		};
		var new_customer = {};
		_.each(_.toPairs(data), function(p) {
			if (p[1] && p[1] != '')
				new_customer[p[0]] = p[1];
		});
		console.log(new_customer);
		var ctx = CustomerSchema.newContext();
		$('.add-customer-container div').removeClass('has-error');
		if (!ctx.validate(new_customer)) {
			console.log(ctx.invalidKeys());
			_.each(ctx.invalidKeys(), function(k) {
				$('.customer-'+k.name).addClass('has-error');
			});
		} else {
			var c = Customers.insert(new_customer);
			Router.go('/admin/customers/'+c);
		}
	}
});
