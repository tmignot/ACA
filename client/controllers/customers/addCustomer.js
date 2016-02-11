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
		data = {
			type: _.find($('#customer-type option'), function(c) {
				return $(c).is(':selected');
			}).value,
			name: t.find('.customer-name input').value,
			gender: _.find($('.gender option'), function(g) {
				return $(g).is(':selected');
			}).value,
			email: t.find('.customer-email input').value,
			phones: _.map(t.phonesInputs.get(), function(p) {
				if (p.label != '' && p.number != '')
					return {label: p.label, number: p.number};
			}),
			address: {
				streetNumber: t.find('.streetNumber input').value,
				numCompl: _.find($('.num-compl option'), function(o) {
					return $(o).is(':selected');
				}).value,
				streetName: t.find('.streetName input').value,
				complement: t.find('.complement input').value,
				zipcode: t.find('.zipcode input').value,
				city: t.find('.city input').value,
				country: t.find('.country input').value
			},
			earnings: parseInt(t.find('.customer-earnings input').value),
			contribution: parseInt(t.find('.customer-contribution input').value)
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
			_.each(ctx.invalidKeys(), function(k) {
				$('.customer-'+k.name).addClass('has-error');
			});
		} else {
			var c = Customers.insert(new_customer);
			Router.go('/admin/customers/'+c);
		}
	}
});
