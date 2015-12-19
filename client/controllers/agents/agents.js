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
	}
});

Template.Agents.onRendered(function(){
	$('.side-nav li').removeClass('active');
	$('.side-nav li.agents').addClass('active');
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
	}
});

Template.Agents.events({
	'click button.addAgent': function(e,t) {
		$('#addAgent').openModal();
	}
	// 'click .grid-item.usercard': function(e,t) {
	// 	if ($(e.currentTarget).hasClass('size-2')) {
	// 		$(e.currentTarget).removeClass('size-2');
	// 		$(e.currentTarget).addClass('size-1');
	// 	} else {
	// 		$(e.currentTarget).removeClass('size-1');
	// 		$(e.currentTarget).addClass('size-2');
	// 	}
	// 	Meteor.setTimeout(function() {
	// 		$('.grid').isotope('arrange');
	// 	}, 220);
	// }
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

