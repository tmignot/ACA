Template.Customer.onRendered(function() {
	$('.nav-side-menu .active').removeClass('active');
	$('.nav-side-menu .customers-link').addClass('active');
	$('.from.datetimepicker, .to.datetimepicker').datetimepicker({
		format:'d M Y H:i',
		lang:'fr',
		step: 5
	});
});

Template.Customer.helpers({
	translateType: function() {
		if (Template.instance().data) {
			switch (Template.instance().data.type) {
				case 'rent': return 'Locataire';
				case 'sell': return 'Vendeur/Bailleur';
				case 'search': return 'Acheteur';
				default: return '';
			}
		}
	},
	meetings: function() {
		if (Template.instance().data) {
			var meetings = Meetings.find({customer: Template.instance().data._id}, {limit: 10});
			if (meetings.count())
				return meetings;
		}
	},
	documents: function() {
		if (Template.instance().data) {
			var docs = Template.instance().data.documents;
			if (docs && docs.length)
				return Documents.find({_id: {$in: docs}});
		}
	},
	agentName: function(id) {
		var agent = Agents.findOne({_id: id});
		if (agent)
			return agent.username;
	},
	dispDate: function(date) {
		if (date)
			return moment(date).format('DD/MM/YYYY HH[h]mm');
	},
	properties: function() {
		if (Template.instance().data) {
			var properties = Template.instance().data.properties;
			if (properties && properties.length)
				return Properties.find({reference: {$in: properties}});
		}
	},
	fileClass: function(type) {
		switch(type) {
			case 'pdf': return 'fa-file-pdf-o';
			case 'application/pdf': return 'fa-file-pdf-o';
			case 'jpg': return 'fa-file-image-o';
			case 'image/jpg': return 'fa-file-image-o';
			case 'image/jpeg': return 'fa-file-image-o';
			case 'zip': return 'fa-file-archive-o';
			case 'gzip': return 'fa-file-archive-o';
			case '7zip': return 'fa-file-archive-o';
			case 'rar': return 'fa-file-archive-o';
			case 'application/zip': return 'fa-file-archive-o';
			case 'application/gzip': return 'fa-file-archive-o';
			case 'application/7zip': return 'fa-file-archive-o';
			case 'application/rar': return 'fa-file-archive-o';
			default: console.log(type); return 'fa-file-o';
		}
	},
	size: function(chunk) {
		return filesize(chunk).human();
	}
});

Template.Customer.events({
	'click .meetingInput button': function(e,t) {
		data = {
			agent: Meteor.user()._id,
			customer: Template.instance().data._id,
			from: new Date($('.from .from').val()),
			to: new Date($('.to .to').val()),
			description: t.find('.description textarea.description').value
		};
		var new_meeting = {};
		_.each(_.toPairs(data), function(p) {
			if (p[1] && p[1] != '') {
				if (p[0] != 'to' || t.find('.to input.to').value != ''){
					console.log(t.find('.to input.to').value);
					new_meeting[p[0]] = p[1];
				}
			}
		});
		var ctx = MeetingSchema.newContext();
		$('.meetingInput div').removeClass('has-error');
		console.log(new_meeting);
		if (!ctx.validate(new_meeting)) {
			_.each(ctx.invalidKeys(), function(k) {
				console.log(k);
				$('.meetingInput .'+k.name).addClass('has-error');
			});
		} else {
			var m = Meetings.insert(new_meeting);
			var user = Agents.find({_id: Meteor.user()._id},{fields: {services: 1, emails: 1}}).fetch();
			user = user[0];
			console.log(user);
			if (user && user.services && user.services.google) {
				var addr = user.emails[0].address;
				var path = 'calendar/v3/calendars/primary/events';
				var options = {
					summary: new_meeting.summary = t.data.name,
					start: { dateTime: (new Date(new_meeting.from)).toISOString()},
					end: { dateTime: (new Date(new_meeting.to)).toISOString()}
				}
				console.log(options);
				GoogleApi.post(path, {user: user, data: options}, function(e,r) {
					if (!e) {
						Meetings.update(m, {$set: {gid: r.id}});
					}
					console.log({error: e, result: r, m: m});
				});
			}
		}
	},
	'click .remove-meeting': function(e,t) {
		var id = $(e.currentTarget).data('meeting-id');
		var m = Meetings.findOne({_id: id});
		if (!m) { return }
		else {
			GoogleApi.delete('calendar/v3/calendars/primary/events/'+m.gid, 
				{
					user: Meteor.users.findOne({_id:m.agent}),
				}, function(e,r) {
					console.log(e,r);
					if (!e)
						Meetings.remove({_id: id});
					else {
						var hint = Meteor.user().emails[0].address;
						Meteor.loginWithGoogle({
							loginHint: hint,
							requestPermissions: ['email', 'https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly']
						});
					}
				}
			);
		}
	},
	'click .property-btn': function(e,t) {
		console.log($('.propertyInput').val());
		if (Properties.find({reference: $('.propertyInput').val()}).count())
			Customers.update({_id: t.data._id}, {$push: {properties: $('.propertyInput').val()}});
	},
	'click .remove-property': function(e,t) {
		var ref = $(e.currentTarget).data('property-ref');
		Customers.update({_id: t.data._id}, {$pull: {properties: ref}});
	},
	'focusin .dummy_documentInput': function(e,t) {
		$('.documentInput').click();
	},
	'change .documentInput': function(e,t) {
		$('.dummy_documentInput').val(e.currentTarget.files[0].name);
		$('.document-btn').focus();
	},
	'click .document-btn': function(e,t) {
		var doc = t.find('.documentInput').files[0];
		if (doc) {
			console.log('upload ',doc);
			Documents.insert(doc, function(e, new_doc) {
				console.log(e,new_doc)
				if (!e)
					Customers.update({_id: t.data._id}, {$push: {documents: new_doc._id}});
			});
		}
	},
	'click .remove-document': function(e, t) {
		var id = $(e.currentTarget).data('document-id');
		Documents.remove({_id: id}, function(e,r) {
			console.log(e,r);
			if (!e) {
				Customers.update({_id: t.data._id}, {$pull: {documents: id}});
			}
		});
	},
	'click .edit-btn': function(e,t) {
		Router.go('/admin/customers/edit/'+t.data._id);
	},
	'click .remove-btn': function(e,t) {
		if (Roles.userIsInRole(Meteor.user()._id, 'remove', 'Customers')) {
			var c = t.data;
			_.each(c.documents, function(d) {
				Documents.remove({_id: d}, function(e,r) {
					if (e)
						throw e
				});
			});
			Customers.remove(t.data._id, function(e,r) {
				if (!e)
					Router.go('/admin/customers');
				else
					throw e
			});
		}
	}
});
