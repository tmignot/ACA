Template.searchBar.onCreated(function() {
	this.results = new ReactiveVar([]);
	var p = Properties.find({}, {fields: {title: 1, description: 1, 'address.zipcode': 1, 'address.city': 1}}).fetch();
	this.zipcodes = _.map(p, function(i) {
			return {
				type: 'Code postal',
				value: i.address.zipcode
			}});
	this.cities = _.map(p, function(i) {
			return {
				type: 'Ville',
				value: i.address.city
			}});
	Session.set('pop', {query:[],filters:_.flatten([this.cities, this.zipcodes])});
	Session.set('filters', []);
	Session.set('showResults', false);
});


Template.searchBar.helpers({
	results: function() {
		return Template.instance().results.get();
	},
	filters: function() {
		return Session.get('filters');
	},
	pop: function() {
		var pop = Session.get('pop');;
		return [
			{
				name: 'query',
				valueKey: 'value',
				display: 'value',
				local: function(){ return Session.get('pop').query },
				template: 'pop'
			},
			{
				name: 'filters',
				valueKey: 'value',
				display: 'value',
				local: function(){ return Session.get('pop').filters },
				header: '<small>Ajouter un filtre</small>',
				template: 'pop'
			}
		];
	},
	parentData: function() {
		return Template.parentData(1);
	},
	results: function() {
		return Template.instance().results.get();
	},
	popOptions: function() {
		return Template.instance().popOptions.get();
	}
});

Template.searchBar.events({
	'click button': function(e,t) {
		filters = {};
		_.each(Session.get('filters'),function(f) {
			if (filters[f.key]) {
				if (_.isObject(filters[f.key]) && filters[f.key]['$in'])
					filters[f.key]['$in'].push(f.value);
				else {
					var cur = filters[f.key];
					filters[f.key] = {$in: [cur, f.value]};
				}
			} else {
				filters[f.key] = f.value;
			}
		});
		console.log(filters);
		filters.visible = true;
		filters.estimation = false;
		Pages.set({filters: filters});
		Session.set('showResults', true);
	},
	'keyup .query-input': function(e,t) {
		if (e.keyCode == 13) {
			if (Session.get('typeahead') == true)
				Session.set('typeahead', false);
			else
				t.find('.item-bar .btn-danger').click();
		}
	},
	'typeahead:select .typeahead': function(e,t) {
		Session.set('typeahead', true);
		var filters = Session.get('filters');
		var val = e.currentTarget.value;
		if (_.findIndex(t.cities, ['value', val])>=0)
			filters.push({key: 'address.city', value: val});
		else if (_.findIndex(t.zipcodes, ['value', val])>=0)
			filters.push({key: 'address.zipcode', value: val});
		Session.set('filters', _.uniqWith(filters, _.isEqual));
		$('.typeahead').typeahead('val', '');
		$('.query-input').val('');
		$('.query-input').focus();
	},
	'click .dropdown-menu': function(e,t) {
		e.stopPropagation();
	},
	'click .list-group-item-danger i': function(e,t) {
		var filters = Session.get('filters');
		var index = _.findIndex(filters,function(f) {
			return f.key == $(e.currentTarget).data('filterkey')	&&
						 f.value == $(e.currentTarget).data('filtervalue');
		});
		filters.splice(index, 1);
		Session.set('filters', filters);
	},
	'click .property-card': function(e,t) {
		Session.set('currentProperty', $(e.currentTarget).data('id'));
		$('.modal').modal();
	}
});

Template.searchBar.onRendered(function(){
$("button.btn-danger").css("background", Template.parentData(1).mainColor);
$("button.btn-danger").css("border-color", Template.parentData(1).mainColor);
	$("#transaction-type").multiselect(
		{
			enableClickableOptGroups: true,
			allSelectedText: "Toutes",
			nonSelectedText: "Options",
			buttonContainer: "<div class='button-container btn-group col-xs-3 col-md-2 first-select' role='group' />",
			buttonClass: "col-xs-12 btn btn-default"
		}
	);
	Meteor.typeahead.inject();
});

Template._pagesNav.onRendered(function() {
	$('.pagination .active a').css('color', Template.parentData(2).mainColor);
	$('.pagination .active a').css('border-color', Template.parentData(2).mainColor);
	Session.set('searched', true);
});

Template._pagesNav.events({
	'click a': function(e,t) {
		var color = Template.parentData(2).mainColor;
		$('pagination li a').css('background-color', 'black');
		$('.pagination .active a').css('color', 'white');
		$('.pagination .active a').css('border-color', 'white');
		$('html, body').animate({
				scrollTop:$('.results').offset().top
		}, 'fast');
		Meteor.setTimeout(function(){
			$('.pagination .active a').css('color', color);
			$('.pagination .active a').css('border-color', color);
	}, 100);
	},
	'click li:not(.disabled) a': function(e,t) {
		Session.set('searched', false);
	}
});

Template._pagesPage.onDestroyed(function() {
});

Template.annonceCard.onRendered(function(){
	$('.results .shadowed.row').css('box-shadow', Template.parentData(3).mainColor + ' 3px 3px 20px -8px');
});

Template.annonceCard.helpers({
	img: function() {
		return Images.find({_id: {$in: Template.instance().data.images||[]}})
	}
});

Template.properties.uihooks({
	'.page-container': {
		insert: function(node, next, tpl) {
			$(node).insertBefore(next);
			$(node).addClass('fadeIn animated');
		},
		move: function(node, next, tpl) {
			console.log('moving', node);
		},
		remove: function(node, tpl) {
			$(node).removeClass('fadeIn');
			$(node).addClass('fadeOut');
			Meteor.setTimeout(function() {
				$(node).remove();
				Session.set('searched', true);
			}, 500);
		}
	}
});
