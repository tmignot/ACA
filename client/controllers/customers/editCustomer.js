Template.editCustomer.onRendered(function(){
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .customers-link').addClass('active');
});

Template.editCustomer.onCreated(function(){
	var phones = [];
	_.each(this.data.phones, function(p, i) {
		phones.push({n: i, label: p.label, number: p.number});
	});
	if (phones.length < 1)
		phones.push({n:0, label: '', number: ''});
	this.phonesInputs = new ReactiveVar(phones);
});

Template.editCustomer.helpers({
	phonesInputs: function() {
		return Template.instance().phonesInputs.get();
	},
	isSelected: function(t, v) {
		var d = Template.instance().data;
		if (d[t] == v)
			return 'selected'
	}
});

Template.editCustomer.events({
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
			console.log(p);
			if (p[1] && p[1] != '')
				new_customer[p[0]] = p[1];
		});
		console.log(data);
		var ctx = CustomerSchema.newContext();
		$('.add-customer-container div').removeClass('has-error');
		if (!ctx.validate(data)) {
			_.each(ctx.invalidKeys(), function(k) {
				$('.customer-'+k.name).addClass('has-error');
			});
		} else {
			Customers.update({_id: t.data._id}, {$set: data});
			Router.go('/admin/customers/'+t.data._id);
		}
	}
});
