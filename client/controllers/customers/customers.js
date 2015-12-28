Template.Customers.onRendered(function(){
	$('.side-nav li').removeClass('active');
	$('.side-nav li.customers').addClass('active');
	$('.collapsible').collapsible({
		accordion : false
	});
});

Template.Customers.onCreated(function(){
	this.searchList = new ReactiveVar([]);
	Template.instance().searchList.set(Customers.find({}));
});

Template.Customers.helpers({
	searchList: function(){
		return Template.instance().searchList.get();
	}
});

Template.Customers.events({
	'click button.addCustomer': function(e, t) {
		$("#addCustomer").openModal();
	},
	'keyup #search': function(e, t){
		if ($(e.target).val() != '') {
			query = new RegExp($(e.target).val(), 'i');
			list = Customers.find({ name: query }).fetch();
		} else {
			list = Customers.find({});
		}
		t.searchList.set(list);
	}
});

Template.Customer.events({
	'click button': function(e,t) {
		Session.set('currentCustomer', t.data);
	}
});

Template.addCustomer.onCreated(function() {
	this.nPhones = new ReactiveVar(['Portable', 'Domicile']);
});

Template.addCustomer.helpers({
	phoneInputs: function() {
		return Template.instance().nPhones.get();
	}
});

Template.addCustomer.events({
	'keydown .newPhoneLabel': function(e,t) {
		if (e.keyCode == 13) {
			e.preventDefault();
			e.stopPropagation();
			$('.insert .addPhone').click();
		}
	},
	'click .addPhone': function(e,t) {
		e.preventDefault();
		e.stopPropagation();
		var p = t.nPhones.get();
		var v = $('.insert .newPhoneLabel').val();
		if (v !== '') {
			if (p.indexOf(v) < 0) {
				p.push(v);
				t.nPhones.set(p);
			}
		}
	},
	'submit form': function(e,t) {
		e.preventDefault();
		var f = e.currentTarget;
		var name = f.inputName.value;
		var gender = $('input[name="gender"]:checked').val();
		var phones = [];
		var contrib = f.inputContrib.value || 0;
		var earnings = f.inputEarning.value || 0;
		var isOwner = $(f.inputOwner).is(':checked');
		_.each(t.nPhones.get(), function(item) {
			var num = $('input[data-plabel="'+item+'"]').val();
			if (num !== '')
				phones.push({label: item, number: num});
		});
		Customers.insert({
			name: name,
			gender: gender,
			phones: phones,
			contribution: contrib,
			earnings: earnings,
			isOwner: isOwner
		}, function(e,r) {
			if (e)
				console.log(e);
			console.log(r);
		});

		console.log(name, gender, phones, contrib, earnings, isOwner);
	}
});

Template.editCustomer.onCreated(function() {
	var p = [];
	if (this.data) {
		_.each(this.data.phones, function(item) {
			p.push(item.label);
		});
	}
	this.nPhones = new ReactiveVar(p);
	this.current = new ReactiveVar(this.data._id);
	console.log('created');
});

Template.editCustomer.helpers({
	nPhones: function() {
		if (Template.instance().current !== Session.get('currentCustomer')._id) {
			console.log('remake');
			var p = [];
			_.each(Template.instance().data.phones, function(item) {
				p.push(item.label);
			});
			Template.instance().nPhones.set(p);
			Template.instance().current = Session.get('currentCustomer')._id;
		}
		console.log('nPhone', Template.instance().nPhones.get());
		return Template.instance().nPhones.get();
	},
	getPhone: function(label) {
		var c = Customers.findOne(Session.get('currentCustomer')).phones;
		var p = _.where(c, {label: label})[0];
		if (p)
			return p.number;
	},
	isMale: function() {
		return Template.instance().data.gender == 'male'
	}
});

Template.editCustomer.events({
	'keydown .newPhoneLabel': function(e,t) {
		if (e.keyCode == 13) {
			e.preventDefault();
			e.stopPropagation();
			$('.edit .addPhone').click();
		}
	},
	'click .addPhone': function(e,t) {
		e.preventDefault();
		e.stopPropagation();
		var p = t.nPhones.get();
		var v = $('.edit .newPhoneLabel').val();
		if (v !== '') {
			console.log(v);
			if (p.indexOf(v) < 0) {
				console.log('adding '+v);
				p.push(v);
				t.nPhones.set(p);
				console.log(p);
				console.log(t.nPhones.get());
			}
		}
	}
});
