Template.Agent.onRendered(function() {
	if ($('.grid').data('isotope')) {
		$('.grid').isotope('insert', this.find('.grid-item'));
	}
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
	}
});

Template.Agent.events({
	'click .usercard': function(e,t) {
		if ($(e.currentTarget).hasClass('grow')) {
			$(e.currentTarget).removeClass('grow');
			$(e.currentTarget).addClass('shrink');
		} else if ($(e.currentTarget).hasClass('shrink')){
			$(e.currentTarget).removeClass('shrink');
			$(e.currentTarget).addClass('grow');
		} else {
			$(e.currentTarget).addClass('shrink');
		}
	},
	'click .button-container span': function(e,t) {
		e.stopPropagation();
		Session.set('editUid', t.data._id);
		$($(e.currentTarget).data('func')).openModal();
	}		
});

Template.Agents.onRendered(function(){
	$('.sidebar-nav li').removeClass('active');
	$('.sidebar-nav li.agents').addClass('active');
	this.grid = $('.grid').isotope({
		itemSelector: '.grid-item',
		getSortData: {
			group: function(elem) {
				if ($(elem).hasClass('usercard')) {
					return '0_usercard';
				} else {
					return '1_footer';
				}
			}
		},
		sortBy: ['group']
	});
});

Template.Agents.helpers({
	agents: function() {
		return Agents.find({});
	},
	editName: function() {
		if (Session.get('editUid') != undefined) {
			var user = Meteor.users.findOne({_id: Session.get('editUid')});
			if (user && user.services.google && user.services.google.name)
				return user.services.google.name
			else
				return user.username
		}
	},
	keyOf: function(r) {
		console.log('keyOf', r);
		return _.keys(r);
	},
	displayName: function(n) {
		switch (n) {
			case 'Agents': return 'Equipe';
			case 'Customers': return 'Acquéreurs';
			case 'Meetings': return 'Agenda';
			case 'Properties': return 'Propriétés';
			case 'Estimations': return 'Estimations';
			case 'Editor': return 'Personalisations';
			default: return '';
		}
	},
	isChecked: function(s) {
		return s == 'true' ? 'checked' : '';
	},
	roles: function(r) {
		console.log(r);
		if (Session.get('editUid') != undefined) {
			var user = Meteor.users.findOne({_id: Session.get('editUid')});
			var roles = {
				Agents: { name: 'Agents', get: 'false', list: 'false',
									insert: 'false', update: 'false', remove: 'false' },
				Customers: { name: 'Customers', get: 'false', list: 'false', 
									insert: 'false', update: 'false', remove: 'false' },
				Meetings: { name: 'Meetings', get: 'false', list: 'false',
									insert: 'false', update: 'false', remove: 'false' },
				Properties: { name: 'Properties', get: 'false', list: 'false',
									insert: 'false', update: 'false', remove: 'false' },
				Estimations: { name: 'Estimations', get: 'false', list: 'false',
									insert: 'false', update: 'false', remove: 'false' },
				Editor: { name: 'Editor', get: 'false', list: 'false',
									insert: 'false', update: 'false', remove: 'false' }
			};
			_.each(_.keys(user.roles), function(collection) {
				_.each(user.roles[collection], function(role) {
					roles[collection][role] = 'true';
				});
			});
			if (r) {
				console.log('return roles[r];', roles[r]);
				return roles[r];
			}
			console.log('return roles;', roles);
			return roles;
		} else {
			return [];
		}
	}
});

Template.Agents.events({
	'click button.addAgent': function(e,t) {
        Modal.show('addAgent');
	},
	'change #editPermForm input': function(e,t) {
		Meteor.call('updateRoles', {
			uid: Session.get('editUid'),
			collection: $(e.currentTarget).data('collection'),
			method: $(e.currentTarget).data('method')
		}, function(e,r) {
			console.log(e,r);
		});
	},
	'click .grid-item.usercard': function(e,t) {
		if ($(e.currentTarget).hasClass('size-2')) {
			$(e.currentTarget).removeClass('size-2');
			$(e.currentTarget).addClass('size-1');
		} else {
			$(e.currentTarget).removeClass('size-1');
			$(e.currentTarget).addClass('size-2');
		}
		Meteor.setTimeout(function() {
			$('.grid').isotope('arrange');
		}, 220);
	}
});

Template.addAgent.events({
	'submit form': function(e,t) {
		e.preventDefault();
		Meteor.call('addUser', e.currentTarget.inputUsername.value, function(err){
			if (err)
				console.log(err);
			else
				$('#addAgent').closeModal();
		});
	}
});

