Template.Properties.onCreated(function(){
	Session.set('whichOne', true);
});

Template.Properties.onRendered(function() {
	$('.side-nav li').removeClass('active');
	$('.side-nav li.properties').addClass('active');
	$('select').material_select();
});

Template.Properties.helpers({
	properties: function() {
		return Properties.find();
	},
	whichOne: function () {
		return Session.get('whichOne') ? Template.listProperty : Template.addProperty;
	}
});

Template.Properties.events({
	'click #addProperty': function() {
		Session.set('whichOne', false);
	},
	'click #listProperty': function() {
		Session.set('whichOne', true);
	}
});
