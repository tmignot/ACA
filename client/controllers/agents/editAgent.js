Template.editAgent.helpers({
	collections: function() {
		return _.map(_.keys(Meteor.Collections), function(c) {
			return s(c).capitalize().value();
		});
	},
	permissions: function(c) {
		var u = Template.parentData()._id;
		var iir = Roles.userIsInRole;
		return [
			{name: 'list', hclass: iir(u, 'list', c) ? 'checked' : ''},
			{name: 'get', hclass: iir(u, 'get', c) ? 'checked' : ''},
			{name: 'insert', hclass: iir(u, 'insert', c) ? 'checked' : ''},
			{name: 'update', hclass: iir(u, 'update', c) ? 'checked' : ''},
			{name: 'remove', hclass: iir(u, 'remove', c) ? 'checked' : ''}
		];
	}
});

function updateRoles(uid, p, c, v) {
	console.log('updating '+p+' '+c+' '+v);
	if (v !== Roles.userIsInRole(uid, p, c)) {
		console.log('changing roles');
		Meteor.call('updateRoles', {
			uid: uid,
			method: p,
			collection: c
		});
	}
}


Template.editAgent.events({
	'click .edit-agent-submit': function(e,t) {
		var u, c, p, v;
		u = t.data._id;
		_.each(['Agents','Customers','Properties','Estimations','Editor','Meetings'],function(collection) {
			_.each(['list','get','insert','update','remove'], function(permission) {
				c = collection;	p = permission;
				v = $('.collec[data-collection="'+c+'"] input[data-perm="'+p+'"]').is(':checked');
				updateRoles(u, p, c, v);
			});
		});
	}
});		
