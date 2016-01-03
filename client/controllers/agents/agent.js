Template.Agent.onRendered(function(){
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .agents-link').addClass('active');
});

Template.Agent.helpers({
	picture: function() {
		if (Template.instance().data.services.google) {
			return Template.instance().data.services.google.picture;
		} else {
			return '/user-default.png';
		}
	},
	email: function() {
		if (Template.instance().data.emails) {
			return Template.instance().data.emails[0].address;
		}
		return "(no email)"
	},
	name: function() {
		if (Template.instance().data.services.google) {
			return Template.instance().data.services.google.name;
		}
		return "(no name)"
	},
	collections: function() {
		return _.map(_.keys(Meteor.Collections), function(c) {
			return s(c).capitalize().value();
		});
	},
	permissions: function(c) {
		var u = Template.instance().data._id;
		var iir = Roles.userIsInRole;
		return [
			{name: 'list', hclass: iir(u, 'list', c) ? 'success' : 'danger'},
			{name: 'get', hclass: iir(u, 'get', c) ? 'success' : 'danger'},
			{name: 'insert', hclass: iir(u, 'insert', c) ? 'success' : 'danger'},
			{name: 'update', hclass: iir(u, 'update', c) ? 'success' : 'danger'},
			{name: 'remove', hclass: iir(u, 'remove', c) ? 'success' : 'danger'}
		];
	},
	roles: function() {
		var roles = Template.instance().data.roles;
		var ret = []
		_.each(_.keys(roles), function(collection) {
			ret.push({name: collection, permissions: roles[collection]});
		});
		return ret;
	},
	hasPermission: function(p, c) {
		var uid = Template.instance().data._id;
		return Roles.userIsInRole(uid, p, c);
	}
});

Template.Agent.events({
	'click .edit-btn': function(e,t) {
		Modal.show('editAgent', t.data);
	},
	'click .remove-btn': function(e,t) {
	}
});
