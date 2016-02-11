Template.Customers.onCreated(function(){
});

Template.Customers.onRendered(function(){
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .customers-link').addClass('active');
});

Template.Customers.helpers({
});

Template.Customers.events({
	'click .addCustomer': function() { Router.go('/admin/customers/add'); }
});

Template.CustomerCard.onCreated(function(){
});

Template.CustomerCard.helpers({
	phone: function() {
		var c = Template.instance().data;
		if (c && c.phones && c.phones[0])
			return c.phones[0];
	},
	translateType: function() {
		switch (Template.instance().data.type) {
			case 'rent': return 'Locataire';
			case 'sell': return 'Vendeur/Bailleur';
			case 'search': return 'Acheteur';
			default: return '';
		}
	}
});

Template.CustomerCard.events({
	'click': function(e,t) {
		Router.go('/admin/customers/'+t.data._id);
	}
});

